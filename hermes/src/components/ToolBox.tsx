import { Box, Typography } from "@mui/material";
import React from "react";
import { bandwidthTheme } from "../theme/theme";
import VPCBlock from "./Blocks/VPCBlock";
import WebServerBlock from "./Blocks/WebServerBlock";
import DatabaseBlock from "./Blocks/DatabaseBlock";
import StorageContainerBlock from "./Blocks/StorageContainerBlock";
import StaticWebsiteBlock from "./Blocks/StaticWebsiteBlock";

const ToolBox: React.FC = () => {
  return (
    <Box
      height="95vh"
      width="10%"
      position="absolute"
      zIndex={3}
      sx={{ bgcolor: bandwidthTheme.palette.primary.dark }}
      overflow="auto"
    >
      <Typography
        paddingTop="1vh"
        color={bandwidthTheme.palette.primary.contrastText}
        variant="h4"
        align="center"
      >
        Tool Box
      </Typography>

      {/* Different Types of Blocks */}
      <VPCBlock />
      <WebServerBlock />
      <DatabaseBlock />
      <StorageContainerBlock />
      <StaticWebsiteBlock />
    </Box>
  );
};

export default ToolBox;
