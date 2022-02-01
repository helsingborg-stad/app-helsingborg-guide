import React, { Component } from "react";
import {
  StyleSheet,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LangService from "@services/langService";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";
import {
  showBottomBar,
  selectCurrentBottomBarTab,
} from "@actions/uiStateActions";
import { trackEvent } from "@utils/MatomoUtils";

const defaultMargin = 20;

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
