import { Block, Connection, Database, Diagram, StaticWebsite, StorageContainer, VPC, WebServer } from './Diagram';
import { Tree } from './Tree';
import * as fs from 'fs';
import { CdkObject } from './CdkObject';

describe('Tree Tests', () => {
    it('Test Compile Empty Tree', () => {
        let tree: Tree = new Tree(new Diagram("id", "Diagram", [], []));
        let code: string = tree.compileTree();

        let expected: string = fs.readFileSync('test_files/boilerplate.py','utf8');
        expect(code).toEqual(expected);
    });

    it('Test Compile VPC', () => {
        let blocks: Block[] = [
            new VPC("a", "MyVPC", []),
            new VPC("b", "MyVPC", [])
        ];
        let tree: Tree = new Tree(new Diagram("id", "Diagram", blocks, []));
        let code: string = tree.compileTree();

        let expected: string = fs.readFileSync('test_files/vpc.py','utf8');
        expect(code).toEqual(expected);
    });

    it('Test Compile VPC and WebServers and Connections', () => {
        let blocks: Block[] = [
            new VPC("a", "VPC", [
                new WebServer("b", "my_web_server", "asjdfla;jdfk","avail-zone", "", ""),
                new WebServer("d", "hey", "amznLinux","avail-zone", "", "")
            ])
        ];
        let connections: Connection[] = [
            new Connection("c", "a", "b", [1]),
            new Connection("e", "d", "b", [2])
        ];
        let diagram: Diagram = new Diagram("id", "my_diagram", blocks, connections);
        let tree: Tree = new Tree(diagram);
        let code: string = tree.compileTree();

        let expected: string = fs.readFileSync('test_files/webservers.py', 'utf-8');
        expect(code).toEqual(expected);
    });

    it('Test Compile User Data Script', () => {
        let userDataScript: string = fs.readFileSync('test_files/user_data.sh', 'utf-8');
        let blocks: Block[] = [
            new VPC("a", "VPC", [
                new WebServer("b", "my_web_server", "asjdfla;jdfk", "avail-zone", userDataScript, ""),
            ])
        ];
        let connections: Connection[] = [
            new Connection("c", "a", "b", [80]),
        ];
        let diagram: Diagram = new Diagram("id", "my_diagram", blocks, connections);
        let tree: Tree = new Tree(diagram);
        let code: string = tree.compileTree();

        let expected: string = fs.readFileSync('test_files/user_data.py', 'utf-8');
        expect(code).toEqual(expected);
    });

    it('Test Tree Ordering', () => {
        let webServers1: WebServer[] = [
            new WebServer("a", "WebServer", "AmznLinux", "avail-zone", "", ""),
            new WebServer("b", "WebServer", "AmznLinux", "avail-zone", "", ""),
            new WebServer("c", "WebServer", "AmznLinux", "avail-zone", "", ""),
        ];
        let webServers2: WebServer[] = [
            new WebServer("d", "WebServer", "AmznLinux", "avail-zone", "", ""),
            new WebServer("e", "WebServer", "AmznLinux", "avail-zone", "", ""),
        ];
        let blocks: Block[] = [
            new VPC("f", "MyVPC", webServers1),
            new VPC("g", "MyVPC", webServers2),
        ];
        let connections: Connection[] = [
            new Connection("h", "a", "b", [1]),
            new Connection("k", "d", "g", [1]),
            new Connection("i", "a", "c", [1]),
            new Connection("j", "a", "f", [1]),
        ];

        let tree: Tree = new Tree(new Diagram("id", "Diagram", blocks, connections));
        let elements: readonly CdkObject[] = tree.getElements();

        expect(elements.length).toEqual(11);
        expect(elements[0].getId()).toEqual("f");
        expect(elements[1].getId()).toEqual("a");
        expect(elements[2].getId()).toEqual("b");
        expect(elements[3].getId()).toEqual("c");
        expect(elements[4].getId()).toEqual("h");
        expect(elements[5].getId()).toEqual("i");
        expect(elements[6].getId()).toEqual("j");
        expect(elements[7].getId()).toEqual("g");
        expect(elements[8].getId()).toEqual("d");
        expect(elements[9].getId()).toEqual("e");
        expect(elements[10].getId()).toEqual("k");
    });

    it('Database', () =>
    {
        let databases = [
            new Database("b", "my_database", "mysql")
        ];
        let blocks: Block[] = [
            new VPC("a", "VPC", databases)
        ];
        let connections: Connection[] = [
            new Connection("c", "a", "b", [3306])
        ];

        let diagram: Diagram = new Diagram("id", "mydiagramyyy", blocks, connections);
        let tree: Tree = new Tree(diagram);
        let code: string = tree.compileTree();

        let expected: string = fs.readFileSync('test_files/database.py', 'utf-8');
        expect(code).toEqual(expected);
    });

    it('Test Compile Storage Container', () =>
    {
        let storageContainer = new StorageContainer('a', 's3bucket');
        let diagram = new Diagram("id", 'mydiagramyyy', [storageContainer], []);
        let tree = new Tree(diagram);
        let code = tree.compileTree();

        let expected = fs.readFileSync('test_files/storage_container.py', 'utf-8');
        expect(code).toEqual(expected);
    });

    it('Test Compile Static Website', () =>
    {
        let staticWebsite = new StaticWebsite('a', 's3bucket', 'index.html', 'error.html', "");
        let diagram = new Diagram("id", 'mydiagramyyy', [staticWebsite], []);
        let tree = new Tree(diagram);
        let code = tree.compileTree();

        let expected = fs.readFileSync('test_files/static_website.py', 'utf-8');
        expect(code).toEqual(expected);
    });
});
