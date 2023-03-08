import { Node, Edge } from "react-flow-renderer";
import { JsonSerializer } from "typescript-json-serializer";

import {
  Block,
  Connection,
  Diagram,
  VPC,
  WebServer,
  Database,
  StaticWebsite,
  StorageContainer,
} from "../models/diagram";

export class DiagramService {
  public SerializeDiagram(diagram: Diagram): string {
    const defaultSerializer = new JsonSerializer();

    const data = defaultSerializer.serializeObject(diagram)!;

    return JSON.stringify(data);
  }

  public ExportDiagram(diagram: Diagram): Promise<string> {
    var json = this.SerializeDiagram(diagram);
    console.log(json);
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open("POST", `http://${process.env.REACT_APP_BACKEND_URL}`);
      request.onload = () => {
        if (request.status == 200) {
          resolve(request.responseText);
        } else {
          reject(request.responseText);
        }
      };
      request.setRequestHeader("Content-Type", "application/json");
      request.send(json);
    });
  }

  public BuildDiagram(name: string, nodes: Node[], edges: Edge[]): Diagram {
    let blocks: Block[] = [];
    let connections: Connection[] = [];

    nodes.forEach((n) => {
      let nodeName = n.id;
      if (nodeName.includes("VPC")) {
        let childrenNodes: Node[] = [];
        let childrenBlocks: Block[] = [];
        childrenNodes = nodes.filter((c) => c.parentNode == nodeName);
        childrenNodes.forEach((c) => {
          if (c.id.includes("WebServer")) {
            let webServer = new WebServer(
              c.id,
              c.data.label,
              c.data.amiId,
              c.data.availablityZone,
              c.data.userDataScript,
              c.data.appPath
            );
            childrenBlocks.push(webServer);
          } else if (c.id.includes("Database")) {
            let dataBase = new Database(c.id, c.data.label, c.data.engine);
            childrenBlocks.push(dataBase);
          }
        });
        let vpc: VPC = new VPC(n.id, n.id, childrenBlocks);
        blocks.push(vpc);
      } else if (nodeName.includes("StorageContainer")) {
        let storageContainer = new StorageContainer(n.id, n.data.label);
        blocks.push(storageContainer);
      } else if (nodeName.includes("StaticWebsite")) {
        let staticWebsite = new StaticWebsite(
          n.id,
          n.data.label,
          n.data.indexFile,
          n.data.errorFile,
          n.data.appPath
        );
        blocks.push(staticWebsite);
      }
    });

    edges.forEach((e) => {
      let source = e.source;
      let target = e.target;
      let connection: Connection = new Connection(
        e.id,
        source,
        target,
        e.data.ports
      );
      connections.push(connection);
    });

    return new Diagram("id", name, blocks, connections);
  }
}
