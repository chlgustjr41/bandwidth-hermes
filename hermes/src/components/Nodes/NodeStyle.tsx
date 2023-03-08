import { bandwidthTheme } from "../../theme/theme";

// Styles for each nodes. Gateway block has been removed and commented

export const InternetNodeStyle: React.CSSProperties = {
  // Must be RGB format for the opacity field. Later, will be converted to HEX in the edit panel
  background: "rgb(7, 156, 238, 1)", // #079cee main
  color: "#333",
  border: "5px double",
  borderColor: "black",
  width: 150,
  height: 100,
};

export const VPCNodeStyle: React.CSSProperties = {
  // Must be RGB format for the opacity field. Later, will be converted to HEX in the edit panel
  background: "rgb(0, 191, 140, 0.75)", // #00bf8c green
  color: "#333",
  border: "5px solid",
  borderColor: "rgb(0, 191, 140)",
  width: 300,
  height: 250,
  transition: bandwidthTheme.transitions.create(["width", "height"], {
    duration: 300,
  }),
};

export const WebServerNodeStyle: React.CSSProperties = {
  // Must be RGB format for the opacity field. Later, will be converted to HEX in the edit panel
  background: "rgb(255, 111, 71, 0.75)", // #ff6f47 orange
  color: "#333",
  border: "5px solid",
  borderColor: "rgb(255, 111, 71)",
  width: 200,
  height: 50,
  // For toggle show configuration animation
  maxHeight: 185,
  transition: bandwidthTheme.transitions.create(["height"], {
    duration: 300,
  }),
};

export const DatabaseNodeStyle: React.CSSProperties = {
  // Must be RGB format for the opacity field. Later, will be converted to HEX in the edit panel
  background: "rgb(225, 37, 27, 0.75)", // #e1251b red
  color: "#333",
  border: "5px solid",
  borderColor: "rgb(225, 37, 27)",
  width: 200,
  height: 50,
  // For toggle show configuration animation
  maxHeight: 70,
  transition: bandwidthTheme.transitions.create(["height"], {
    duration: 300,
  }),
};

export const StorageContainerNodeStyle: React.CSSProperties = {
  // Must be RGB format for the opacity field. Later, will be converted to HEX in the edit panel
  background: "rgb(255, 185, 2, 0.75)", // #ffb902 yellow
  color: "#333",
  border: "5px solid",
  borderColor: "rgb(255, 185, 2)",
  width: 200,
  height: 50,
};

export const StaticWebsiteNodeStyle: React.CSSProperties = {
  // Must be RGB format for the opacity field. Later, will be converted to HEX in the edit panel
  background: "rgb(154, 89, 197, 0.75)", // #9a59c5 purple
  color: "#333",
  border: "5px solid",
  borderColor: "rgb(154, 89, 197)",
  width: 200,
  height: 50,
  // For toggle show configuration animation
  maxHeight: 120,
  transition: bandwidthTheme.transitions.create(["height"], {
    duration: 300,
  }),
};
