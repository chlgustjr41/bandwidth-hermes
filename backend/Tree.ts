import { Block, Diagram, VPC, WebServer, Connection, Database, StorageContainer, StaticWebsite } from './Diagram'; 
import { CdkObject, EC2VPC, EC2, SecurityGroupConnection, RDS, S3Bucket } from './CdkObject';
import { EOL } from 'os';

// Single object encapsulating all necessary data needed from the Diagram object to create the CDK script
// in a way that allows for the tree to easily generate the source code for the script
export class Tree {

    // Counter used to create default variable names with numbers at the end for identification
    private variableNameCounter: number;

    // Map used to create default variable names with numbers at the end for identification. Contains different counter for each block type
    private resourceCounters: Map<string, number>;

    // Name for the entire diagram
    private diagramName: string;

    // Array of all elements in the entire diagram. Ordered in a way that allows for a linear iteration
    // through, generating source code for every element in order
    private elements: CdkObject[];

    constructor(diagram: Diagram) {
        this.elements = [];
        this.variableNameCounter = 0;
        this.resourceCounters = new Map<string, number>();
        this.diagramName = diagram.name;

        // Iterate through all blocks in the diagram
        for (let block of diagram.blocks) {

            // If block is a VPC, add VPC (and then all blocks and connections inside of it) to the tree
            // This ensure all of the VPCs are added before their contents - an order necessary to maintain in the cdk script
            if (block.type == "VPC") {
                let vpc: VPC = block as VPC;
                let connections: Connection[] = this.getConnectionsInVpc(vpc, diagram.connections);
                this.addVpcToTree(vpc, connections);
            }
            // If block is not a VPC or any type contained in a VPC, just go ahead and add them to the tree because order doesn't matter
            else if (block.type == "StorageContainer") {
                this.addStorageContainerToTree(block as StorageContainer);
            }
            else if (block.type == "StaticWebsite") {
                this.addStaticWebsiteToTree(block as StaticWebsite);
            }
        }
    }

    public getElements(): readonly CdkObject[] {
        return this.elements;
    }

    // Get an array of connections inside the given VPC
    private getConnectionsInVpc(vpc: VPC, connections: Connection[]): Connection[] {
        let filteredConnections: Connection[] = [];

        connections.forEach((connection) =>
        {
            if (connection.source_id == vpc.id && connection.destination_id != "Internet") {
                filteredConnections.push(connection);
            }
            else {
                let match = vpc.children.find(c => c.id == connection.source_id);
                if (match != null) {
                    filteredConnections.push(connection);
                }
            }
        });

        return filteredConnections;
    }

    // Add given VPC to the tree, then add all the blocks and connections contained inside of it
    private addVpcToTree(vpc: VPC, connections: Connection[]): void {
        let currentVPC: EC2VPC = new EC2VPC(vpc.id, this.generateUniqueVariableName(), this.generateUniqueResourceName(vpc.name));
        this.elements.push(currentVPC);
        vpc.children.forEach((block: Block) =>
        {
            // Determine if the block is "public" - or if it has a connection to it that also connects to the vpc itself
            let isPublic: boolean = connections.find(c => 
                (c.source_id == vpc.id && c.destination_id == block.id) 
                    || (c.destination_id == vpc.id && c.source_id == block.id)) != undefined;

            if (block.type == "WebServer") {
                this.addWebServerToTree(block as WebServer, currentVPC, isPublic);
            }
            if (block.type == "Database") {
                this.addDatabaseToTree(block as Database, currentVPC, isPublic);
            }
        });

        connections.forEach((connection) =>
        {
            this.addConnectionToTree(connection);
        });
    }

    // Add the given database to the tree with the correct fields
    private addDatabaseToTree(database: Database, vpc: EC2VPC, isPublic: boolean) {
        let resourceName = this.generateUniqueResourceName(database.name);
        this.elements.push(new RDS(
            database.id,
            this.generateUniqueVariableName(),
            resourceName,
            vpc,
            "t3.micro",
            database.engine,
            isPublic,
            `hermes-${this.diagramName}-${resourceName}`
        ));
    }

    // Add the given storage container to the tree with the correct fields
    private addStorageContainerToTree(storageContainer: StorageContainer) {
        this.elements.push(new S3Bucket(
            storageContainer.id,
            this.generateUniqueVariableName(),
            this.generateUniqueResourceName(storageContainer.name)
        ));
    }

    // Add the given static website to the tree with the correct fields
    private addStaticWebsiteToTree(staticWebsite: StaticWebsite) {
        this.elements.push(new S3Bucket(
            staticWebsite.id,
            this.generateUniqueVariableName(),
            this.generateUniqueResourceName(staticWebsite.name),
            staticWebsite.indexFile,
            staticWebsite.errorFile
        ));
    }

    // Add the given connection to the tree with the correct fields
    private addConnectionToTree(connection: Connection): void {
        let source: CdkObject = this.elements.find(e => e.getId() == connection.source_id)!;
        let target: CdkObject = this.elements.find(e => e.getId() == connection.destination_id)!;

        this.elements.push(new SecurityGroupConnection(
            connection.id,
            source,
            target,
            connection.ports,
            "tcp"
        ));
    }

    // Add the given web server to the tree with the correct fields
    private addWebServerToTree(webServer: WebServer, vpc: EC2VPC, isPublic: boolean): void {
        this.elements.push(new EC2(
            webServer.id,
            this.generateUniqueVariableName(),
            this.generateUniqueResourceName(webServer.name),
            vpc,
            "t3.nano",
            webServer.amiId,
            webServer.availabilityZone,
            isPublic,
            webServer.userDataScript,
            webServer.appPath
        ));
    }

    private generateUniqueVariableName(): string {
        this.variableNameCounter++;
        return "a" + this.variableNameCounter;
    }

    private generateUniqueResourceName(resourceName: string): string {
        if (!this.resourceCounters.has(resourceName)) {
            this.resourceCounters.set(resourceName, 0);
        }
        this.resourceCounters.set(resourceName, this.resourceCounters.get(resourceName)! + 1);

        return resourceName + this.resourceCounters.get(resourceName);
    }

    // Compile the tree into the final cdk script that will be returned. First iterate through the list of
    // objects and generate the imports. Then, iterate through the list again and generate the actual source code
    public compileTree() : string{
        // Write all the imports to the script - using a set of imports to avoid duplicates when multiple blocks require the same import
        let fileWriter = new FileWriter();
        let imports: Set<string> = new Set<string>();
        imports.add("import aws_cdk as cdk");
        imports.add("from aws_cdk import Stack");
        imports.add("from constructs import Construct");
        this.elements.forEach(function (element: CdkObject) {
            element.generateImports(imports);
        });
        imports.forEach(function (i: string) {
            fileWriter.appendLine(i);
        });

        // Write the boilerplate code to the script
        fileWriter.appendLine("class CdkWorkshopStack(Stack):");
        fileWriter.increaseIndent();
        fileWriter.appendLine("def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:");
        fileWriter.increaseIndent();
        fileWriter.appendLine("super().__init__(scope, construct_id, **kwargs)");

        // Write all element definitions to the script
        this.elements.forEach(function (element: CdkObject) {
            element.generateSource(fileWriter);
        });

        // Write more boilerplate code to the script
        fileWriter.decreaseIndent();
        fileWriter.decreaseIndent();
        fileWriter.appendLine("app = cdk.App()");
        fileWriter.appendLine(`CdkWorkshopStack(app, '${this.diagramName}')`);
        fileWriter.appendLine("app.synth()");

        return fileWriter.toString();
    }
}

// Utility class that manages a string buffer representing the contents of the generated script.
// Allows for easy writing of properly formatted lines and increase/decrease of indent level.
export class FileWriter {
    private file: string;
    private indent: number;

    constructor() {
        this.file = "";
        this.indent = 0;
    }

    public appendLine(word: string) {
        for (let i = 0; i < this.indent; i++) {
            this.file += "    ";
        }
        this.file += word;
        this.file += EOL;
    }

    public increaseIndent() {
        this.indent++;
    }

    public decreaseIndent() {
        this.indent--;
    }

    public toString(): string {
        return this.file;
    }
}
