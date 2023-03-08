import { Box, Button, Stack, styled, Switch, Typography } from "@mui/material";
import { bandwidthTheme } from "../../theme/theme";
import React from "react";
import { ShowConfigToggleButtonProps } from "./interface";

const ShowConfigToggleButton: React.FC<ShowConfigToggleButtonProps> = (
  props: ShowConfigToggleButtonProps
) => {
  const { onShowConfigToggle } = props;
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ display: "flex" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginRight={1}
      >
        <Stack direction="row" alignItems="center">
          <Typography variant="h6">Show Configuration</Typography>
          <Switch
            onChange={onShowConfigToggle}
            sx={{
              width: "80px",
              "&:active": {
                "& .MuiSwitch-thumb": {
                  width: "35px",
                },
                "& .MuiSwitch-switchBase.Mui-checked": {
                  transform: "translateX(17.5px)",
                  transition: bandwidthTheme.transitions.create(["transform"], {
                    duration: 200,
                  }),
                },
              },
              "& .MuiSwitch-thumb": {
                marginTop: -0.325,
                marginLeft: 0.5,
                width: "25px",
                height: "25px",
                backgroundColor: bandwidthTheme.palette.primary.light,
                transition: bandwidthTheme.transitions.create(["width"], {
                  duration: 200,
                }),
              },
              "& .MuiSwitch-track": {
                marginTop: -0.85,
                borderRadius: 10,
                opacity: 0.9,
                backgroundColor: "grey.400",
                height: 28,
                width: 100,
              },
              "& .MuiSwitch-switchBase": {
                "&.Mui-checked": {
                  transform: "translateX(28px)",
                  "& + .MuiSwitch-track": {
                    opacity: 1,
                    backgroundColor: bandwidthTheme.palette.primary.dark,
                  },
                },
              },
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default ShowConfigToggleButton;
