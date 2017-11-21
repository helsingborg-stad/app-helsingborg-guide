import React,
{
  Component,
} from "react";
import {
  NetInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import {
  bindActionCreators,
} from "redux";
import connect from "react-redux/es/connect/connect";
import LangService from "../../services/langService";
import {
  TabBarStyles,
} from "../../styles/";
import * as guideActions from "../../actions/guideActions";
import * as subLocationActions from "../../actions/subLoactionActions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "500",
    color: "black",
  },
  languageContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  languageChoicesContainer: {
    flex: 1,
    flexDirection: "row",
  },
  choiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  choiceText: {
    fontSize: 14,
    lineHeight: 40,
    color: "#ffe3fa",
  },
});

class SettingsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object, // eslint-disable-line react/require-default-props
    guideActions: PropTypes.object.isRequired,
    subLocationActions: PropTypes.object.isRequired
  }

  static navigationOptions = {
    title: "Inställningar",
    ...TabBarStyles.settings,
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

  displayLanguages() {
    const { languages } = this.state;
    if (!languages || !Object.keys(languages).length) return null;
    const keys = Object.keys(languages);

    return keys.map((key) => {
      const style = { color: "#D35098" };
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
        <View style={styles.languageContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{LangService.strings.CHOOSE_LANGUAGE}</Text>
          </View>
          <View style={styles.languageChoicesContainer}>{this.displayLanguages()}</View>
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
