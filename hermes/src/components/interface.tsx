import { Edge, Node, ReactFlowInstance } from "react-flow-renderer";
import { EdgeSecurityGroupConnectionConfig } from "./Nodes/nodeTypeInfo";

export interface CanvasProps {
  reactFlowInstance: ReactFlowInstance | undefined;
  setReactFlowInstance(instance: ReactFlowInstance | undefined): any;
  initialNodes: Node[];
  initialEdges: Edge[];
  isLoading: boolean;
  setIsLoading(loading: boolean): any;
  showConfigToggle: boolean;
}

export interface RibbonProps {
  exportFunction(): any;
  saveFunction(): any;
  loadFunction(event: any): any;
  onShowConfigToggle(event: any): any;
  name: string;
  onDiagramNameChange(event: any): any;
}

export interface EditPanelProps {
  selectedNode: Node | undefined;
  setSelectedNode(newSelectedNode: Node): any;
  selectedEdge: Edge<EdgeSecurityGroupConnectionConfig> | undefined;
  setSelectedEdge(newSelectedEdge: Edge): any;
  setIsEditPanelOpen(isOpen: boolean): any;
  advancedConfigChecked: boolean;
  setAdvancedConfigChecked: any;
}
