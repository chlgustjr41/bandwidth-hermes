import { Box, Button, Typography } from "@mui/material";
import { bandwidthTheme } from "../../theme/theme";
import React from "react";
import { LoadButtonProps } from "./interface";

const LoadButton: React.FC<LoadButtonProps> = (props: LoadButtonProps) => {
  const { loadFunction } = props;
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ display: "flex" }}
    >
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Button
          variant="contained"
          component="label"
          sx={{
            marginRight: "0.5vw",
            height: "4vh",
            minWidth: "4.5vw",
            maxWidth: "4.5vw",
            bgcolor: bandwidthTheme.palette.primary.dark,
            overflow: "hidden",
          }}
        >
          <Typography variant="h6">Load</Typography>
          <input type="file" accept=".hermes" onChange={loadFunction} hidden />
        </Button>
      </Box>
    </Box>
  );
};

export default LoadButton;
