import React,
{
  Component,
} from "react";
import {
  NetInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import LangService from "../../services/langService";
import {
  Colors,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
  AnalyticsUtils,
} from "../../utils/";
import { fetchGuideGroups } from "../../actions/guideGroupActions";
import { fetchGuides } from "../../actions/guideActions";
import { fetchNavigation } from "../../actions/navigationActions";
import { setDeveloperMode, showBottomBar, selectCurrentBottomBarTab } from "../../actions/uiStateActions";

const defaultMargin = 20;
const helsingborgIcon = require("../../images/HBG.png");

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
    tintColor: Colors.purple,
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
    backgroundColor: Colors.pinkishGrey,
  },
  emptySpace: {
    margin: defaultMargin * 0.5,
  },
});

const textStyles = StyleSheet.create({
  titleText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 16,
      lineHeight: 23,
      color: Colors.black,
      fontWeight: "bold",
      marginHorizontal: defaultMargin,
      marginTop: defaultMargin,
      marginBottom: 10,
    }],
  ),
  languageText: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 18,
      color: Colors.black,
    }],
  ),
  linkText: StyleSheetUtils.flatten([
    TextStyles.body, {
      fontSize: 18,
      color: Colors.black,
      marginHorizontal: defaultMargin,
    }],
  ),
  contactEmailText: StyleSheetUtils.flatten([
    TextStyles.body, {
      color: Colors.black,
      textAlign: "center",
    }],
  ),
  contactPhoneText: StyleSheetUtils.flatten([
    TextStyles.body, {
      marginTop: 10,
      lineHeight: 23,
      color: Colors.black,
      textAlign: "center",
    }],
  ),
});

class SettingsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    dispatchFetchNavigation: PropTypes.func.isRequired,
    dispatchFetchGuideGroups: PropTypes.func.isRequired,
    dispatchFetchGuides: PropTypes.func.isRequired,
    dispatchSetDeveloperMode: PropTypes.func.isRequired,
    dispatchShowBottomBar: PropTypes.func.isRequired,
    dispatchSelectBottomBarTab: PropTypes.func.isRequired,
  }


  static navigationOptions = () => {
    const title = LangService.strings.SETTINGS;
    return {
      title,
      headerLeft: null,
    };
  };


  constructor(props) {
    super(props);

    this.updateDeveloperMode = this.updateDeveloperMode.bind(this);

    this.state = {
      selectedLanguageCode: LangService.code,
      languages: LangService.languageObj,
      debugStatus: 0,
    };
  }

  componentWillReceiveProps() {
    if (!this.state.languages || !Object.keys(this.state.languages).length) {
      this.setState({
        selectedLanguageCode: LangService.code,
        languages: LangService.languageObj,
      });
    }
  }

  setLanguageAndReload = (code) => {
    AnalyticsUtils.logEvent("change_language", { language_code: code });
    this.setState({ selectedLanguageCode: code });
    LangService.setLanguage(code);
    // Set navigation params to force an update
    this.props.navigation.setParams();
    this.loadContents(code);
  }

  loadContents(langCode) {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        LangService.storeLangCode(langCode);
        this.props.dispatchFetchNavigation(langCode);
        this.props.dispatchFetchGuideGroups(langCode);
        this.props.dispatchFetchGuides(langCode);
        LangService.getLanguages();
      }
    });
  }

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
    const { languages } = this.state;
    if (!languages || !Object.keys(languages).length) {
      return (
        <View style={styles.emptySpace} />
      );
    }

    return (
      <View>
        <Text style={textStyles.titleText}>{LangService.strings.CHOOSE_LANGUAGE}</Text>
        <View style={styles.languageContainer}>
          <View style={styles.languageChoicesContainer}>{this.displayLanguages(languages)}</View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  displayLanguages(languages) {
    return languages.map((language) => {
      const { name, slug } = language;
      const style = { color: Colors.purple, fontWeight: "bold", textDecorationLine: "underline" };
      const selectedStyle = this.state.selectedLanguageCode === slug ? style : null;
      const btnDisabled = this.state.selectedLanguageCode === slug;

      return (
        <TouchableOpacity
          key={name}
          onPress={() => this.setLanguageAndReload(slug)}
          disabled={btnDisabled}
          activeOpacity={0.7}
          style={styles.choiceContainer}
        >
          <Text style={[textStyles.languageText, selectedStyle]}>{name.split(" ")[0]}</Text>
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
      </View>);
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
          <Text style={textStyles.linkText}>{LangService.strings.SEE} {LangService.strings.TUTORIAL}</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={this.navigateToDownloadsScreen}>
          <Text style={textStyles.linkText}>{LangService.strings.OFFLINE_CONTENT}</Text>
        </TouchableOpacity>

        {this.props.developerMode ? this.displayDeveloperMenuButton() : null}
        <View style={styles.divider} />
        <View style={styles.contactUsContainer}>
          <TouchableWithoutFeedback onPress={this.updateDeveloperMode}>
            <Image source={helsingborgIcon} style={this.props.developerMode ? styles.debugIcon : styles.icon} />
          </TouchableWithoutFeedback>
          <View style={styles.contactTextContainer}>
            <Text
              onPress={() =>
                Linking.openURL(`mailto:${LangService.strings.CONTACT_MAIL_ADRESS}?subject=${LangService.strings.CONTACT_MAIL_SUBJECT}`)}
              style={textStyles.contactEmailText}
            >{LangService.strings.CONTACT_MAIL_ADRESS}</Text>
            <Text
              onPress={() =>
                Linking.openURL(`tel:${LangService.strings.CONTACT_PHONE}`)}
              style={textStyles.contactPhoneText}
            >{LangService.strings.CONTACT_PHONE_DISPLAY}</Text>
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
    dispatchFetchNavigation: langCode => dispatch(fetchNavigation(langCode)),
    dispatchFetchGuides: langCode => dispatch(fetchGuides(langCode)),
    dispatchFetchGuideGroups: langCode => dispatch(fetchGuideGroups(langCode)),
    dispatchSetDeveloperMode: enabled => dispatch(setDeveloperMode(enabled)),
    dispatchShowBottomBar: visible => dispatch(showBottomBar(visible)),
    dispatchSelectBottomBarTab: index => dispatch(selectCurrentBottomBarTab(index)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
