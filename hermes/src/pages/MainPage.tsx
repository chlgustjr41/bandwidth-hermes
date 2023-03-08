import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { bandwidthTheme } from "../theme/theme";
import Ribbon from "../components/Ribbon";
import ToolBox from "../components/ToolBox";
import Canvas from "../components/Canvas";
import { Edge, Node, ReactFlowInstance } from "reactflow";
import { DiagramService } from "../services/diagramService";
import { Diagram } from "../models/diagram";
import { InternetNodeStyle } from "../components/Nodes/NodeStyle";
import { JsonObject } from "typescript-json-serializer";
import { HermesFile } from "../models/hermesFile";

const MainPage: React.FC = () => {
  const internetNode: Node = {
    id: "Internet",
    type: "internetNode",
    position: { x: 0, y: 0 },
    data: { label: "Internet" },
    deletable: false,
    style: InternetNodeStyle,
  };

  const [nodes, setNodes] = useState<Node[]>([internetNode]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [name, setName] = useState<string>("Diagram Name");

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<Blob | null>(null);

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfigToggle, setShowConfigToggle] = useState(false);

  useEffect(() => {
    if (file) {
      file.text().then((val) => {
        try {
          let data: HermesFile = HermesFile.loadValidation(val);
          setNodes(data.instance.nodes || []);
          setEdges(data.instance.edges || []);
          setName(data.name);
          setFile(null);
        } catch (e) {
          setOpen(true);
          setErrorMessage(
            "This file is not a valid HERMES file, or the file was corrupted."
          );
          setFile(null);
          return;
        }
      });
    }
  }, [file, setFile]);

  const exportFunction = async () => {
    let diagramService: DiagramService = new DiagramService();
    let diagram: Diagram = diagramService.BuildDiagram(
      name,
      reactFlowInstance!.getNodes(),
      reactFlowInstance!.getEdges()
    );
    try {
      let result: string = await diagramService.ExportDiagram(diagram);
      const blob = new Blob([result]);
      const fileDownloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "cdk.py";
      link.href = fileDownloadUrl;
      link.click();
    } catch (error) {
      alert(error);
    }
  };

  const saveFunction = () => {
    const link = document.createElement("a");
    link.download = name + ".hermes";
    let object = reactFlowInstance?.toObject();
    let jsonValue = JSON.stringify(object);
    let hash = HermesFile.hashFile(jsonValue);
    let hermesFile: HermesFile = new HermesFile(name, "1.0.0", object, hash);
    let data = JSON.stringify(hermesFile);
    const blob = new Blob([data]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    link.href = fileDownloadUrl;
    link.click();
  };

  const loadFunction = (event: any) => {
    setIsLoading(true);
    setFile(event.target.files[0]);
  };

  const onShowConfigToggle = (event: any) => {
    setShowConfigToggle(event.target.checked);
  };

  const onDiagramNameChange = (event: any) => {
    setName(event.target.value);
  };

  return (
    <ThemeProvider theme={bandwidthTheme}>
      <Ribbon
        exportFunction={exportFunction}
        saveFunction={saveFunction}
        loadFunction={loadFunction}
        onShowConfigToggle={onShowConfigToggle}
        name={name}
        onDiagramNameChange={onDiagramNameChange}
      />
      <ToolBox />
      <Box width="90%" height="95vh" marginLeft="10%">
        <Canvas
          reactFlowInstance={reactFlowInstance}
          setReactFlowInstance={setReactFlowInstance}
          initialNodes={nodes}
          initialEdges={edges}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          showConfigToggle={showConfigToggle}
        />
      </Box>
      <Dialog
        onClose={() => {
          setOpen(false);
        }}
        open={open}
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
              setOpen(false);
            }}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default MainPage;
