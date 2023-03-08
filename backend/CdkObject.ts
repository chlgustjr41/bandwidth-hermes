import { FileWriter } from "./Tree";

// Abstract class representing each block or edge in the diagram
export abstract class CdkObject {

    constructor(
        private id: string,
        private variableName: string,
        protected resourceName: string) 
    {
        // Name used in the CDK script to refer to the variable that represents the object
        this.variableName = variableName;

        // Name given to the resource in AWS when deploying the configuration
        this.resourceName = resourceName;
    }

    // Use the given FileWriter to generate the CDK script code that will deploy the resource
    abstract generateSource(fileWriter: FileWriter): void;

    // Add the needed imports to deploy the resource to the given Set of imports
    abstract generateImports(importSet: Set<string>): void;

    // Get the id of this object
    public getId(): string { return this.id; }

    // Get the variable name of this object
    public getVariableName(): string { return this.variableName; }

    // Get the variable name of the security group created for this object
    protected static getSecurityGroupVariableName(sg: CdkObject): string {
        return sg.getVariableName() + "_sg";
    }

    // Get the resource name of the security group created for this object
    protected static getSecurityGroupResourceName(sg: CdkObject): string {
        return sg.resourceName + "-SecurityGroup";
    }
}

// EC2 object represented by the "Web Server" block on the frontend
export class EC2 extends CdkObject {

    constructor(
        id: string,
        variableName: string,
        protected resourceName: string,
        protected vpc: EC2VPC,
        protected instanceType: string,
        protected amiId: string,
        protected availabilityZone: string,
        protected isPublic: boolean,
        protected userDataScript: string,
        protected appPath: string) 
    {
        super(id, variableName, resourceName);
        this.instanceType = instanceType;
        this.vpc = vpc;
        this.amiId = amiId;
        this.availabilityZone = availabilityZone;
        this.isPublic = isPublic;
        this.userDataScript = this.formatUserData(userDataScript);
        this.appPath = appPath;
    }

    generateSource(fileWriter: FileWriter): void {

        // Write code that creates the secuirty group for this ec2 and sets the vpc that will have already been written to the file
        fileWriter.appendLine(
            `${CdkObject.getSecurityGroupVariableName(this)} = ec2.SecurityGroup(self, ` +
            `'${CdkObject.getSecurityGroupResourceName(this)}', ` +
            `vpc=${this.vpc.getVariableName()})`
        );

        // Prepare the amiId and machine image fields based on given data
        let machineImage: string = `ec2.MachineImage.generic_linux({"${this.availabilityZone}": "${this.amiId}"})`;
        if (this.amiId == null || this.amiId == "") {
            // default to Amazon Linux 2
            machineImage = "ec2.AmazonLinuxImage(generation=ec2.AmazonLinuxGeneration.AMAZON_LINUX_2)";
        }

        // Create IAM role for the EC2
        let roleName: string = `${this.getVariableName()}_role`;
        fileWriter.appendLine(`${roleName}=iam.Role(self, '${this.resourceName} Role', assumed_by=iam.ServicePrincipal('ec2.amazonaws.com'))`);
        fileWriter.appendLine(`${roleName}.add_managed_policy(iam.ManagedPolicy.from_aws_managed_policy_name('AmazonSSMManagedInstanceCore'))`);

        // Write code that actually declares the ec2 instance setting all the given fields
        fileWriter.appendLine(`${this.getVariableName()} = ec2.Instance(self, '${this.resourceName}',`);
        fileWriter.increaseIndent();
        fileWriter.appendLine(`instance_type=ec2.InstanceType('${this.instanceType}'),`);
        fileWriter.appendLine(`machine_image=${machineImage},`);
        if (this.isPublic) {
            fileWriter.appendLine('vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),');
        }
        fileWriter.appendLine(`vpc=${this.vpc.getVariableName()},`);
        fileWriter.appendLine(`security_group=${CdkObject.getSecurityGroupVariableName(this)},`);
        fileWriter.appendLine(`role=${roleName}`)
        fileWriter.decreaseIndent();
        fileWriter.appendLine(")")

        // Optionally bundle the app code with the EC2
        if (this.appPath != null && this.appPath != "") {
            let assetName: string = `${this.getVariableName()}_asset`;
            fileWriter.appendLine(`${assetName}=s3assets.Asset(self, '${this.resourceName} Asset', path='${this.appPath}')`);
            fileWriter.appendLine(`${assetName}.grant_read(${roleName})`);
            let filePathName: string = `${this.getVariableName()}_filepath`;
            fileWriter.appendLine(`${filePathName}=${this.getVariableName()}.user_data.add_s3_download_command(bucket=${assetName}.bucket, bucket_key=${assetName}.s3_object_key)`);
            fileWriter.appendLine(`${this.getVariableName()}.user_data.add_commands(f'cp {${filePathName}} app.zip')`);
            fileWriter.appendLine(`${this.getVariableName()}.user_data.add_commands('unzip app.zip')`);
        }

        // Optionally write code to set the user data script if given by the user
        if (this.userDataScript != null && this.userDataScript != "") {
            fileWriter.appendLine(`${this.getVariableName()}.add_user_data('${this.userDataScript}')`);
        }

        // If this is a public instance, provide its IP address as an output
        fileWriter.appendLine(`cdk.CfnOutput(self, '${this.resourceName} IP Address', value=${this.getVariableName()}.instance_public_ip)`);
    }
    generateImports(importSet: Set<string>): void {
        importSet.add("from aws_cdk import aws_ec2 as ec2");
        importSet.add("from aws_cdk import aws_iam as iam");

        if (this.appPath != null && this.appPath != "") {
            importSet.add("from aws_cdk import aws_s3_assets as s3assets");
        }
    }

    // Helper function that formats the provided user data script so it will function properly in the generated cdk script
    private formatUserData(userData: string): string {
        if (userData == null || userData == undefined) {
            return "";
        }

        function replaceAll(s: string, find: string, replace: string): string {
            let i: number = 0;
            while (s.includes(find, i)) {
                i = s.indexOf(find, i);
                s = s.substring(0, i) + replace + s.substring(i + find.length);
                i += replace.length;
            }
            return s;
        }

        userData = replaceAll(userData, "\r", "");
        userData = replaceAll(userData, "\n", "\\n");
        userData = replaceAll(userData, "\"", "\\\"");
        userData = replaceAll(userData, "\'", "\\'");
        return userData;
    }
}

// Connection object represented by a black connection dragged between objects on the frontend
export class SecurityGroupConnection extends CdkObject {

    constructor(
        id: string,
        protected source: CdkObject,
        protected target: CdkObject,
        protected ports: number[],
        protected protocol: string)
    {
        super(id, "", "");
        this.source = source;
        this.target = target;
        this.ports = ports;
        this.protocol = protocol;
    }

    generateSource(fileWriter: FileWriter): void { 
        if (this.source instanceof EC2VPC || this.target instanceof EC2VPC) {
            this.generateSourceVPC(fileWriter);
        }
        else {
            this.generateSourceNonVPC(fileWriter);
        }
    }

    // Write code that generates basic connection between two security groups when neither source or target is a VPC
    generateSourceNonVPC(fileWriter: FileWriter) {

        for (let port of this.ports) {
            fileWriter.appendLine(
                `${CdkObject.getSecurityGroupVariableName(this.source)}.connections.allow_from` +
                `(ec2.Connections(security_groups=[${CdkObject.getSecurityGroupVariableName(this.target)}]), ` +
                `ec2.Port.${this.protocol}(${port}), ` +
                `'${this.determineDescription(port)}')`);
        }
    }

    // Write code that generates ingress rule for the VPC when one side of the connection is a VPC
    generateSourceVPC(fileWriter: FileWriter) {
        let sourceElement: CdkObject;

        if (this.source instanceof EC2VPC) {
            sourceElement = this.target;
        }
        else if (this.target instanceof EC2VPC) {
            sourceElement = this.source;
        }

        for (let port of this.ports) {
            fileWriter.appendLine(
                `${CdkObject.getSecurityGroupVariableName(sourceElement!)}` +
                `.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.${this.protocol}(${port}), ` +
                `'${this.determineDescription(port)}')`);
        }
    }

    private determineDescription(port: number): string {
        if (port == 22) {
            return "SSH";
        }
        else if (port == 80) {
            return "Web Server";
        }
        else if (port == 3306) {
            return "MySQL";
        }
        else if (port == 5432) {
            return "Postgres";
        }
        return "Unknown";
    }

    generateImports(importSet: Set<string>): void {
        importSet.add("from aws_cdk import aws_ec2 as ec2");
    }
}

// VPC object represented by a "VPC" container on the frontend
export class EC2VPC extends CdkObject {

    constructor(
        id: string,
        variableName: string,
        protected resourceName: string) 
    {
        super(id, variableName, resourceName);
    }

    generateSource(fileWriter: FileWriter): void {
        fileWriter.appendLine(`${this.getVariableName()} = ec2.Vpc(self, '${this.resourceName}', nat_gateways=1)`);
    }

    generateImports(importSet: Set<string>): void {
        importSet.add("from aws_cdk import aws_ec2 as ec2");
    }
}

// RDS object representing the "Database" object on the frontend
export class RDS extends CdkObject {

    constructor(
        id: string,
        variableName: string,
        protected resourceName: string,
        protected vpc: EC2VPC,
        protected instanceType: string,
        protected engine: string,
        protected isPublic: boolean,
        protected databaseName: string)
    {
        super(id, variableName, resourceName);
        this.engine = engine;
    }

    generateSource(fileWriter: FileWriter): void {

        // Write code that creates the secuirty group for this database and sets the vpc that will have already been written to the file
        fileWriter.appendLine(
            `${CdkObject.getSecurityGroupVariableName(this)} = ec2.SecurityGroup(self, ` +
            `'${CdkObject.getSecurityGroupResourceName(this)}', ` +
            `vpc=${this.vpc.getVariableName()})`
        );

        // Write code that actually declares this database instance in aws setting all the provided fields
        fileWriter.appendLine(`${this.getVariableName()} = rds.DatabaseInstance(self, '${this.resourceName}',`);
        fileWriter.increaseIndent();
        fileWriter.appendLine(`instance_type=ec2.InstanceType('${this.instanceType}'), `);
        fileWriter.appendLine(`engine=rds.DatabaseInstanceEngine.${this.engine.toUpperCase()},`);
        fileWriter.appendLine(`vpc=${this.vpc.getVariableName()}, `);
        fileWriter.appendLine(`security_groups=[${CdkObject.getSecurityGroupVariableName(this)}],`);
        if (this.isPublic) {
            fileWriter.appendLine('vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),');
        }
        fileWriter.appendLine(`credentials=rds.Credentials.from_generated_secret('${this.engine}_user'),`);
        fileWriter.appendLine(`database_name='${this.databaseName}',`);
        fileWriter.appendLine(`allocated_storage=${10},`);
        fileWriter.appendLine('multi_az=False');
        fileWriter.decreaseIndent();
        fileWriter.appendLine(')');
    }

    generateImports(importSet: Set<string>): void {
        importSet.add("from aws_cdk import aws_rds as rds");
    }
}

// S3Bucket object represented by both the "Storage Container" and "Static Website" blocks on the frontend
export class S3Bucket extends CdkObject {
    constructor(
        id: string,
        variableName: string,
        protected resourceName: string,
        protected indexFile?: string,
        protected errorFile?: string,
        protected appPath?: string)
    {
        super(id, variableName, resourceName);
    }

    generateSource(fileWriter: FileWriter): void {

        // Write code that declares the S3Bucket instance in aws setting all the given fields
        fileWriter.appendLine(`${this.getVariableName()} = s3.Bucket(self, '${this.resourceName}',`);
        fileWriter.increaseIndent();
        fileWriter.appendLine(`auto_delete_objects=True,`);

        // If the indexFile and errorFile are given, write code that sets them for the created S3Bucket -> effectively turning it to a static website
        if (this.indexFile != null && this.errorFile != null) {
            fileWriter.appendLine(`public_read_access=True,`);
            fileWriter.appendLine(`website_index_document='${this.indexFile}',`);
            fileWriter.appendLine(`website_error_document='${this.errorFile}',`);
        }
        else {
            fileWriter.appendLine(`public_read_access=False,`);
        }
        fileWriter.appendLine(`removal_policy= cdk.RemovalPolicy.DESTROY`);
        fileWriter.decreaseIndent();
        fileWriter.appendLine(`)`);

        // Write the users application to the S3 bucket if provided
        if (this.appPath != null && this.appPath != "") {
            fileWriter.appendLine(`s3_deployment.BucketDeployment(self, "${this.resourceName} Deployment",`);
            fileWriter.increaseIndent();
            fileWriter.appendLine(`sources=[s3_deployment.Source.asset("${this.appPath}")],`);
            fileWriter.appendLine(`destination_bucket= ${this.getVariableName()}`);
            fileWriter.decreaseIndent();
            fileWriter.appendLine(")");
        }
    }

    generateImports(importSet: Set<string>): void {
        importSet.add("from aws_cdk import aws_s3 as s3");

        if (this.appPath != null && this.appPath != "") {
            importSet.add("from aws_cdk import aws_s3_deployment as s3_deployment");
        }
    }
}
