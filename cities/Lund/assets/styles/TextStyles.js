import { StyleSheet } from "react-native";
import Colors from "./Colors";

const defaultFont = {
  fontFamily: "Tahoma",
};

const boldFont = {
  fontFamily: "Tahoma-Bold",
};

export default StyleSheet.create({
  body: {
    ...defaultFont,
    fontSize: 17,
    lineHeight: 23,
  },
  comingSoonText: {
    ...boldFont,
    fontSize: 13,
  },
  defaultFontFamily: {
    ...defaultFont,
  },
  description: {
    ...defaultFont,
    fontSize: 16,
    lineHeight: 22.0,
  },
  headerTitleLabel: {
    ...defaultFont,
    alignSelf: "center",
    color: Colors.white,
    flex: 1, // added this to center title on android //BP
    fontSize: 18,
    fontWeight: "300",
    lineHeight: 23.0,
    textAlign: "center",
  },
  medium: {
    ...defaultFont,
    color: Colors.black,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  segmentControlLabel: {
    ...defaultFont,
    alignSelf: "center",
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 23.0,
    textAlign: "center",
  },
  segmentControlPillLabel: {
    ...defaultFont,
    color: Colors.white,
    fontSize: 14,
    lineHeight: 18.0,
    textAlign: "center",
  },
  small: {
    ...defaultFont,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
  },
  tabBarLabel: {
    ...defaultFont,
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 23.0,
    textAlign: "center",
  },
  title: {
    ...defaultFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 0.11,
  },
  bold: {
    ...boldFont,
  },
});
