import { JsonObject, JsonProperty, JsonSerializer, throwError } from 'typescript-json-serializer';

// Class holding all of the necessary information about the diagram passed between the frontend and backend as a
// serialized JSON file serialized and deserialized using the "typescript-json-serializer" library
@JsonObject()
export class Diagram {
    constructor(
        @JsonProperty({required: true}) public id: string,
        @JsonProperty({required: true}) public name: string, 
        @JsonProperty({required: true}) public blocks: Block[], 
        @JsonProperty({required: true}) public connections: Connection[]) 
    {
        this.blocks = blocks;
        this.connections = connections;
        this.name = name;
    }
}

// Generalized block object in the diagram
@JsonObject()
export abstract class Block {
    constructor(
        @JsonProperty({required: true}) public id: string,
        @JsonProperty({required: true}) public name: string, 
        @JsonProperty({required: true}) public type: string) 
    {
        this.name = name;
        this.type = type;
        this.id = id;
    }
}

// Connection object between blocks in the diagram
@JsonObject()
export class Connection {
    constructor(
        @JsonProperty({required: true}) public id: string,
        @JsonProperty({required: true}) public source_id: string, 
        @JsonProperty({required: true}) public destination_id: string, 
        @JsonProperty({required: true}) public ports: number[])
    {
        this.source_id = source_id;
        this.destination_id = destination_id;
        this.ports = ports;
        this.id = id;
    }
}

// Specialized block object represented by "VPC" containers on the frontend
@JsonObject()
export class VPC extends Block {
    constructor(id: string, name: string, @JsonProperty({required: true}) public children: Block[]) {
        super(id, name, "VPC");
        
        this.children = children;
    }
}

// Specialized block object represented by "Web Server" blocks on the frontend
@JsonObject()
export class WebServer extends Block {
    constructor(
        id: string, 
        name: string, 
        @JsonProperty({required: true}) public amiId: string,
        @JsonProperty({required: true}) public availabilityZone: string,
        @JsonProperty() public userDataScript: string,
        @JsonProperty() public appPath: string) 
    {
        super(id, name, "WebServer");
        this.userDataScript = userDataScript;
        this.amiId = amiId;

        if (availabilityZone == null || availabilityZone == "") {
            this.availabilityZone = "us-east-1";
        } else {
            this.availabilityZone = availabilityZone;
        }
    }
}

// Specialized block object represented by "Database" blocks on the frontend
@JsonObject()
export class Database extends Block {
    constructor(
        id: string,
        name: string,
        @JsonProperty({required: true}) public engine: string)
    {
        super(id, name, "Database");
        this.engine = engine;
    }
}

// Specialized block object represented by "Storage Container" blocks on the frontend
@JsonObject()
export class StorageContainer extends Block {
    constructor(
        id: string,
        name: string)
    {
        super(id, name, "StorageContainer");
    }
}

// Specialized block object represented by "Static Website" blocks on the frontend
@JsonObject()
export class StaticWebsite extends Block {
    constructor(
        id: string,
        name: string,
        @JsonProperty({required: true}) public indexFile: string,
        @JsonProperty({required: true}) public errorFile: string,
        @JsonProperty({required: true}) public appPath: string)
    {
        super(id, name, "StaticWebsite");
        if (indexFile == null || indexFile == "") {
            this.indexFile = "index.html";
        } else {
            this.indexFile = indexFile;
        }

        if (errorFile == null || errorFile == "") {
            this.errorFile = "error.html";
        } else {
            this.errorFile = errorFile;
        }

        this.appPath = appPath;
    }
}