import { Block, Connection, Diagram, VPC, WebServer } from "../models/diagram";
import { Node, Edge } from 'react-flow-renderer';
import { DiagramService } from "../services/diagramService"
import { HermesFile } from "../models/hermesFile";
import * as fs from 'fs';
import { JsonObject } from "typescript-json-serializer";

test('Serialize Empty Diagram', () => {
    let diagram: Diagram = new Diagram("id", "name", [], []);
    let ds: DiagramService = new DiagramService();

    let data: string = ds.SerializeDiagram(diagram);

    expect(data).toEqual("{\"id\":\"id\",\"name\":\"name\",\"blocks\":[],\"connections\":[]}");
});

test('Build Diagram Defaults', () => {
  let tuple = loadTestFile("src/tests/tests_files/HERMES_Test_Diagram_Defaults.json");
  let hermes: HermesFile = tuple[0];
  let flow: any = hermes.instance;
  let nodes: any = flow.nodes;
  let edges: any = flow.edges;
  let ds: DiagramService = new DiagramService();
  let diagram: Diagram = ds.BuildDiagram(hermes.name, nodes as Node<any>[], edges as Edge<any>[]);
  let data: string = ds.SerializeDiagram(diagram);
  let expected = ds.SerializeDiagram(tuple[1]);
  expect(data).toEqual(expected);
});

test('Build Diagram Configured', () => {
  let tuple = loadTestFile("src/tests/tests_files/HERMES_Test_Diagram_Configured.json");
  let hermes: HermesFile = tuple[0];
  let flow: any = hermes.instance;
  let nodes: any = flow.nodes;
  let edges: any = flow.edges;
  let ds: DiagramService = new DiagramService();
  let diagram: Diagram = ds.BuildDiagram(hermes.name, nodes as Node<any>[], edges as Edge<any>[]);
  let data: string = ds.SerializeDiagram(diagram);
  let expected = ds.SerializeDiagram(tuple[1]);
  expect(data).toEqual(expected);
});

test('Hash Load Validation', () => {
  let file = fs.readFileSync("src/tests/tests_files/Load_Validation_Test.hermes", "utf-8");
  let hermes = HermesFile.loadValidation(file);

  expect(hermes.hash).toEqual(HermesFile.hashFile(JSON.stringify(hermes.instance)));
});

test('Hash Load Validation Bad', () => {
  expect(() => {
    let file = fs.readFileSync("src/tests/tests_files/Load_Validation_Test_Bad.hermes", "utf-8");
    HermesFile.loadValidation(file);
  }).toThrow();
});

function loadTestFile(path: string) : [HermesFile, Diagram] {
  let json = JSON.parse(fs.readFileSync(path, "utf-8"));
  let hermes: HermesFile = json[0] as HermesFile;
  let diagram: Diagram = json[1] as Diagram;
  return [hermes, diagram];
}