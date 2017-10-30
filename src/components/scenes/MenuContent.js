import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
  Alert,
  NetInfo,
} from "react-native";
import ViewContainer from "../shared/view_container";
import ColoredBar from "../shared/ColoredBar";
import Icon2 from "react-native-vector-icons/MaterialIcons";

import { LangService } from "../../services/langService";
import WelcomeView from "./WelcomeView";
import DownloadManagerView from "./DownloadManagerView";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import * as guideActions from "../../actions/guideActions";
import * as subLocationActions from "../../actions/subLoactionActions";
import * as menuActions from "../../actions/menuActions";

const HALS_LOGO = require("../../images/HBG-horz.png");

class MenuContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLanguageCode: LangService.code,
      languages: LangService.languageObj,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // console.log('menu content will receive new props');
    if (!this.state.languages || !Object.keys(this.state.languages).length) {
      this.setState({
        selectedLanguageCode: LangService.code,
        languages: LangService.languageObj,
      });
    }
  }

  loadContents(langCode) {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        LangService.storeLangCode(langCode);
        this.setState({ langChanged: true });
        this.props.guideActions.loadGuides(langCode);
        this.props.subLocationActions.loadSubLocations(langCode);
        LangService.getLanguages();
      }
    });
  }

  resetToWelcome() {
    this.closeMenu();
    const route = {
      title: "Welcome",
      type: "fade",
      component: WelcomeView,
    };
    this.props.navigator().resetTo(route);
  }

  goToDownloadManager() {
    this.closeMenu();
    const route = {
      title: "Download Manager",
      type: "fade",
      component: DownloadManagerView,
      passProps: { title: LangService.strings.OFFLINE_CONTENT },
    };
    this.props.navigator().push(route);
  }

  chooseLanguage(code) {
    this.setLanguageAndReload(code);
  }

  setLanguageAndReload(code) {
    this.setState({ selectedLanguageCode: code });
    LangService.setLanguage(code);
    this.loadContents(code);
    this.closeMenu();
  }

  closeMenu() {
    this.props.menuActions.closeMenu();
  }

  displayLanguages() {
    const languages = this.state.languages;
    if (!languages || !Object.keys(languages).length) return null;
    const keys = Object.keys(languages);

    return keys.map((key) => {
      const style = { color: "#D35098" };
      const selectedStyle = this.state.selectedLanguageCode == languages[key].code ? style : null;
      const btnDisabled = this.state.selectedLanguageCode == languages[key].code;
      const nativeName = languages[key].nativeName;

      return (
        <TouchableOpacity
          key={key}
          onPress={() => this.chooseLanguage(languages[key].code)}
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
      <ViewContainer style={styles.wrapper}>
        <View style={styles.mainContainer}>
          <ColoredBar visible />
          <View style={styles.mainContentContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.closeBtnContainer}>
                <TouchableOpacity style={styles.closeBtn} onPress={this.closeMenu.bind(this)}>
                  <Icon2 name="close" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <TouchableOpacity style={styles.mainTitleContainer} onPress={this.resetToWelcome.bind(this)}>
                <Text style={styles.titleText}>{LangService.strings.ABOUT_GUIDE_HELS}</Text>
              </TouchableOpacity>
              <View style={styles.languageContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>{LangService.strings.CHOOSE_LANGUAGE}</Text>
                </View>
                <View style={styles.languageChoicesContainer}>{this.displayLanguages()}</View>
              </View>
              <View style={styles.deleteLinkContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={this.goToDownloadManager.bind(this)}>
                  <Text style={styles.titleText}>{LangService.strings.OFFLINE_CONTENT}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.voidView} />
              <View style={styles.contactUsContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.titleText}>{LangService.strings.CONTACT_US}</Text>
                </View>
                <View style={styles.bodyTextContainer}>
                  <Text style={styles.bodyText}>kontaktcenter@helsingborg.se</Text>

                  <Text style={styles.bodyText}>042-10 50 00</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} resizeMethod="scale" resizeMode="center" source={HALS_LOGO} />
        </View>
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#7B075E",
  },
  mainContainer: {
    flex: 3,
    flexDirection: "row",
  },
  headerContainer: {
    height: 50,
  },
  closeBtnContainer: {
    flex: 1,
  },
  closeBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  mainContentContainer: { flex: 1 },
  contentContainer: {
    flex: 1,
    alignItems: "flex-start",
    padding: 30,
    // backgroundColor:'blue'
  },
  mainTitleContainer: { flex: 1 },
  titleContainer: {
    flex: 1,
  },
  titleText: { fontSize: 18, lineHeight: 25, fontWeight: "500", color: "white" },

  languageContainer: { flex: 1, alignItems: "flex-start" },
  languageChoicesContainer: {
    flex: 1,
    flexDirection: "row",
    // justifyContent:'space-between',
  },
  choiceContainer: { flex: 1, justifyContent: "center", alignItems: "center", height: 40 },
  choiceText: { fontSize: 14, lineHeight: 40, color: "#ffe3fa" },
  deleteLinkContainer: { flex: 1, justifyContent: "center", paddingVertical: 20 },
  contactUsContainer: { flex: 2, justifyContent: "flex-end" },
  bodyTextContainer: {
    flex: 1,
    justifyContent: "flex-end",
    // backgroundColor:'blue'
  },
  bodyText: { fontSize: 18, lineHeight: 34, fontWeight: "300", color: "rgba(255,255,255,.9)" },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(244,244,244,0.3)",
  },
  // logo:{ width:200, height:40},

  voidView: { flex: 1 },
});

// store config

function mapStateToProps(state, ownProps) {
  return {
    menuVisible: state.menu.visible,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    guideActions: bindActionCreators(guideActions, dispatch),
    subLocationActions: bindActionCreators(subLocationActions, dispatch),
    menuActions: bindActionCreators(menuActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuContent);
