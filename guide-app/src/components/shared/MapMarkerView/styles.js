import { StyleSheet } from "react-native";
import { Colors, TextStyles } from "@assets/styles";

const numberedMarkerTextContainerShared = {
  position: "absolute",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
};

const numberedMarkerTextShared = {
  ...TextStyles.body,
  fontSize: 18,
  fontWeight: "500",
  textAlign: "center",
};

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  map: {
    flex: 1,
  },
  numberedMarkerOuterContainer: {
    height: 57,
  },
  numberedMarkerContainer: {
    width: 33,
    height: 50,
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
});
