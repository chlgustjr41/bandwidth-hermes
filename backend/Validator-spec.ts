import { CdkObject } from "./CdkObject";
import { Block, Connection, Database, Diagram, StaticWebsite, StorageContainer, VPC, WebServer } from "./Diagram";
import { Validator } from "./Validator";

describe('Validator Tests', () => {

    it('Test Invalid Diagram Name', () => {
        let validator = new Validator();
        let diagram = new Diagram("id", "my-diagram", [], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('Found illegal - character in my-diagram');
    });

    it('Test Invalid WebServer Name', () => {
        let validator = new Validator();
        let block = new WebServer("1", "block\'", "", "", "", "");
        let vpc = new VPC("2", "vpc", [block]);
        let diagram = new Diagram("id", "mydiagram", [vpc], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('Found illegal \' character in block\'');
    });

    it('Test WebServer Outside VPC', () => {
        let validator = new Validator();
        let block = new WebServer("1", "block", "", "", "", "");
        let vpc = new VPC("2", "vpc", []);
        let diagram = new Diagram("id", "mydiagram", [vpc, block], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('All WebServers must be inside a VPC');
    });

    it('Test StorageContainer and StaticWebsite Inside VPC', () => {
        let validator = new Validator();
        let block = new StorageContainer("1", "block");
        let vpc = new VPC("2", "vpc", [block]);
        let diagram = new Diagram("id", "mydiagram", [vpc], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('StorageContainers cannot be inside other VPCs');

        block = new StaticWebsite("1", "block", 'index.html', 'error.html', "");
        vpc = new VPC("2", "vpc", [block]);
        diagram = new Diagram("id", "mydiagram", [vpc], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('StaticWebsites cannot be inside other VPCs');
    });

    it('Test Invalid Database Name', () => {
        let validator = new Validator();
        let block = new Database("1", "block\'", "mysql");
        let vpc = new VPC("2", "vpc", [block]);
        let diagram = new Diagram("id", "mydiagram", [vpc], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('Found illegal \' character in block\'');
    });

    it('Test Database Outside VPC', () => {
        let validator = new Validator();
        let block = new Database("1", "block", "postgres");
        let vpc = new VPC("2", "vpc", []);
        let diagram = new Diagram("id", "mydiagram", [vpc, block], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('All Databases must be inside a VPC');
    });

    it('Test Invalid Database Engine', () => {
        let validator = new Validator();
        let block = new Database("1", "block", "Postgres");
        let vpc = new VPC("2", "vpc", [block]);
        let diagram = new Diagram("id", "mydiagram", [vpc], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('Database engine must be either \"postgres\" or \"mysql\"');
    });

    it('Test VPC Inside Another VPC', () => {
        let validator = new Validator();
        let vpc1 = new VPC("1", "vpc1", []);
        let vpc2 = new VPC("2", "vpc2", [vpc1]);
        let diagram = new Diagram("id", "mydiagram", [vpc1, vpc2], []);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('VPCs cannot be inside other VPCs');
    });

    it('Test Connection With Same Source and Dest', () => {
        let validator = new Validator();
        let block = new WebServer("2", "webserver", "", "", "", "");
        let vpc = new VPC("1", "vpc", [block]);
        let con = new Connection("3", "2", "2", [80]);
        let diagram = new Diagram("id", "mydiagram", [vpc], [con]);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('Connection source and destination cannot be the same');
    });

    it('Test Connections Between VPCs', () => {
        let validator = new Validator();
        let block1 = new WebServer("2", "webserver", "", "", "", "");
        let vpc1 = new VPC("1", "vpc", [block1]);
        let block2 = new WebServer("4", "webserver2", "", "", "", "");
        let vpc2 = new VPC("5", "vpc", [block2]);
        let con = new Connection("3", "2", "4", [80]);
        let diagram = new Diagram("id", "mydiagram", [vpc1, vpc2], [con]);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('Illegal connection: Blocks related to a VPC cannot connect outside that VPC');

        let con2 = new Connection("6", "2", "5", [80]);
        let diagram2 = new Diagram("id", "mydiagram", [vpc1, vpc2], [con2]);

        expect(() => {
            validator.checkDiagram(diagram2);
        }).toThrow('Illegal connection: Blocks related to a VPC cannot connect outside that VPC');

        let con3 = new Connection("6", "1", "5", [80]);
        let diagram3 = new Diagram("id", "mydiagram", [vpc1, vpc2], [con3]);

        expect(() => {
            validator.checkDiagram(diagram3);
        }).toThrow('Illegal connection: Blocks related to a VPC cannot connect outside that VPC');
    });

    it('Test Connection with Illegal Port Number', () => {
        let validator = new Validator();
        let block = new WebServer("2", "webserver", "", "", "", "");
        let vpc = new VPC("1", "vpc", [block]);
        let con = new Connection("3", "1", "2", [0]);
        let diagram = new Diagram("id", "mydiagram", [vpc], [con]);

        expect(() => {
            validator.checkDiagram(diagram);
        }).toThrow('Illegal connection: port numbers must be in the range [1,65535]');

        let con2 = new Connection("3", "1", "2", [65536]);
        let diagram2 = new Diagram("id", "mydiagram", [vpc], [con2]);

        expect(() => {
            validator.checkDiagram(diagram2);
        }).toThrow('Illegal connection: port numbers must be in the range [1,65535]');
    });

    it('Test Valid Diagram', () => {
        let webServers1: Block[] = [
            new WebServer("a", "WebServer", "AmznLinux", "us-east-1", "", ""),
            new WebServer("b", "WebServer", "AmznLinux", "us-east-1", "", ""),
            new WebServer("c", "WebServer", "AmznLinux", "us-east-1", "", ""),
            new Database("y", "Database", "postgres"),
        ];
        let webServers2: WebServer[] = [
            new WebServer("d", "WebServer", "AmznLinux", "us-east-1", "", ""),
            new WebServer("e", "WebServer", "AmznLinux", "us-east-1", "", ""),
        ];
        let blocks: Block[] = [
            new VPC("f", "MyVPC", webServers1),
            new VPC("g", "MyVPC", webServers2),
            new StorageContainer("z", "storage")
        ];
        let connections: Connection[] = [
            new Connection("h", "a", "b", [1]),
            new Connection("k", "d", "g", [1]),
            new Connection("i", "a", "c", [1]),
            new Connection("j", "a", "f", [1]),
            new Connection("w", "y", "f", [3306])
        ];

        let diagram = new Diagram("id", "Diagram", blocks, connections);
        let validator = new Validator();
        expect(() => {
            validator.checkDiagram(diagram);
        }).not.toThrow();
    });
});