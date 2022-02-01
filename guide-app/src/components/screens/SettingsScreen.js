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
import CalendarDetailsScreen from "./CalendarDetailsScreen";

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
  languageText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 18,
      color: Colors.black,
    },
  ]),
  linkText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 18,
      color: Colors.black,
      marginHorizontal: defaultMargin,
    },
  ]),
  contactEmailText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      color: Colors.black,
      textAlign: "center",
    },
  ]),
  contactPhoneText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      marginTop: 10,
      lineHeight: 23,
      color: Colors.black,
      textAlign: "center",
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

class SettingsScreen extends Component<Props, State> {
  static navigationOptions = () => {
    const title = LangService.strings.SETTINGS;
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
    setLanguage: PropTypes.func.isRequired,
    dispatchSetDeveloperMode: PropTypes.func.isRequired,
    dispatchShowBottomBar: PropTypes.func.isRequired,
    dispatchSelectBottomBarTab: PropTypes.func.isRequired,
  };

  constructor(props: Props) {
    super(props);

    this.updateDeveloperMode = this.updateDeveloperMode.bind(this);
    this.loadContents = this.loadContents.bind(this);
    this.netInfoListener = "";
    this.state = {
      selectedLanguageCode: LangService.code,
      languages: LangService.languageObj,
      debugStatus: 0,
      connected: "",
    };
  }



  componentDidMount() {
    this.netInfoListener = NetInfo.addEventListener((state) => {
       this.setState({connected: state.isConnected})
    })
  }

  componentWillUnmount() {
    if (this.netInfoListener) {
      return this.netInfoListener;
    }
  }

  loadContents(langCode) {
    console.log("lang state", this.state)
      if (this.state.connected) {
        LangService.storeLangCode(langCode);
        LangService.getLanguages();
      }
  }

  setLanguageAndReload = code => {
    trackEvent("change", "change_language", code);
    // AnalyticsUtils.logEvent("change_language", { language_code: code });
    this.setState({ selectedLanguageCode: code });
    LangService.setLanguage(code);
    this.props.setLanguage(code);
    // Set navigation params to force an update
    this.props.navigation.setParams();
    this.loadContents(code);
  };

  navigateToWelcomeScreen = () => {
    const { navigate } = this.props.navigation;
    this.props.dispatchShowBottomBar(false);
    this.props.dispatchSelectBottomBarTab(0);
    navigate("WelcomeScreen");
  };

  navigateToDownloadsScreen = () => {
    const { navigate } = this.props.navigation;
    navigate("DownloadsScreen");
  };

  navigateToDebugScreen = () => {
    const { navigate } = this.props.navigation;
    navigate("DebugScreen");
  };

  displayLanguageSegment() {
    console.log("languages", languages)
    const { languages } = this.state;
    if (!languages || !Object.keys(languages).length) {
      return <View style={styles.emptySpace} />;
    }

    return (
      <View>
        <Text style={textStyles.titleText}>
          {LangService.strings.CHOOSE_LANGUAGE}
        </Text>
        <View style={styles.languageContainer}>
          <View style={styles.languageChoicesContainer}>
            {this.displayLanguages(languages)}
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  displayLanguages(languages) {
    return languages.map(language => {
      const { name, slug } = language;
      const style = {
        ...TextStyles.bold,
        color: Colors.themePrimary,
        textDecorationLine: "underline",
      };
      const selectedStyle =
        this.state.selectedLanguageCode === slug ? style : null;
      const btnDisabled = this.state.selectedLanguageCode === slug;

      return (
        <TouchableOpacity
          key={name}
          onPress={() => this.setLanguageAndReload(slug)}
          disabled={btnDisabled}
          activeOpacity={0.7}
          style={styles.choiceContainer}
        >
          <Text style={[textStyles.languageText, selectedStyle]}>
            {name.split(" ")[0]}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  displayDeveloperMenuButton() {
    return (
      <View>
        <View style={styles.divider} />
        <TouchableOpacity onPress={this.navigateToDebugScreen}>
          <Text style={textStyles.linkText}>Developer Info</Text>
        </TouchableOpacity>
      </View>
    );
  }

  updateDeveloperMode() {
    this.setState({ debugStatus: this.state.debugStatus + 1 });
    if (this.state.debugStatus >= 10) {
      this.setState({ debugStatus: 0 });
      this.props.dispatchSetDeveloperMode(!this.props.developerMode);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.displayLanguageSegment()}
        <TouchableOpacity onPress={this.navigateToWelcomeScreen}>
          <Text style={textStyles.linkText}>
            {LangService.strings.SEE} {LangService.strings.TUTORIAL}
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={this.navigateToDownloadsScreen}>
          <Text style={textStyles.linkText}>
            {LangService.strings.OFFLINE_CONTENT}
          </Text>
        </TouchableOpacity>

        {this.props.developerMode ? this.displayDeveloperMenuButton() : null}
        <View style={styles.divider} />
        <View style={styles.contactUsContainer}>
          <TouchableWithoutFeedback onPress={this.updateDeveloperMode}>
            <Image
              source={LOGO}
              style={this.props.developerMode ? styles.debugIcon : styles.icon}
            />
          </TouchableWithoutFeedback>
          <View style={styles.contactTextContainer}>
            <Text
              onPress={() =>
                Linking.openURL(
                  `mailto:${LangService.strings.CONTACT_MAIL_ADRESS}?subject=${
                    LangService.strings.CONTACT_MAIL_SUBJECT
                  }`,
                )
              }
              style={textStyles.contactEmailText}
            >
              {LangService.strings.CONTACT_MAIL_ADRESS}
            </Text>
            <Text
              onPress={() =>
                Linking.openURL(`tel:${LangService.strings.CONTACT_PHONE}`)
              }
              style={textStyles.contactPhoneText}
            >
              {LangService.strings.CONTACT_PHONE_DISPLAY}
            </Text>
          </View>
        </View>
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
    dispatchSetDeveloperMode: enabled => dispatch(setDeveloperMode(enabled)),
    dispatchShowBottomBar: visible => dispatch(showBottomBar(visible)),
    dispatchSelectBottomBarTab: index =>
      dispatch(selectCurrentBottomBarTab(index)),
    setLanguage: langCode => dispatch(setLanguage(langCode)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);
