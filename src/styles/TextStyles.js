import {
    StyleSheet,
} from "react-native";
import {
    Colors,
} from "../styles/";

// Shared constants
const defaultFont = {
    fontFamily: "Roboto",
    color: Colors.textBlack,
};

export default StyleSheet.create({
    // Root
    defaultFontFamily: {
        ...defaultFont,
    },
});