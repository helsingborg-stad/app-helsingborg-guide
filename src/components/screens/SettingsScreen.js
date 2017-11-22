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
} from "react-native";
import PropTypes from "prop-types";
import {
  bindActionCreators,
} from "redux";
import connect from "react-redux/es/connect/connect";
import LangService from "../../services/langService";
import {
  Colors,
  TabBarStyles,
  TextStyles,
} from "../../styles/";
import {
  StyleSheetUtils,
} from "../../utils/";
import * as guideActions from "../../actions/guideActions";
import * as subLocationActions from "../../actions/subLoactionActions";

const defaultMargin = 20;

const helsingborgIcon = require("../../images/HBG.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  titleText: {
    fontSize: 20,
    lineHeight: 23,
    fontWeight: "500",
    color: "black",
    marginHorizontal: defaultMargin,
    marginTop: defaultMargin,
    marginBottom: 10,
  },
  linkText: StyleSheetUtils.flatten([
    TextStyles.defaultFontFamily, {
      fontSize: 17,
      lineHeight: 23,
      color: Colors.purple,
      marginHorizontal: defaultMargin,
    }]),
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
  choiceText: {
    fontFamily: "Roboto",
    fontSize: 17,
    color: "black",
    lineHeight: 23,
  },
  icon: {
    tintColor: "black",
    margin: defaultMargin,
  },
  contactUsContainer: {
    alignItems: "center",
  },
  contactEmailText: {
    fontSize: 17,
    lineHeight: 23,
    color: "black",
    textAlign: "center",
  },
  contactPhoneText: {
    marginTop: 10,
    fontSize: 20,
    lineHeight: 23,
    color: "black",
    textAlign: "center",
  },
  divider: {
    margin: defaultMargin,
    height: 1,
    backgroundColor: Colors.pinkishGrey,
  },
});

class SettingsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    guideActions: PropTypes.object.isRequired,
    subLocationActions: PropTypes.object.isRequired,
  }

  static navigationOptions = () => {
    const title = LangService.strings.SETTINGS;
    return {
      title,
      ...TabBarStyles.settings,
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
        this.props.subLocationActions.loadSubLocations(langCode);
        LangService.getLanguages();
      }
    });
  }

  navigateToWelcomeView = () => {
    const { navigate } = this.props.navigation;
    navigate("WelcomeView");
  };

  displayLanguages() {
    const { languages } = this.state;
    if (!languages || !Object.keys(languages).length) return null;
    const keys = Object.keys(languages);

    return keys.map((key) => {
      const style = { color: Colors.purple };
      const selectedStyle = this.state.selectedLanguageCode === languages[key].code ? style : null;
      const btnDisabled = this.state.selectedLanguageCode === languages[key].code;
      const { nativeName } = languages[key];

      return (
        <TouchableOpacity
          key={key}
          onPress={() => this.setLanguageAndReload(languages[key].code)}
          disabled={btnDisabled}
          activeOpacity={0.7}
          style={styles.choiceContainer}
        >
          <Text style={[styles.choiceText, selectedStyle]}>{nativeName.split(" ")[0]}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[TextStyles.defaultFontFamily, styles.titleText]}>{LangService.strings.CHOOSE_LANGUAGE}</Text>
        <View style={styles.languageContainer}>
          <View style={styles.languageChoicesContainer}>{this.displayLanguages()}</View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.titleText}>{LangService.strings.ABOUT} {LangService.strings.APP_NAME}</Text>
        <TouchableOpacity onPress={this.navigateToWelcomeView}>
          <Text style={styles.linkText}>{LangService.strings.SEE} {LangService.strings.TUTORIAL}</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.contactUsContainer}>
          <Image source={helsingborgIcon} style={styles.icon} />
          <View style={styles.contactTextContainer}>
            <Text style={[TextStyles.defaultFontFamily, styles.contactEmailText]}>kontaktcenter@helsingborg.se</Text>
            <Text style={styles.contactPhoneText}>042-10 50 00</Text>
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
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
