import {
  Box,
  createTheme,
  ThemeProvider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { bandwidthTheme } from "../theme/theme";
import ExportButton from "./Buttons/ExportButton";
import LoadButton from "./Buttons/LoadButton";
import SaveButton from "./Buttons/SaveButton";
import ShowConfigToggleButton from "./Buttons/ShowConfigToggleButton";
import { RibbonProps } from "./interface";

const Ribbon: React.FC<RibbonProps> = (props: RibbonProps) => {
  const {
    exportFunction,
    saveFunction,
    loadFunction,
    onShowConfigToggle,
    name,
    onDiagramNameChange,
  } = props;

  const hermesTitleTheme = createTheme({
    typography: {
      fontFamily: "Hurme Geometric Sans 3",
      h4: {
        fontSize: "4vh",
      },
    },
  });

  const [nameBgColor, setNameBgColor] = useState<string>(
    bandwidthTheme.palette.primary.main
  );

  return (
    <Box
      height="5vh"
      width="100%"
      right="0"
      zIndex={3}
      sx={{
        bgcolor: bandwidthTheme.palette.primary.main,
        display: "flex",
        justifyContent: "space-between",
      }}
      overflow="hidden"
    >
      <Box display="flex">
        <Box display="flex" justifyContent="center">
          <ThemeProvider theme={hermesTitleTheme}>
            <Typography variant="h4" marginLeft="32.5%">
              HERMES
            </Typography>
          </ThemeProvider>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          marginLeft="15%"
        >
          <TextField
            variant="filled"
            color="primary"
            hiddenLabel={true}
            value={name}
            inputProps={{
              style: {
                fontSize: "3vh",
                textAlign: "left",
                paddingLeft: "5%",
              },
            }}
            sx={{
              backgroundColor: nameBgColor,
              width: "15vw",
            }}
            onChange={onDiagramNameChange}
            onBlur={() => {
              setNameBgColor(bandwidthTheme.palette.primary.main);
            }}
            onFocus={() => {
              setNameBgColor("white");
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex" }}>
        <ShowConfigToggleButton onShowConfigToggle={onShowConfigToggle} />
        <SaveButton saveFunction={saveFunction} />
        <LoadButton loadFunction={loadFunction} />
        <ExportButton exportFunction={exportFunction} />
      </Box>
    </Box>
  );
};

export default Ribbon;
