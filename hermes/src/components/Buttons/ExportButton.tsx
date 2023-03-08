import { Box, Button, Typography } from "@mui/material";
import { bandwidthTheme } from "../../theme/theme";
import React from "react";
import { ExportButtonProps } from "./interface";

const ExportButton: React.FC<ExportButtonProps> = (
  props: ExportButtonProps
) => {
  const { exportFunction } = props;

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ display: "flex" }}
    >
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Button
          onClick={() => {
            exportFunction();
          }}
          variant="contained"
          sx={{
            marginRight: "0.5vw",
            height: "4vh",
            minWidth: "4.5vw",
            maxWidth: "4.5vw",
            bgcolor: bandwidthTheme.palette.primary.dark,
            overflow: "hidden",
          }}
        >
          <Typography variant="h6">Export</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default ExportButton;
