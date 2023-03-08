import { Box, Typography } from "@mui/material";
import "./Block.css";

const WebServerBlock: React.FC = () => {
  const onDragStart = (event: any, nodeType: any, nodeName: any) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/name", nodeName);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box width="100%" paddingTop="2vh" display="flex" justifyContent="center">
      <div
        onDragStart={(event) =>
          onDragStart(event, "webserverNode", "WebServer")
        }
        draggable
        className="Draggable_Block"
      >
        <Box
          height="8vh"
          sx={{ bgcolor: "rgb(255, 111, 71)" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          borderRadius="0.5vh"
        >
          <Typography align="center" variant="h5">
            Web Server
          </Typography>
        </Box>
      </div>
    </Box>
  );
};

export default WebServerBlock;
