import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  MenuItem,
  Select,
  Slide,
  Fade,
  TextField,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { bandwidthTheme } from "../theme/theme";
import { EditPanelProps } from "./interface";
import rgbHex from "rgb-hex";
import {
  onNodeInfoChange,
  onEdgeLabelChange,
  onEdgePortSelection,
} from "./util";

const EditPanel: React.FC<EditPanelProps> = (props: EditPanelProps) => {
  const {
    selectedNode,
    setSelectedNode,
    selectedEdge,
    setSelectedEdge,
    setIsEditPanelOpen,
    advancedConfigChecked,
    setAdvancedConfigChecked,
  } = props;

  const ConfigTitleStyle: React.CSSProperties = {
    paddingTop: "3vh",
    color: bandwidthTheme.palette.primary.contrastText,
    textAlign: "left",
    marginLeft: "5%",
    marginRight: "5%",
  };

  const ConfigTextfieldStyle: React.CSSProperties = {
    backgroundColor: "white",
    marginLeft: "5%",
    marginRight: "5%",
    width: "90%",
    fontSize: "2vh",
    borderWidth: "90%",
    height: "4vh",
    padding: 0,
  };

  const FixedCheckBoxStyle: React.CSSProperties = {
    width: "0vw",
    height: "0vh",
    padding: "1vw",
  };

  const configAnimationTime = 1000;

  const [nodeColor, setNodeColor] = useState<string | undefined>(undefined);
  const [openDataScript, setOpenDataScript] = useState(false);
  const [dataScriptFile, setDataScriptFile] = useState<Blob | null>(null);

  // These two are parellel array to keep track of the selected port numbers
  const portNumbers: number[] = [22, 80, 3306, 5432];
  const [checkedPorts, setCheckedPorts] = useState([
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    let background: string | undefined = undefined;
    let temp = selectedNode?.style!.background;
    if (temp) {
      background =
        typeof temp === "number"
          ? undefined
          : "#" + rgbHex(temp).substring(0, 6);
    }

    setNodeColor(background);
  }, [selectedNode]);

  useEffect(() => {
    if (selectedEdge) {
      setCheckedPorts((checked) => {
        portNumbers.forEach((portNumber, i) => {
          if (
            selectedEdge.data!.ports.findIndex((port) => {
              return port === portNumber;
            }) !== -1
          ) {
            checked[i] = true;
          } else {
            checked[i] = false;
          }
        });
        return checked;
      });
    }
  }, [selectedEdge]);

  useEffect(() => {
    if (dataScriptFile && selectedNode) {
      dataScriptFile.text().then((val) => {
        let updatedNode = selectedNode;
        updatedNode!.data = {
          ...selectedNode!.data,
          userDataScript: val,
        };
        setSelectedNode({ ...selectedNode, ...updatedNode });
        setOpenDataScript(true);
        setDataScriptFile(null);
      });
    }
  }, [dataScriptFile]);

  const uploadUserDataScript = (event: any) => {
    setDataScriptFile(event.target.files[0]);
  };

  const validEdit = useCallback(
    (editType: string): boolean => {
      if (editType === "advancedConfiguration") {
        if (selectedNode?.id.includes("WebServer")) return true;
        if (selectedNode?.id.includes("Database")) return true;
        if (selectedNode?.id.includes("StaticWebsite")) return true;
      }

      // Formatted for readibility
      if (editType === "color" && selectedNode !== undefined) {
        if (selectedNode?.id.includes("VPC")) return true;
        if (selectedNode?.id.includes("WebServer")) return true;
        if (selectedNode?.id.includes("Database")) return true;
        if (selectedNode?.id.includes("StorageContainer")) return true;
        if (selectedNode?.id.includes("StaticWebsite")) return true;
      } else if (editType === "name" && selectedNode !== undefined) {
        if (selectedNode?.id.includes("WebServer")) return true;
        if (selectedNode?.id.includes("Database")) return true;
        if (selectedNode?.id.includes("StorageContainer")) return true;
        if (selectedNode?.id.includes("StaticWebsite")) return true;
      } else if (advancedConfigChecked) {
        if (editType === "amiId" && selectedNode !== undefined) {
          if (selectedNode?.id.includes("WebServer")) return true;
        } else if (
          editType === "userDataScript" &&
          selectedNode !== undefined
        ) {
          if (selectedNode?.id.includes("WebServer")) return true;
        } else if (
          editType === "availabilityZone" &&
          selectedNode !== undefined
        ) {
          if (selectedNode?.id.includes("WebServer")) return true;
        } else if (editType === "appPath" && selectedNode !== undefined) {
          if (selectedNode?.id.includes("WebServer")) return true;
          if (selectedNode?.id.includes("StaticWebsite")) return true;
        } else if (editType === "engine" && selectedNode !== undefined) {
          if (selectedNode?.id.includes("Database")) return true;
        } else if (editType === "indexFile" && selectedNode !== undefined) {
          if (selectedNode?.id.includes("StaticWebsite")) return true;
        } else if (editType === "errorFile" && selectedNode !== undefined) {
          if (selectedNode?.id.includes("StaticWebsite")) return true;
        }
      }

      // There is only one type of edge and all edge types should have both label and ports
      if (editType === "label" && selectedEdge !== undefined) {
        if (selectedEdge?.id.includes("Automatic")) return false;
        else return true;
      } else if (editType === "ports" && selectedEdge !== undefined) {
        if (selectedEdge?.id.includes("Automatic")) return false;
        else return true;
      }

      return false;
    },
    [selectedNode, selectedEdge, advancedConfigChecked]
  );

  const handleCheckedPorts = useCallback(
    (event: any, portIndex: number) => {
      setCheckedPorts((checked) => {
        checked[portIndex] = event.target.checked;

        let checkedPortNumbers: number[] = [];
        checked.forEach((status, i) => {
          if (status) {
            checkedPortNumbers.push(portNumbers[i]);
          }
        });
        onEdgePortSelection(checkedPortNumbers, selectedEdge, setSelectedEdge);

        return checked;
      });
    },
    [setCheckedPorts, selectedEdge]
  );

  return (
    <Box height="100%" width="100%" zIndex={3}>
      <Slide
        in={selectedNode || selectedEdge ? true : false}
        direction="left"
        timeout={300}
        onEnter={() => {
          setIsEditPanelOpen(true);
        }}
        onExited={() => {
          setIsEditPanelOpen(false);
        }}
        mountOnEnter
        unmountOnExit
      >
        <Box
          height="auto"
          width="100%"
          minHeight="95vh"
          overflow="auto"
          sx={{ bgcolor: bandwidthTheme.palette.primary.dark }}
        >
          <Typography
            paddingTop="1vh"
            color={bandwidthTheme.palette.primary.contrastText}
            align="center"
            fontSize="3vh"
          >
            Edit Panel
          </Typography>

          <Typography
            variant="h6"
            style={{
              ...ConfigTitleStyle,
              paddingTop: "2vh",
              textAlign: "center",
            }}
          >
            Selected:
          </Typography>
          <Box display="flex" justifyContent="center" maxWidth="10vw">
            <Tooltip
              title={
                selectedNode
                  ? selectedNode.id
                  : selectedEdge
                  ? selectedEdge.id
                  : "undefined"
              }
            >
              <Typography
                color={bandwidthTheme.palette.primary.contrastText}
                fontSize="2.25vh"
                align="center"
                marginLeft="5%"
                marginRight="5%"
                overflow="ellipsis"
                noWrap
              >
                {selectedNode
                  ? selectedNode.id
                  : selectedEdge
                  ? selectedEdge.id
                  : "undefined"}
              </Typography>
            </Tooltip>
          </Box>

          {/* Node/Block configuration options */}
          <Fade
            in={validEdit("color")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Block Color:
              </Typography>
              <Box display="flex" justifyContent="center">
                <input
                  type="color"
                  onChange={(event: any) => {
                    onNodeInfoChange(
                      event,
                      "color",
                      selectedNode,
                      setSelectedNode
                    );
                  }}
                  value={nodeColor}
                  style={{
                    width: "1.5vw",
                    height: "1.5vw",
                    border: "none",
                    padding: 0,
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    variant="h6"
                    color={bandwidthTheme.palette.primary.contrastText}
                    marginLeft="1vw"
                  >
                    {nodeColor}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
          <Fade
            in={validEdit("name")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Block Name:
              </Typography>
              <TextField
                variant="standard"
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: { ...ConfigTextfieldStyle },
                }}
                onChange={(event: any) => {
                  onNodeInfoChange(
                    event,
                    "name",
                    selectedNode,
                    setSelectedNode
                  );
                }}
                value={selectedNode?.data.label}
              />
            </Box>
          </Fade>

          <Fade
            in={validEdit("advancedConfiguration")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                marginRight="5%"
                marginLeft="5%"
                marginTop="10%"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    variant="h6"
                    style={{
                      ...ConfigTitleStyle,
                      textAlign: "center",
                      fontSize: "1.5vh",
                      paddingTop: 0,
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                  >
                    Advanced Configuration
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  marginRight="5%"
                >
                  <Checkbox
                    sx={{
                      color: "white",
                      "& .MuiSvgIcon-root": {
                        fontSize: "3vh",
                      },
                    }}
                    style={FixedCheckBoxStyle}
                    checked={advancedConfigChecked}
                    onChange={(event) => {
                      setAdvancedConfigChecked(event.target.checked);
                    }}
                  />
                </Box>
              </Box>

              <Fade
                in={advancedConfigChecked}
                timeout={configAnimationTime}
                exit={false}
                mountOnEnter
                unmountOnExit
              >
                <Divider
                  sx={{
                    backgroundColor: "white",
                    marginLeft: "5%",
                    marginRight: "5%",
                    marginTop: "5%",
                    marginBottom: "-5.5%",
                    height: "0.125%",
                    border: 0,
                  }}
                />
              </Fade>
            </Box>
          </Fade>

          {/* Advanced Configuration Below */}
          <Fade
            in={validEdit("appPath")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                App Path:
              </Typography>
              <TextField
                variant="standard"
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: ConfigTextfieldStyle,
                }}
                onChange={(event: any) => {
                  onNodeInfoChange(
                    event,
                    "appPath",
                    selectedNode,
                    setSelectedNode
                  );
                }}
                value={selectedNode?.data.appPath}
              />
            </Box>
          </Fade>
          <Fade
            in={validEdit("amiId")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                AMI ID:
              </Typography>
              <TextField
                variant="standard"
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: ConfigTextfieldStyle,
                }}
                onChange={(event: any) => {
                  onNodeInfoChange(
                    event,
                    "amiId",
                    selectedNode,
                    setSelectedNode
                  );
                }}
                value={selectedNode?.data.amiId}
              />
            </Box>
          </Fade>
          <Fade
            in={validEdit("userDataScript")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                User Data Script:
              </Typography>
              <TextField
                variant="standard"
                color="primary"
                multiline={true}
                inputProps={{
                  style: {
                    ...ConfigTextfieldStyle,
                    height: "auto",
                    minHeight: "8vh",
                    maxHeight: "8vh",
                    lineHeight: "2vh",
                  },
                }}
                style={{
                  backgroundColor: "white",
                  marginLeft: "5%",
                  marginRight: "5%",
                  width: "90%",
                  fontSize: "2vh",
                  borderWidth: "90%",
                }}
                onFocus={(event) => {
                  setOpenDataScript(true);
                  event.target.blur();
                }}
                value={selectedNode?.data.userDataScript}
              />
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  component="label"
                  fullWidth={true}
                  sx={{
                    marginTop: "1vh",
                    marginRight: "5%",
                    marginLeft: "5%",
                    height: "4vh",
                    bgcolor: bandwidthTheme.palette.primary.main,
                    ":hover": {
                      bgcolor: bandwidthTheme.palette.primary.main,
                    },
                  }}
                >
                  <Typography noWrap overflow="ellipsis" variant="h6">
                    Upload File
                  </Typography>
                  <input type="file" onChange={uploadUserDataScript} hidden />
                </Button>
              </Box>
            </Box>
          </Fade>
          <Fade
            in={validEdit("availabilityZone")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Availability Zone:
              </Typography>
              <Select
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: ConfigTextfieldStyle,
                }}
                onChange={(event: any) => {
                  onNodeInfoChange(
                    event,
                    "availabilityZone",
                    selectedNode,
                    setSelectedNode
                  );
                }}
                value={selectedNode?.data.availabilityZone}
              >
                <MenuItem value={"us-east-1"}>us-east-1</MenuItem>
                <MenuItem value={"us-west-1"}>us-west-1</MenuItem>
              </Select>
            </Box>
          </Fade>
          <Fade
            in={validEdit("engine")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Engine:
              </Typography>
              <Select
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: ConfigTextfieldStyle,
                }}
                onChange={(event: any) => {
                  onNodeInfoChange(
                    event,
                    "engine",
                    selectedNode,
                    setSelectedNode
                  );
                }}
                value={selectedNode?.data.engine}
              >
                <MenuItem value={"mysql"}>mysql</MenuItem>
                <MenuItem value={"postgres"}>postgres</MenuItem>
              </Select>
            </Box>
          </Fade>
          <Fade
            in={validEdit("indexFile")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Index File:
              </Typography>
              <TextField
                variant="standard"
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: ConfigTextfieldStyle,
                }}
                onChange={(event: any) => {
                  onNodeInfoChange(
                    event,
                    "indexFile",
                    selectedNode,
                    setSelectedNode
                  );
                }}
                value={selectedNode?.data.indexFile}
              />
            </Box>
          </Fade>
          <Fade
            in={validEdit("errorFile")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Error File:
              </Typography>
              <TextField
                variant="standard"
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: ConfigTextfieldStyle,
                }}
                onChange={(event: any) => {
                  onNodeInfoChange(
                    event,
                    "errorFile",
                    selectedNode,
                    setSelectedNode
                  );
                }}
                value={selectedNode?.data.errorFile}
              />
            </Box>
          </Fade>

          {/* Edge/Connection configuration options */}
          <Fade
            in={validEdit("label")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Edge Label:
              </Typography>
              <TextField
                variant="standard"
                color="primary"
                style={ConfigTextfieldStyle}
                inputProps={{
                  style: ConfigTextfieldStyle,
                }}
                onChange={(event: any) => {
                  onEdgeLabelChange(event, selectedEdge, setSelectedEdge);
                }}
                value={selectedEdge?.label}
              />
            </Box>
          </Fade>
          <Fade
            in={validEdit("ports")}
            timeout={configAnimationTime}
            exit={false}
            mountOnEnter
            unmountOnExit
          >
            <Box>
              <Typography variant="h6" style={ConfigTitleStyle}>
                Ports:
              </Typography>

              <FormGroup sx={{ color: "white", marginLeft: "1vw" }}>
                <FormControlLabel
                  label={
                    <Typography
                      variant="h6"
                      fontSize="2vh"
                      marginTop="0.75vh"
                      marginLeft="1vw"
                    >
                      {portNumbers[0]}
                    </Typography>
                  }
                  control={
                    <Checkbox
                      sx={{
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          fontSize: "4vh",
                        },
                      }}
                      style={FixedCheckBoxStyle}
                      checked={checkedPorts[0]}
                      onChange={(event) => {
                        handleCheckedPorts(event, 0);
                      }}
                    />
                  }
                  style={{ margin: 0 }}
                />
                <FormControlLabel
                  label={
                    <Typography
                      variant="h6"
                      fontSize="2vh"
                      marginTop="0.75vh"
                      marginLeft="1vw"
                    >
                      {portNumbers[1]}
                    </Typography>
                  }
                  control={
                    <Checkbox
                      sx={{
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          fontSize: "4vh",
                        },
                      }}
                      style={FixedCheckBoxStyle}
                      checked={checkedPorts[1]}
                      onChange={(event) => {
                        handleCheckedPorts(event, 1);
                      }}
                    />
                  }
                  sx={{ marginTop: -1 }}
                  style={{ margin: 0 }}
                />
                <FormControlLabel
                  label={
                    <Typography
                      variant="h6"
                      fontSize="2vh"
                      marginTop="0.75vh"
                      marginLeft="1vw"
                    >
                      {portNumbers[2]}
                    </Typography>
                  }
                  control={
                    <Checkbox
                      sx={{
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          fontSize: "4vh",
                        },
                      }}
                      style={FixedCheckBoxStyle}
                      checked={checkedPorts[2]}
                      onChange={(event) => {
                        handleCheckedPorts(event, 2);
                      }}
                    />
                  }
                  sx={{ marginTop: -1 }}
                  style={{ margin: 0 }}
                />
                <FormControlLabel
                  label={
                    <Typography
                      variant="h6"
                      fontSize="2vh"
                      marginTop="0.75vh"
                      marginLeft="1vw"
                    >
                      {portNumbers[3]}
                    </Typography>
                  }
                  control={
                    <Checkbox
                      sx={{
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          fontSize: "4vh",
                        },
                      }}
                      style={FixedCheckBoxStyle}
                      checked={checkedPorts[3]}
                      onChange={(event) => {
                        handleCheckedPorts(event, 3);
                      }}
                    />
                  }
                  sx={{ marginTop: -1 }}
                  style={{ margin: 0 }}
                />
              </FormGroup>
            </Box>
          </Fade>
        </Box>
      </Slide>

      <Dialog
        onClose={() => {
          setOpenDataScript(false);
        }}
        open={openDataScript}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle sx={{ fontSize: 40 }}>User Data Script</DialogTitle>

        <TextField
          autoFocus={true}
          autoComplete="off"
          multiline={true}
          rows={20}
          sx={{ marginLeft: 3, marginRight: 3 }}
          onChange={(event: any) => {
            onNodeInfoChange(
              event,
              "userDataScript",
              selectedNode,
              setSelectedNode
            );
          }}
          value={selectedNode?.data.userDataScript}
        />

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenDataScript(false);
            }}
            sx={{ marginRight: 2 }}
            size="large"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditPanel;
