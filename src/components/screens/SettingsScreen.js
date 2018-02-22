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
} from "react-native";
import PropTypes from "prop-types";
import {
  bindActionCreators,
} from "redux";
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
import * as guideActions from "../../actions/guideActions";
import * as navigationActions from "../../actions/navigationActions";
import * as subLocationActions from "../../actions/subLoactionActions";

const defaultMargin = 20;
const helsingborgIcon = require("../../images/HBG.png");
const goBackIcon = require("../../images/iconBack.png");

const styles = StyleSheet.create({
  barButtonItem: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  barButtonFiller: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 58,
  },
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
  choiceText: StyleSheetUtils.flatten([
    TextStyles.body, {
      color: Colors.black,
    }],
  ),
});

class SettingsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    guideActions: PropTypes.object.isRequired,
    navigationActions: PropTypes.object.isRequired,
    subLocationActions: PropTypes.object.isRequired,
  }


  static navigationOptions = ({ navigation }) => {
    const title = LangService.strings.SETTINGS;
    return {
      title,
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.barButtonItem}
        >
          <Image source={goBackIcon} />
        </TouchableOpacity>
      ),
      headerRight: (
        <View style={styles.barButtonFiller} />
      ),
    };
  };


  constructor(props) {
    super(props);

    this.state = {
      selectedLanguageCode: LangService.code,
      languages: LangService.languageObj,
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
        this.props.guideActions.loadGuides(langCode);
        this.props.navigationActions.fetchNavigation(langCode);
        this.props.subLocationActions.loadSubLocations(langCode);
        LangService.getLanguages();
      }
    });
  }

  navigateToWelcomeScreen = () => {
    const { navigate } = this.props.navigation;
    navigate("WelcomeScreen");
  };

  navigateToDownloadsScreen = () => {
    const { navigate } = this.props.navigation;
    navigate("DownloadsScreen");
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
        <View style={styles.divider} />
        <View style={styles.contactUsContainer}>
          <Image source={helsingborgIcon} style={styles.icon} />
          <View style={styles.contactTextContainer}>
            <Text onPress={() => Linking.openURL(`mailto:${LangService.strings.CONTACT_MAIL_ADRESS}?subject=${LangService.strings.CONTACT_MAIL_SUBJECT}`)} style={textStyles.contactEmailText}>{LangService.strings.CONTACT_MAIL_ADRESS}</Text>
            <Text onPress={() => Linking.openURL(`tel:${LangService.strings.CONTACT_PHONE}`)} style={textStyles.contactPhoneText}>{LangService.strings.CONTACT_PHONE_DISPLAY}</Text>
          </View>
        </View>
      </View>
    );
  }
}

// store config
function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    guideActions: bindActionCreators(guideActions, dispatch),
    navigationActions: bindActionCreators(navigationActions, dispatch),
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
