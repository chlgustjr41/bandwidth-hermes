import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { bandwidthTheme } from "../theme/theme";
import {
  VPCNodeStyle,
  WebServerNodeStyle,
  DatabaseNodeStyle,
  StorageContainerNodeStyle,
  StaticWebsiteNodeStyle,
} from "./Nodes/NodeStyle";
import { FloatingEdge, OnewayFloatingEdge } from "./FloatingEdge/FloatingEdge";
import ConnectionLine from "./FloatingEdge/ConnectionLine";
import { CanvasProps } from "./interface";
import {
  VPCNode,
  WebServerNode,
  DatabaseNode,
  StorageContainerNode,
  StaticWebsiteNode,
  InternetNode,
} from "./Nodes/CustomNode";
import EditPanel from "./EditPanel";
import {
  EdgeSecurityGroupConnectionConfig,
  NodeDatabaseConfig,
  NodeStaticWebsiteConfig,
  NodeStorageContainerConfig,
  NodeVPCConfig,
  NodeWebServerConfig,
} from "./Nodes/nodeTypeInfo";
import {
  highlightSelectedEdge,
  highlightSelectedNode,
  isInVPC,
  repositionChildrenNode,
  resizeVPCNode,
  toggleConfigVisibility,
  updateNodeConfig,
} from "./util";

const edgeTypes = {
  floating: FloatingEdge,
  onewayFloating: OnewayFloatingEdge,
};

const nodeTypes = {
  internetNode: InternetNode,
  vpcNode: VPCNode,
  webserverNode: WebServerNode,
  databaseNode: DatabaseNode,
  storagecontainerNode: StorageContainerNode,
  staticwebsiteNode: StaticWebsiteNode,
};

const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
  const {
    reactFlowInstance,
    setReactFlowInstance,
    initialNodes,
    initialEdges,
    isLoading,
    setIsLoading,
    showConfigToggle,
  } = props;

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge<any | EdgeSecurityGroupConnectionConfig>[]>(
      initialEdges
    );
  const [vpcNodeId, setVpcNodeId] = useState(0);
  const [webserverNodeId, setWebserverNodeId] = useState(0);
  const [databaseNodeId, setDatabaseNodeId] = useState(0);
  const [storageContainerNodeId, setStorageContainerNodeId] = useState(0);
  const [staticWebsiteNodeId, setStaticWebsiteNodeId] = useState(0);

  const [capturedNodeState, setCapturedNodeState] = useState<
    Node | undefined
  >();
  const [isNewNodeSpawned, setIsNewNodeSpawned] = useState(false);
  const [isRepositioned, setIsRepositioned] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [selectedNode, setSelectedNode] = useState<Node | undefined>();
  const [selectedEdge, setSelectedEdge] = useState<
    Edge<any | EdgeSecurityGroupConnectionConfig> | undefined
  >();

  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [advancedConfigChecked, setAdvancedConfigChecked] = useState(false);

  // For highlighting the edge
  useEffect(() => {
    highlightSelectedEdge(selectedEdge, setEdges);
  }, [selectedEdge]);

  // For real-time updating the config info of the selected node
  useEffect(() => {
    if (selectedEdge) {
      setEdges((eds) => {
        let newEdges: Edge<any | EdgeSecurityGroupConnectionConfig>[] = eds.map(
          (ed) => {
            if (ed.id === selectedEdge.id) {
              return {
                ...ed,
                label: selectedEdge?.label,
                data: { ports: selectedEdge.data?.ports },
              };
            }

            return ed;
          }
        );

        return newEdges;
      });
    }
  }, [selectedEdge?.label, selectedEdge?.data]);

  // For highlighting the node and restoring back to its color
  useEffect(() => {
    highlightSelectedNode(selectedNode, setNodes);
  }, [selectedNode, setNodes]);

  // For real-time updating the configuration data of the selected Node
  useEffect(() => {
    updateNodeConfig(selectedNode, setNodes);

    // Update the port if the Database engine changes
    if (selectedNode?.id.includes("Database")) {
      let port = 80;
      if (selectedNode?.data.engine.includes("mysql")) {
        port = 3306;
      } else if (selectedNode?.data.engine.includes("postgres")) {
        port = 5432;
      }
      setEdges((eds) => {
        let newEdges: Edge<any | EdgeSecurityGroupConnectionConfig>[] = eds.map(
          (ed) => {
            if (ed.id.includes("Database") && ed.id.includes("WebServer")) {
              return {
                ...ed,
                data: { ports: [port] },
              };
            }

            return ed;
          }
        );

        return newEdges;
      });
    }
  }, [selectedNode?.data, selectedNode?.style!.background]);

  // For on load event from the parent class
  useEffect(() => {
    if (isLoading) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setIsEditPanelOpen(false);
      setSelectedNode(undefined);
      setSelectedEdge(undefined);

      let vpcCounter = 0;
      let webserverCounter = 0;
      let databaseCounter = 0;
      let storagecontainerCounter = 0;
      let staticwebsiteCounter = 0;
      initialNodes.forEach((nd) => {
        if (nd.id.includes("VPC")) {
          let currentIncrement = +nd.id.substring("VPC".length);
          if (vpcCounter < currentIncrement) {
            vpcCounter = currentIncrement;
          }
        } else if (nd.id.includes("WebServer")) {
          let currentIncrement = +nd.id.substring("WebServer".length);
          if (webserverCounter < currentIncrement) {
            webserverCounter = currentIncrement;
          }
        } else if (nd.id.includes("Database")) {
          let currentIncrement = +nd.id.substring("Database".length);
          if (databaseCounter < currentIncrement) {
            databaseCounter = currentIncrement;
          }
        } else if (nd.id.includes("StorageContainer")) {
          let currentIncrement = +nd.id.substring("StorageContainer".length);
          if (storagecontainerCounter < currentIncrement) {
            storagecontainerCounter = currentIncrement;
          }
        } else if (nd.id.includes("StaticWebsite")) {
          let currentIncrement = +nd.id.substring("StaticWebsite".length);
          if (staticwebsiteCounter < currentIncrement) {
            staticwebsiteCounter = currentIncrement;
          }
        }
      });

      setVpcNodeId(++vpcCounter);
      setWebserverNodeId(++webserverCounter);
      setDatabaseNodeId(++databaseCounter);
      setStorageContainerNodeId(++storagecontainerCounter);
      setStaticWebsiteNodeId(++staticwebsiteCounter);
      setIsLoading(false);

      setIsNewNodeSpawned(true);
    }
  }, [initialNodes, initialEdges]);

  // For repositioning VPC's child nodes when the nodes are visually overflowing
  useEffect(() => {
    if (!isRepositioned) {
      nodes.forEach((nd) => {
        if (nd.id.includes("VPC")) {
          repositionChildrenNode(nd.id, setNodes);
        }
      });
      setIsRepositioned(true);
    }
  }, [isRepositioned, showConfigToggle]);

  // For toggling to show the configuration information on nodes
  useEffect(() => {
    toggleConfigVisibility(showConfigToggle, setNodes);
    if (isNewNodeSpawned) setIsNewNodeSpawned(false);
    if (showConfigToggle) setIsRepositioned(false);
  }, [isNewNodeSpawned, showConfigToggle]);

  // Called when a node has stopped dragging. For non-VPC blocks, identifies if the node has landed on VPC group/block and updates the parent
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.id.indexOf("VPC") !== -1 || node.id.indexOf("Gateway") !== -1)
        return;

      // If being dragged, reset the parent node. Will be set again as the node lands on the VPC
      let prevParentNode = nodes.find((nd) => nd.id === node.parentNode);
      if (node.parentNode && node.parentNode.indexOf("VPC") !== -1) {
        node.parentNode = undefined;
        if (prevParentNode) {
          node.position.x += prevParentNode.position.x;
          node.position.y += prevParentNode.position.y;
        }
      }

      // Check if the node landed on the VPC group/block
      let vpcIndex = isInVPC(node, nodes);
      if (vpcIndex !== -1) {
        node.parentNode = nodes[vpcIndex].id;

        // Since the position is now relative to the parent, recalculate the position
        node.position.x -= nodes[vpcIndex].position.x;
        node.position.y -= nodes[vpcIndex].position.y;

        if (prevParentNode && node.parentNode !== prevParentNode.id) {
          resizeVPCNode("decrease", prevParentNode.id, setNodes);
          resizeVPCNode("increase", nodes[vpcIndex].id, setNodes);
        }
      }

      let updateNodeIndex = nodes.findIndex((nd) => nd.id === node.id);
      if (
        (node.id.includes("WebServer") || node.id.includes("Database")) &&
        vpcIndex === -1
      ) {
        // Recover to captured node state
        setNodes((nds) => {
          if (capturedNodeState) {
            nds[updateNodeIndex] = capturedNodeState;
            setErrorOpen(true);
            if (node.id.includes("WebServer")) {
              setErrorMessage(
                "Web Server block cannot exist outside of a VPC block."
              );
            } else if (node.id.includes("Database")) {
              setErrorMessage(
                "Database block cannot exist outside of a VPC block."
              );
            }
          }
          return nds;
        });
      } else if (
        (node.id.includes("Internet") ||
          node.id.includes("StaticWebsite") ||
          node.id.includes("StorageContainer")) &&
        vpcIndex !== -1
      ) {
        // Recover to captured node state
        setNodes((nds) => {
          if (capturedNodeState) {
            nds[updateNodeIndex] = capturedNodeState;
          }
          return nds;
        });

        // Open error dilogue
        setErrorOpen(true);
        if (node.id.includes("Internet")) {
          setErrorMessage("Internet block cannot be in a VPC block.");
        } else if (node.id.includes("StaticWebsite")) {
          setErrorMessage("Static Website block cannot be in a VPC block.");
        } else if (node.id.includes("StorageContainer")) {
          setErrorMessage("Storage Container block cannot be in a VPC block.");
        }
      } else {
        // Update the state with new node
        setNodes((nds) => {
          nds[updateNodeIndex] = node;
          return nds;
        });
        setEdges((eds) => {
          let updatedEdges = eds.filter(
            (ed) =>
              (ed.source.includes(node.id) &&
                nodes.find((nd) => nd.id === ed.target)?.parentNode ===
                  node.parentNode) ||
              (ed.target.includes(node.id) &&
                nodes.find((nd) => nd.id === ed.source)?.parentNode ===
                  node.parentNode) ||
              (!ed.target.includes(node.id) && !ed.source.includes(node.id)) ||
              node.parentNode === ed.target
          );
          return updatedEdges;
        });
      }

      nodes.forEach((nd) => {
        if (nd.id.includes("VPC")) {
          repositionChildrenNode(nd.id, setNodes);
        }
      });
      setCapturedNodeState(undefined);
    },
    [nodes, setNodes, setEdges, capturedNodeState, setCapturedNodeState]
  );

  // Creates floating edges on connect
  const onConnect = useCallback(
    (connection: Connection) => {
      let sourceNode = nodes.find((nd) => nd.id === connection.source);
      let targetNode = nodes.find((nd) => nd.id === connection.target);

      // For default port setting
      let port = 80; // webserver to webserver
      let databaseNode: Node<any | NodeDatabaseConfig> | undefined = undefined;
      if (targetNode?.id.includes("Database")) {
        databaseNode = targetNode;
      } else if (sourceNode?.id.includes("Database")) {
        databaseNode = sourceNode;
      }
      if (databaseNode?.data.engine.includes("mysql")) {
        port = 3306;
      } else if (databaseNode?.data.engine.includes("postgres")) {
        port = 5432;
      }

      // Security warning when database is directly connected to the internet which means a public database
      if (
        (sourceNode?.id.includes("VPC") &&
          targetNode?.id.includes("Database")) ||
        (sourceNode?.id.includes("Database") && targetNode?.id.includes("VPC"))
      ) {
        setWarningOpen(true);
        setWarningMessage(
          "This is a potential security risk. Any sensitive data in the database will be public to the Internet."
        );
      }

      // Simple validation to prevent making double layered edges
      let alreadyExists = false;
      edges.forEach((ed) => {
        if (
          ed.source === connection.target &&
          ed.target === connection.source
        ) {
          alreadyExists = true;
        }
      });
      if (connection.source === connection.target) return;
      if (alreadyExists) return;

      // Edge construction and logical validation
      if (
        sourceNode?.parentNode === targetNode?.id ||
        sourceNode?.id === targetNode?.parentNode
      ) {
        let edge: Edge<any | EdgeSecurityGroupConnectionConfig> = {
          id: "Edge-" + sourceNode?.id + "-" + targetNode?.id,
          source: sourceNode?.id.includes("VPC")
            ? targetNode!.id
            : sourceNode!.id,
          target: sourceNode?.id.includes("VPC")
            ? sourceNode!.id
            : targetNode!.id,
          type: "onewayFloating",
          zIndex: 5,
          style: {
            strokeWidth: 2.5,
            stroke: "black",
          },
          label: "",
          data: {
            ports: [port],
          },
        };
        setEdges((eds) => addEdge(edge, eds));
      } else if (sourceNode?.parentNode !== targetNode?.parentNode) {
        setErrorOpen(true);
        setErrorMessage(
          "VPC blocks can only be connected with its child blocks."
        );
      } else if (
        sourceNode?.id.includes("VPC") &&
        targetNode?.id.includes("VPC")
      ) {
        setErrorOpen(true);
        setErrorMessage("VPC blocks cannot be connected to each other.");
      } else {
        // For creating floating connection on any other connections
        let edge: Edge<any | EdgeSecurityGroupConnectionConfig> = {
          id: "Edge-" + sourceNode?.id + "-" + targetNode?.id,
          source: sourceNode!.id,
          target: targetNode!.id,
          type: "floating",
          zIndex: 5,
          style: {
            strokeWidth: 2.5,
            stroke: "black",
          },
          label: "",
          data: {
            ports: [port],
          },
        };
        setEdges((eds) => addEdge(edge, eds));
      }
    },
    [nodes, edges, setEdges]
  );

  // Called when a block from the toolbox drops on the canvas. Creates a new node on the canvas depending on the type of the block
  const onDrop = (event: any) => {
    // Should not be null
    if (!reactFlowWrapper.current) {
      return;
    }
    if (!reactFlowInstance) {
      return;
    }
    event.preventDefault();

    // Retrieving data from dropped element/block
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow/type");
    const blockName = event.dataTransfer.getData("application/reactflow/name");
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    // Creating a default node which the data will be appropriately filled
    let newNode: Node<
      | any
      | NodeVPCConfig
      | NodeWebServerConfig
      | NodeDatabaseConfig
      | NodeStorageContainerConfig
      | NodeStaticWebsiteConfig
    > = {
      id: "",
      type,
      position,
      data: { label: "" },
      deletable: false,
    };

    // Filling the default node data depending on its block name
    if (
      blockName === "VPC" ||
      blockName === "StaticWebsite" ||
      blockName === "StorageContainer"
    ) {
      newNode.type = type;
      let edgeType = "straight";

      if (blockName === "VPC") {
        newNode.id = blockName + vpcNodeId;
        newNode.style = { ...VPCNodeStyle };
        newNode.position.x -= Number(VPCNodeStyle.width) / 2;
        newNode.position.y -= Number(VPCNodeStyle.height) / 2;
        newNode.zIndex = -2;
        newNode.data = {
          updatedWidth: VPCNodeStyle.width,
          updatedHeight: VPCNodeStyle.height,
        };

        setVpcNodeId(vpcNodeId + 1); // Will be always able to create a VPC node

        edgeType = "onewayFloating";
      } else if (blockName === "StaticWebsite") {
        newNode.id = blockName + staticWebsiteNodeId;
        newNode.style = { ...StaticWebsiteNodeStyle };
        newNode.position.x -= Number(StaticWebsiteNodeStyle.width) / 2;
        newNode.position.y -= Number(StaticWebsiteNodeStyle.height) / 2;
        newNode.zIndex = -1;
        newNode.data = {
          label: "StaticWebsite" + staticWebsiteNodeId,
          showConfigToggle: showConfigToggle,
          appPath: "",
          indexFile: "index.html",
          errorFile: "error.html",
        };

        edgeType = "floating";
      } else if (blockName === "StorageContainer") {
        newNode.id = blockName + storageContainerNodeId;
        newNode.style = { ...StorageContainerNodeStyle };
        newNode.position.x -= Number(StorageContainerNodeStyle.width) / 2;
        newNode.position.y -= Number(StorageContainerNodeStyle.height) / 2;
        newNode.data = {
          label: "StorageContainer" + storageContainerNodeId,
          showConfigToggle: showConfigToggle,
        };

        edgeType = "floating";
      }

      let vpcIndex = isInVPC(newNode, nodes);
      if (vpcIndex !== -1 && blockName === "StaticWebsite") {
        setErrorOpen(true);
        setErrorMessage("Static Website cannot be created inside of the VPC.");
      } else if (vpcIndex !== -1 && blockName === "StorageContainer") {
        setErrorOpen(true);
        setErrorMessage(
          "Storage Container cannot be created inside of the VPC."
        );
      } else {
        // On success, increment id
        if (blockName === "StaticWebsite")
          setStaticWebsiteNodeId(staticWebsiteNodeId + 1);
        else if (blockName === "StorageContainer")
          setStorageContainerNodeId(storageContainerNodeId + 1);

        // Default connection is made to the VPC with the Internet block when the VPC is spawned
        setEdges((eds) =>
          addEdge(
            {
              label: "",
              id: newNode.id + "Automatic",
              source: "Internet",
              target: newNode.id,
              type: edgeType,
              style: {
                strokeWidth: 2.5,
                stroke: "black",
              },
              data: {
                ports: [],
              },
              deletable: false,
            },
            eds
          )
        );

        setNodes([newNode].concat(nodes));
        setIsNewNodeSpawned(true);
      }
    } else if (blockName === "WebServer" || blockName === "Database") {
      newNode.type = type;
      if (blockName === "WebServer") {
        newNode.id = blockName + webserverNodeId;
        newNode.style = { ...WebServerNodeStyle };
        newNode.position.x -= Number(WebServerNodeStyle.width) / 2;
        newNode.position.y -= Number(WebServerNodeStyle.height) / 2;
        newNode.data = {
          label: "WebServer" + webserverNodeId,
          showConfigToggle: showConfigToggle,
          amiId: "",
          userDataScript: "",
          availabilityZone: "us-east-1",
          appPath: "",
        };
      } else if (blockName === "Database") {
        newNode.id = blockName + databaseNodeId;
        newNode.style = { ...DatabaseNodeStyle };
        newNode.position.x -= Number(DatabaseNodeStyle.width) / 2;
        newNode.position.y -= Number(DatabaseNodeStyle.height) / 2;
        newNode.data = {
          label: "Database" + databaseNodeId,
          showConfigToggle: showConfigToggle,
          engine: "mysql",
        };
      }

      // Checking if the block was landed on the VPC block. If true, set the parent as the VPC block
      let vpcIndex = isInVPC(newNode, nodes);
      if (vpcIndex !== -1) {
        newNode.parentNode = nodes[vpcIndex].id;

        // Since the position is now relative to the parent, recalculate the position
        newNode.position.x -= nodes[vpcIndex].position.x;
        newNode.position.y -= nodes[vpcIndex].position.y;

        // On success, increment id
        if (blockName === "WebServer") setWebserverNodeId(webserverNodeId + 1);
        else if (blockName === "Database")
          setDatabaseNodeId(databaseNodeId + 1);

        // Concat and resize the parent VPC as well
        setNodes(nodes.concat(newNode));
        setIsNewNodeSpawned(true);
        resizeVPCNode("increase", newNode.parentNode, setNodes);
      } else if (blockName === "WebServer") {
        setErrorOpen(true);
        setErrorMessage(
          "Web Server block cannot be created outside of a VPC block."
        );
      } else if (blockName === "Database") {
        setErrorOpen(true);
        setErrorMessage(
          "Database block cannot be created outside of a VPC block."
        );
      }
    }
  };

  // Enables the dropping of toolbox block objects to the ReactFlow canvas
  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Capture or remember the state before drag. Will be used when reverting the invalid action
  const onNodeDragStart = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setCapturedNodeState(node);
    },
    [setCapturedNodeState]
  );

  // Set the selected node for Edit Panel pull up
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (node.selected && !node.id.includes("Internet")) {
        node.deletable = true;
        setSelectedNode(node);
        setSelectedEdge(undefined);
      }
    },
    [setSelectedNode, setSelectedEdge]
  );

  // Set the selected edge for Edit Panel pull up
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (edge.selected && !edge.id.includes("Automatic")) {
        setSelectedNode(undefined);
        setSelectedEdge(edge);
      }
    },
    [setSelectedNode, setSelectedEdge]
  );

  // Pane click means deselecting nodes
  const onPaneClick = useCallback(() => {
    setSelectedNode(undefined);
    setSelectedEdge(undefined);
  }, [setSelectedNode, setSelectedEdge]);

  // On delete, reset selected node info
  const onNodesDelete = useCallback(() => {
    setSelectedNode((deletingNode) => {
      resizeVPCNode("decrease", deletingNode?.parentNode, setNodes);
      return undefined;
    });
  }, [setNodes, setSelectedNode]);

  // On delete, reset selected edge info
  const onEdgesDelete = useCallback(() => {
    setSelectedEdge(undefined);
  }, [setSelectedEdge]);

  return (
    <>
      <Box display="flex" height="100%" width="100%" overflow="hidden">
        <Box height="100%" width="100%">
          <ReactFlowProvider>
            <div ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStart={onNodeDragStart}
                onNodeDragStop={onNodeDragStop}
                style={{
                  backgroundColor: bandwidthTheme.palette.primary.light,
                }}
                onDrop={onDrop}
                onInit={setReactFlowInstance}
                onDragOver={onDragOver}
                connectionLineComponent={ConnectionLine}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                deleteKeyCode="Delete"
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                connectionMode={ConnectionMode.Loose}
                fitView={true}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </Box>
        {(isEditPanelOpen || selectedNode || selectedEdge) && (
          <Box height="100%" width="12.5%">
            <EditPanel
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              selectedEdge={selectedEdge}
              setSelectedEdge={setSelectedEdge}
              setIsEditPanelOpen={setIsEditPanelOpen}
              advancedConfigChecked={advancedConfigChecked}
              setAdvancedConfigChecked={setAdvancedConfigChecked}
            />
          </Box>
        )}
      </Box>

      <Dialog
        onClose={() => {
          setErrorOpen(false);
        }}
        open={errorOpen}
      >
        <DialogTitle sx={{ fontSize: 40 }}>Error</DialogTitle>
        <DialogContentText
          paddingLeft={3}
          paddingRight={3}
          sx={{ fontSize: 24 }}
        >
          {errorMessage}
        </DialogContentText>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setErrorOpen(false);
            }}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        onClose={() => {
          setWarningOpen(false);
        }}
        open={warningOpen}
      >
        <DialogTitle sx={{ fontSize: 40 }}>Warning</DialogTitle>
        <DialogContentText
          paddingLeft={3}
          paddingRight={3}
          sx={{ fontSize: 24 }}
        >
          {warningMessage}
        </DialogContentText>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setWarningOpen(false);
            }}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Canvas;
