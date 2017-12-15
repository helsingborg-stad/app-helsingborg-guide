import { StyleSheet } from "react-native";
import {
  Colors,
  TextStyles,
} from "../styles/";

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Colors.darkPurple,
    borderBottomWidth: 0,
  },
});

const defaultHeader = {
  navigationOptions: {
    headerStyle: styles.headerStyle,
    headerTintColor: Colors.white,
    headerTitleStyle: TextStyles.headerTitleLabel,
    headerBackTitleStyle: TextStyles.defaultFontFamily,
    headerBackTitle: " ",
  },
};

export default {
  default: defaultHeader,
};
