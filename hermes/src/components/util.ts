import { Node, Edge } from "reactflow";
import hexRgb from "hex-rgb";
import { bandwidthTheme } from "../theme/theme";
import {
  DatabaseNodeStyle,
  InternetNodeStyle,
  StaticWebsiteNodeStyle,
  StorageContainerNodeStyle,
  VPCNodeStyle,
  WebServerNodeStyle,
} from "./Nodes/NodeStyle";
import { EdgeSecurityGroupConnectionConfig } from "./Nodes/nodeTypeInfo";

const VPC_RESIZE_INCREMENT = 100;

// Helper function. Checks if the node is in the VPC group/block. Returns the index of the landed VPC, else return -1
export function isInVPC(node: Node, nodes: Node[]) {
  if (node.id.indexOf("VPC") !== -1) {
    return -1;
  }

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id.indexOf("VPC") !== -1) {
      let blockX = node.position.x + +node.style!.width! / 2;
      let blockY = node.position.y + +node.style!.height! / 2;

      if (
        nodes[i].position.x < blockX &&
        nodes[i].position.x + +nodes[i].style!.width! > blockX &&
        nodes[i].position.y < blockY &&
        nodes[i].position.y + +nodes[i].style!.height! > blockY
      ) {
        return i;
      }
    }
  }

  return -1;
}

// Selected node info change
export function onNodeInfoChange(
  event: any,
  mode: string,
  selectedNode: Node | undefined,
  setSelectedNode: any
) {
  let updatedNode = selectedNode;
  if (updatedNode) {
    if (mode === "color") {
      let hex = hexRgb(event.target.value);
      let rgbString = "";
      if (hex) {
        rgbString =
          "rgb(" + hex.red + ", " + hex.green + ", " + hex.blue + ",0.75)";
      }
      updatedNode.style!.background = rgbString;
    } else if (mode === "name") {
      updatedNode.data = {
        ...selectedNode!.data,
        label: event.target.value,
      };
    } else if (mode === "amiId") {
      updatedNode.data = {
        ...selectedNode!.data,
        amiId: event.target.value,
      };
    } else if (mode === "userDataScript") {
      updatedNode.data = {
        ...selectedNode!.data,
        userDataScript: event.target.value,
      };
    } else if (mode === "availabilityZone") {
      updatedNode.data = {
        ...selectedNode!.data,
        availabilityZone: event.target.value,
      };
    } else if (mode === "appPath") {
      updatedNode.data = {
        ...selectedNode!.data,
        appPath: event.target.value,
      };
    } else if (mode === "engine") {
      updatedNode.data = {
        ...selectedNode!.data,
        engine: event.target.value,
      };
    } else if (mode === "indexFile") {
      updatedNode.data = {
        ...selectedNode!.data,
        indexFile: event.target.value,
      };
    } else if (mode === "errorFile") {
      updatedNode.data = {
        ...selectedNode!.data,
        errorFile: event.target.value,
      };
    }
  }
  setSelectedNode({ ...selectedNode, ...updatedNode });
}

// Selected edge info change
export function onEdgeLabelChange(
  event: any,
  selectedEdge: Edge | undefined,
  setSelectedEdge: any
) {
  let updatedEdge = selectedEdge;
  if (updatedEdge) {
    updatedEdge.label = event.target.value;
  }
  setSelectedEdge({ ...selectedEdge, ...updatedEdge });
}

// Selected edge set checked ports
export function onEdgePortSelection(
  checkedPorts: number[],
  selectedEdge: Edge | undefined,
  setSelectedEdge: any
) {
  let updatedEdge = selectedEdge;
  if (updatedEdge) {
    updatedEdge.data = { ports: checkedPorts };
  }
  setSelectedEdge({ ...selectedEdge, ...updatedEdge });
}

// Update the nodes state after change in selected node
export function updateNodeConfig(
  selectedNode: Node | undefined,
  setNodes: any
) {
  if (selectedNode && selectedNode.id.includes("VPC")) {
    setNodes((nds: Node[]) => {
      let newNodes = nds.map((nd) => {
        if (nd.id === selectedNode.id) {
          return {
            ...nd,
            style: {
              ...nd.style,
              background: selectedNode.style!.background,
            },
          };
        }

        return nd;
      });

      return newNodes;
    });
  } else if (selectedNode && selectedNode.id.includes("WebServer")) {
    setNodes((nds: Node[]) => {
      let newNodes = nds.map((nd) => {
        if (nd.id === selectedNode.id) {
          return {
            ...nd,
            data: {
              ...nd.data,
              label: selectedNode?.data.label,
              amiId: selectedNode?.data.amiId,
              userDataScript: selectedNode?.data.userDataScript,
              availabilityZone: selectedNode?.data.availabilityZone,
              appPath: selectedNode?.data.appPath,
            },
            style: {
              ...nd.style,
              background: selectedNode.style!.background,
            },
          };
        }

        return nd;
      });

      return newNodes;
    });
  } else if (selectedNode && selectedNode.id.includes("Database")) {
    setNodes((nds: Node[]) => {
      let newNodes = nds.map((nd) => {
        if (nd.id === selectedNode.id) {
          return {
            ...nd,
            data: {
              ...nd.data,
              label: selectedNode?.data.label,
              engine: selectedNode?.data.engine,
            },
            style: {
              ...nd.style,
              background: selectedNode.style!.background,
            },
          };
        }

        return nd;
      });

      return newNodes;
    });
  } else if (selectedNode && selectedNode.id.includes("StorageContainer")) {
    setNodes((nds: Node[]) => {
      let newNodes = nds.map((nd) => {
        if (nd.id === selectedNode.id) {
          return {
            ...nd,
            data: {
              ...nd.data,
              label: selectedNode?.data.label,
              globallyUniqueName: selectedNode?.data.globallyUniqueName,
            },
            style: {
              ...nd.style,
              background: selectedNode.style!.background,
            },
          };
        }

        return nd;
      });

      return newNodes;
    });
  } else if (selectedNode && selectedNode.id.includes("StaticWebsite")) {
    setNodes((nds: Node[]) => {
      let newNodes = nds.map((nd) => {
        if (nd.id === selectedNode.id) {
          return {
            ...nd,
            data: {
              ...nd.data,
              label: selectedNode?.data.label,
              globallyUniqueName: selectedNode?.data.globallyUniqueName,
              indexFile: selectedNode?.data.indexFile,
              errorFile: selectedNode?.data.errorFile,
              appPath: selectedNode?.data.appPath,
            },
            style: {
              ...nd.style,
              background: selectedNode.style!.background,
            },
          };
        }

        return nd;
      });

      return newNodes;
    });
  }
}

export function toggleConfigVisibility(
  showConfigToggle: boolean,
  setNodes: any
) {
  setNodes((nds: Node[]) => {
    let newNodes = nds.map((nd) => {
      if (nd.id.includes("WebServer")) {
        return {
          ...nd,
          data: {
            ...nd.data,
            showConfigToggle: showConfigToggle,
          },
          style: {
            ...nd.style,
            height: showConfigToggle
              ? WebServerNodeStyle.maxHeight
              : WebServerNodeStyle.height,
          },
        };
      } else if (nd.id.includes("Database")) {
        return {
          ...nd,
          data: {
            ...nd.data,
            showConfigToggle: showConfigToggle,
          },
          style: {
            ...nd.style,
            height: showConfigToggle
              ? DatabaseNodeStyle.maxHeight
              : DatabaseNodeStyle.height,
          },
        };
      } else if (nd.id.includes("StaticWebsite")) {
        return {
          ...nd,
          data: {
            ...nd.data,
            showConfigToggle: showConfigToggle,
          },
          style: {
            ...nd.style,
            height: showConfigToggle
              ? StaticWebsiteNodeStyle.maxHeight
              : StaticWebsiteNodeStyle.height,
          },
        };
      } else {
        return nd;
      }
    });

    return newNodes;
  });
}

// Highlight selected node
export function highlightSelectedNode(
  selectedNode: Node | undefined,
  setNodes: any
) {
  setNodes((nds: Node[]) => {
    let newNodes = nds.map((nd) => {
      if (nd.id === selectedNode?.id) {
        return {
          ...nd,
          style: {
            ...nd.style,
            borderColor: bandwidthTheme.palette.primary.main,
          },
          deletable: true,
        };
      } else if (
        selectedNode?.id.includes("VPC") &&
        nd.parentNode === selectedNode.id
      ) {
        // If the VPC node is being deleted, allow all child nodes to be deletable to be deleted
        let defaultBorderColor: React.CSSProperties = VPCNodeStyle;
        if (nd.id.includes("WebServer"))
          defaultBorderColor = WebServerNodeStyle;
        else if (nd.id.includes("Database"))
          defaultBorderColor = DatabaseNodeStyle;

        return {
          ...nd,
          style: {
            ...nd.style,
            borderColor: defaultBorderColor?.borderColor,
          },
          deletable: true,
        };
      } else {
        let defaultBorderColor: React.CSSProperties;
        if (nd.id.includes("VPC")) defaultBorderColor = VPCNodeStyle;
        else if (nd.id.includes("WebServer"))
          defaultBorderColor = WebServerNodeStyle;
        else if (nd.id.includes("Database"))
          defaultBorderColor = DatabaseNodeStyle;
        else if (nd.id.includes("StorageContainer"))
          defaultBorderColor = StorageContainerNodeStyle;
        else if (nd.id.includes("StaticWebsite"))
          defaultBorderColor = StaticWebsiteNodeStyle;
        else defaultBorderColor = InternetNodeStyle; // Else, it is an internet block

        return {
          ...nd,
          style: {
            ...nd.style,
            borderColor: defaultBorderColor.borderColor,
          },
          deletable: false,
        };
      }
    });

    return newNodes;
  });
}

// Highlight selected edge
export function highlightSelectedEdge(
  selectedEdge: Edge | undefined,
  setEdges: any
) {
  setEdges((eds: Edge[]) => {
    let newNodes = eds.map((ed) => {
      if (ed.id === selectedEdge?.id) {
        return {
          ...ed,
          style: {
            ...ed.style,
            stroke: bandwidthTheme.palette.primary.main,
          },
        };
      } else {
        return {
          ...ed,
          style: {
            ...ed.style,
            stroke: "black",
          },
        };
      }
    });

    return newNodes;
  });
}

export function resizeVPCNode(
  mode: string,
  vpcId: string | undefined,
  setNodes: any
) {
  let resize = 0;
  if (mode === "increase") {
    resize = +VPC_RESIZE_INCREMENT;
  } else if (mode === "decrease") {
    resize = -VPC_RESIZE_INCREMENT;
  }

  setNodes((nds: Node[]) => {
    let newNodes = nds.map((nd) => {
      if (nd.id === vpcId) {
        return {
          ...nd,
          style: {
            ...nd.style,
            width: +nd.style!.width! + resize,
            height: +nd.style!.height! + resize,
          },
          data: {
            ...nd.data,
            updatedWidth: +nd.style!.width! + resize,
            updatedHeight: +nd.style!.height! + resize,
          },
        };
      }

      return nd;
    });

    return newNodes;
  });
  repositionChildrenNode(vpcId, setNodes);
}

export function repositionChildrenNode(
  parentNode: string | undefined,
  setNodes: any
): boolean {
  if (!parentNode) return false;

  let repositioned = false;
  setNodes((nds: Node[]) => {
    let pNd = nds.find((nd) => nd.id === parentNode);
    let pNdWidth = +pNd!.style!.width!;
    let pNdHeight = +pNd!.style!.height!;

    let newNodes = nds.map((nd) => {
      let ndX = +nd.position!.x;
      let ndY = +nd.position!.y;
      let ndWidth = +nd.style!.width!;
      let ndHeight = +nd.style!.height!;
      if (nd.parentNode === parentNode) {
        repositioned = true;
        let repositionedX = 0;
        let repositionedY = 0;
        if (ndX + ndWidth > pNdWidth) {
          repositionedX = pNdWidth - ndWidth;
        } else if (ndX < 0) {
          repositionedX = 0;
        } else {
          repositionedX = ndX;
        }
        if (ndY + ndHeight > pNdHeight) {
          repositionedY = pNdHeight - ndHeight;
        } else if (ndY < 0) {
          repositionedY = 0;
        } else {
          repositionedY = ndY;
        }

        return {
          ...nd,
          position: {
            x: repositionedX,
            y: repositionedY,
          },
        };
      }

      return nd;
    });

    return newNodes;
  });

  return repositioned;
}
