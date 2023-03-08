import { createTheme } from "@mui/material";

export const bandwidthTheme = createTheme({
  palette: {
    primary: {
      main: "#079cee",
      light: "#FFFFFF",
      dark: "#0a2540",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#ff6f47", // Orange
      light: "#00bf8c", // Green
      dark: "#9a59c5", // Purple
    },
  },

  typography: {
    fontFamily: "Overpass, sans-serif",
    button: {
      textTransform: "none",
    },
    h4: {
      fontSize: "4vh",
    },
    h5: {
      fontSize: "2.75vh",
    },
    h6: {
      fontSize: "2vh",
    },
  },
});
