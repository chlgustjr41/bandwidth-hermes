import { Typography, Box, Divider, Fade } from "@mui/material";
import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { bandwidthTheme } from "../../theme/theme";
import { DatabaseNodeStyle, WebServerNodeStyle } from "./NodeStyle";
import {
  NodeVPCConfig,
  NodeWebServerConfig,
  NodeDatabaseConfig,
  NodeStorageContainerConfig,
  NodeStaticWebsiteConfig,
} from "./nodeTypeInfo";

const DEFAULT_EMPTY_CONFIG = "EMPTY";

// Custom node for custom designed handle for VPC block
export const InternetNode: React.FC<NodeProps> = (props: NodeProps) => {
  return (
    <div>
      <Handle
        type="source"
        position={Position.Top}
        draggable={false}
        style={{ opacity: "0%" }}
      />
      <Box marginTop={1}>
        <Typography align="center" fontWeight="bold" color="black">
          Internet
        </Typography>
      </Box>

      <Handle
        type="target"
        position={Position.Bottom}
        draggable={false}
        style={{ opacity: "0%" }}
      />
    </div>
  );
};

// Custom node for custom designed handle for VPC block
export const VPCNode: React.FC<NodeProps<NodeVPCConfig>> = (
  props: NodeProps<NodeVPCConfig>
) => {
  return (
    <div>
      <Handle
        type="source"
        position={Position.Top}
        style={{
          width: "100px",
          height: "40px",
          borderRadius: "3px",
          borderColor: "black",
          border: "5px double",
          background: "rgb(7, 156, 238, 0)", // make only the handle background transparent
          top: "-30px",
        }}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        zIndex={-1}
        width="110px"
        height="50px"
        position="absolute"
        top="-30px"
        right={props.data.updatedWidth / 2 - 60} // hard coded handle size
        borderRadius="3px"
        sx={{
          backgroundColor: "rgb(7, 156, 238, 1)",
          transition: bandwidthTheme.transitions.create(["right"], {
            duration: 300,
          }),
        }}
      >
        <Typography align="center" fontWeight="bold" color="black">
          Internet
        </Typography>
      </Box>

      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={false}
        style={{ opacity: "0%" }}
      />
    </div>
  );
};

// Custom node for custom designed handle for Web Server block
export const WebServerNode: React.FC<NodeProps<NodeWebServerConfig>> = (
  props: NodeProps<NodeWebServerConfig>
) => {
  return (
    <div>
      <Handle
        type="source"
        position={Position.Top}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "3px",
          borderColor: "black",
          border: "5px double",
          background: WebServerNodeStyle.borderColor,
          opacity: "125%",
          top: "-12.5px",
        }}
      />

      <Box marginTop={1}>
        <Typography align="center" color="black">
          {props.data.label}
        </Typography>
      </Box>

      <Fade
        in={props.data.showConfigToggle}
        unmountOnExit
        mountOnEnter
        timeout={props.data.showConfigToggle ? 800 : 200}
      >
        <Box marginLeft={1} marginRight={1}>
          <Divider sx={{ marginBottom: 0.5 }} />

          <Box display="flex" justifyContent="space-between">
            <Box width="35%">
              <Typography fontSize={12} align="left" color="black">
                AMI ID:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.amiId === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.amiId}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop={1}>
            <Box width="35%">
              <Typography fontSize={12} align="left" color="black">
                User Data Scripts:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.userDataScript === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.userDataScript}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop={1}>
            <Box width="35%">
              <Typography fontSize={12} align="left" color="black">
                Availability Zone:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.availabilityZone === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.availabilityZone}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop={1}>
            <Box width="35%">
              <Typography fontSize={12} align="left" color="black">
                App Path:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.appPath === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.appPath}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={false}
        style={{
          opacity: "0%",
        }}
      />
    </div>
  );
};

// Custom node for custom designed handle for Web Server block
export const DatabaseNode: React.FC<NodeProps<NodeDatabaseConfig>> = (
  props: NodeProps<NodeDatabaseConfig>
) => {
  return (
    <div>
      <Handle
        type="source"
        position={Position.Top}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "3px",
          borderColor: "black",
          border: "5px double",
          background: DatabaseNodeStyle.borderColor,
          top: "-12.5px",
        }}
      />

      <Box marginTop={1}>
        <Typography align="center" color="black">
          {props.data.label}
        </Typography>
      </Box>

      <Fade
        in={props.data.showConfigToggle}
        unmountOnExit
        mountOnEnter
        timeout={props.data.showConfigToggle ? 800 : 200}
      >
        <Box marginLeft={1} marginRight={1}>
          <Divider sx={{ marginBottom: 0.5 }} />

          <Box display="flex" justifyContent="space-between">
            <Box width="30%">
              <Typography fontSize={12} align="left" color="black">
                Engine:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.engine === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.engine}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={false}
        style={{ opacity: "0%" }}
      />
    </div>
  );
};

// Custom node for custom designed handle for Web Server block
export const StorageContainerNode: React.FC<
  NodeProps<NodeStorageContainerConfig>
> = (props: NodeProps<NodeStorageContainerConfig>) => {
  return (
    <div>
      {/* Disabling the handle since there is no logical reason to make connections with other nodes */}
      {/* <Handle
        type="source"
        position={Position.Top}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "3px",
          borderColor: "black",
          border: "5px double",
          background: StorageContainerNodeStyle.borderColor,
          top: "-12.5px",
        }}
      /> */}

      <Box marginTop={1}>
        <Typography align="center" color="black">
          {props.data.label}
        </Typography>
      </Box>

      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={false}
        style={{ opacity: "0%" }}
      />
    </div>
  );
};

// Custom node for custom designed handle for Static Website block
export const StaticWebsiteNode: React.FC<NodeProps<NodeStaticWebsiteConfig>> = (
  props: NodeProps<NodeStaticWebsiteConfig>
) => {
  return (
    <div>
      {/* Disabling the handle since there is no logical reason to make connections with other nodes */}
      {/* <Handle
        type="source"
        position={Position.Top}
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "3px",
          borderColor: "black",
          border: "5px double",
          background: StaticWebsiteNodeStyle.borderColor,
          top: "-12.5px",
        }}
      /> */}

      <Box marginTop={1}>
        <Typography align="center" color="black">
          {props.data.label}
        </Typography>
      </Box>

      <Fade
        in={props.data.showConfigToggle}
        unmountOnExit
        mountOnEnter
        timeout={props.data.showConfigToggle ? 800 : 200}
      >
        <Box marginLeft={1} marginRight={1}>
          <Divider sx={{ marginBottom: 0.5 }} />
          <Box display="flex" justifyContent="space-between">
            <Box width="35%">
              <Typography fontSize={12} align="left" color="black">
                App Path:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.appPath === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.appPath}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop={1}>
            <Box width="35%">
              <Typography fontSize={12} align="left" color="black">
                Index File:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.indexFile === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.indexFile}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop={1}>
            <Box width="35%">
              <Typography fontSize={12} align="left" color="black">
                Error File:
              </Typography>
            </Box>
            <Box width="60%">
              <Typography
                fontSize={12}
                align="left"
                color="black"
                noWrap
                overflow="ellipsis"
              >
                {props.data.errorFile === ""
                  ? DEFAULT_EMPTY_CONFIG
                  : props.data.errorFile}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      <Handle
        type="target"
        position={Position.Bottom}
        isConnectable={false}
        style={{ opacity: "0%" }}
      />
    </div>
  );
};
