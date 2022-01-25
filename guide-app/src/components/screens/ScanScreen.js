import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LangService from "@services/langService";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils, AnalyticsUtils } from "@utils";
import { setLanguage } from "@actions/navigationActions";
import {
  setDeveloperMode,
  showBottomBar,
  selectCurrentBottomBarTab,
} from "@actions/uiStateActions";
import { trackEvent } from "@utils/MatomoUtils";

const defaultMargin = 20;
const LOGO = require("@assets/images/logo.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  languageContainer: {
    alignItems: "flex-start",
  },
  languageChoicesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: defaultMargin,
  },
  choiceContainer: {
    flex: 1,
  },
  icon: {
    tintColor: Colors.black,
    margin: defaultMargin,
  },
  debugIcon: {
    tintColor: Colors.themePrimary,
    margin: defaultMargin,
  },
  contactUsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    margin: defaultMargin,
    height: 1,
    backgroundColor: Colors.gray6,
  },
  emptySpace: {
    margin: defaultMargin * 0.5,
  },
});

const textStyles = StyleSheet.create({
  titleText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily,
    {
      ...TextStyles.bold,
      fontSize: 16,
      lineHeight: 23,
      color: Colors.black,
      marginHorizontal: defaultMargin,
      marginTop: defaultMargin,
      marginBottom: 10,
    },
  ]),
});

function loadContents(langCode) {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      LangService.storeLangCode(langCode);
      LangService.getLanguages();
    }
  });
}

type Props = {
  developerMode: any,
};

type State = {
  selectedLanguageCode: any,
  languages: any,
  debugStatus: any,
};

class ScanScreen extends Component<Props, State> {
  static navigationOptions = () => {
    const title = LangService.strings.SCAN;
    return {
      title,
      headerLeft: () => null,
    };
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { languages } = prevState;

    if (!languages || Object.keys(languages).length === 0) {
      return {
        selectedLanguageCode: LangService.code,
        languages: LangService.languageObj,
      };
    }
    return null;
  }

  static propTypes = {
    navigation: PropTypes.object,
    dispatchShowBottomBar: PropTypes.func.isRequired,
    dispatchSelectBottomBarTab: PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);

    this.state = {

    };
  }


  render() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

// store config
function mapStateToProps(state) {
  const { developerMode } = state.uiState;
  return {
    developerMode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchShowBottomBar: visible => dispatch(showBottomBar(visible)),
    dispatchSelectBottomBarTab: index =>
      dispatch(selectCurrentBottomBarTab(index)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScanScreen);
