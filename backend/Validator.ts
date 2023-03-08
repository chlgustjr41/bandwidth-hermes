import { Block, Connection, Database, Diagram, VPC } from "./Diagram";

export class Validator {
    
    public checkDiagram(diagram: Diagram) {
        
        // Check 1: Diagram name cannot include illegal characters

        this.checkFor(diagram.name, ['-', '_', '\"', '\'', '\n']);
        
        // Check 2: Check all elements inside diagram
        
        for (let block of diagram.blocks) {
            this.checkBlock(block, diagram.blocks);
            if (block.type == "VPC") {
                for (var child of (block as VPC).children) {
                    this.checkBlock(child, diagram.blocks);
                }
            }
        }
        for (let con of diagram.connections) {
            this.checkConnection(con, diagram.blocks);
        }
    }
    
    private checkFor(input: string, strings: string[]): string {
        
        // Loop through every given illegal string
        for (let s of strings) {
            // If the input string contains the current illegal string
            if (input.search(s) != -1) {
                throw new Error('Found illegal ' + s + ' character in ' + input);
            }
        }
        return input;
    }

    private checkConnection(con: Connection, blocks: Block[]) {
        // ignore internet connections
        if (con.source_id == "Internet" || con.destination_id == "Internet") {
            return;
        }


        // Check 1: Source and destination must be different

        if (con.destination_id == con.source_id) {
            throw new Error('Connection source and destination cannot be the same');
        }

        let VPCs: Block[] = blocks.filter(v => v.type == 'VPC');
        // Search through all VPCs
        for (let v of VPCs) {
            let vpc = v as VPC;

            // Check 2: Connections inside a VPC must only be connected to other blocks in the VPC or the VPC itself
            // &
            // Check 3: VPC cannot be connected to another VPC

            // If the connection source is the VPC or the connection source is a child of the VPC
            if (con.source_id == v.id || vpc.children.find(c => c.id == con.source_id) != undefined) {
                // If the connection destination isn't the VPC and isn't a child of the VPC
                if (con.destination_id != v.id && vpc.children.find(c => c.id == con.destination_id) == undefined) {
                    throw new Error('Illegal connection: Blocks related to a VPC cannot connect outside that VPC');
                }
            }
        }

        // Check 4: Port number must be in range 1-65535
        for (let port of con.ports) {
            if (port > 65535 || port < 1) {
                throw new Error('Illegal connection: port numbers must be in the range [1,65535]');
            }
        }

        // Check 5: Storage Containers/Static Websites cannot be connected to Storage Containers/Static Websites
        let source = blocks.find(b => b.id == con.source_id);
        let dest = blocks.find(b => b.id == con.destination_id);
        if (source?.type == "StorageContainer" || source?.type == "StaticWebsite") {
            if (dest?.type == "StorageContainer" || dest?.type == "StaticWebsites") {
                throw new Error("StorageContainers and StaticWebsites can only be connected to the Internet");
            }
        }
    }

    private checkBlock(block: Block, blocks: Block[]) {
        
        // Check 1: Block name cannot contain illegal characters
        
        this.checkFor(block.name, ['\n', '\"', '\'']);

        let VPCs: Block[] = blocks.filter(v => v.type == 'VPC');

        // Check 2: If block is a web server or database, it must be in a VPC
        
        if (block.type == "WebServer" || block.type == "Database") {
            // count how many VPC's have a child that matches this block.
            // if > 0, this block is a child of a VPC
            let insideVPC = VPCs.map(v => (v as VPC).children)
                .filter(c => c.find(cb => cb.id == block.id) != undefined)
                .length != 0;

            if (!insideVPC) {
                throw new Error(`All ${block.type}s must be inside a VPC`);
            }
        }

        // Check 3: VPCs, Storage containers, and Static websites cannot be inside VPCs

        if (block.type == "VPC" || block.type == "StorageContainer" || block.type == "StaticWebsite") {
            // count how many VPC's have a child that matches this block.
            // if == 0, this block is a child of a VPC
            let insideVPC = VPCs.map(v => (v as VPC).children)
                .filter(c => c.find(cb => cb.id == block.id))
                .length;

            if (insideVPC) {
                throw new Error(`${block.type}s cannot be inside other VPCs`);
            }
        }

        // Check 4: Database engine must be either "postgres" or "mysql"

        if (block.type == "Database") {
            let database: Database = block as Database;

            if (database.engine != "postgres" && database.engine != "mysql") {
                throw new Error('Database engine must be either \"postgres\" or \"mysql\"');
            }
        }
    }
}
