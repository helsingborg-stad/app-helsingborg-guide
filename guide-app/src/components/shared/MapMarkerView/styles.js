import { StyleSheet, Dimensions } from "react-native";
import { Colors, TextStyles } from "@assets/styles";

const numberedMarkerTextContainerShared = {
  position: "absolute",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  overflow: "visible",
};

const numberedMarkerTextShared = {
  ...TextStyles.body,
  ...TextStyles.bold,
  fontSize: 18,
  textAlign: "center",
  overflow: "visible",
};

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Colors.white,
    flex: 1,
  },
  map: {
    width: width,
    height: height,
    flex: 1,
  },
  numberedMarkerOuterContainer: {
    height: 57,
    overflow: "visible",
  },
  numberedMarkerContainer: {
    width: 33,
    height: 50,
    overflow: "visible",
  },
  numberedMarkerContainerActive: {
    width: 42,
    height: 57,
  },
  numberedMarkerImage: {
    width: "100%",
    height: "100%",
  },
  numberedMarkerTextContainer: {
    ...numberedMarkerTextContainerShared,
    height: 32,
  },
  numberedMarkerTextContainerActive: {
    ...numberedMarkerTextContainerShared,
    height: 38,
  },
  numberedMarkerText: {
    ...numberedMarkerTextShared,
    color: Colors.white,
  },
  numberedMarkerTextActive: {
    ...numberedMarkerTextShared,
    color: Colors.black,
  },

  numberedMarkerDuplicatesActive: {
    position: "absolute",
    backgroundColor: "#9A1573",
    borderRadius: 24,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    right: 3,
    bottom: 7,
    zIndex: 2,
    overflow: "visible",
  },

  numberedMarkerDuplicates: {
    position: "absolute",
    backgroundColor: "#9A1573",
    borderRadius: 24,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    bottom: 7,
    zIndex: 2,
    overflow: "visible",
  },
  numberedMarkerDuplicatesText: {
    color: "white",
    fontSize: 10,
  },

});
