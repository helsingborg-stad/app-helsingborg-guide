import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Linking,
  TouchableWithoutFeedback, StatusBar
} from "react-native";
import DeviceInfo from "react-native-device-info";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch, useSelector } from "react-redux";
import LangService from "@services/langService";
import { Colors, TextStyles } from "@assets/styles";
import { StyleSheetUtils } from "@utils";
import { setLanguage } from "@actions/navigationActions";
import {
  setDeveloperMode,
  showBottomBar,
  selectCurrentBottomBarTab
} from "@actions/uiStateActions";
import { trackEvent, trackScreen } from "@utils/MatomoUtils";
import { fetchNavigation } from "../../actions/navigationActions";

const defaultMargin = 20;
const LOGO = require("@assets/images/logo.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  languageContainer: {
    alignItems: "flex-start"
  },
  languageChoicesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: defaultMargin
  },
  choiceContainer: {
    flex: 1
  },
  icon: {
    tintColor: Colors.black,
    margin: defaultMargin
  },
  debugIcon: {
    tintColor: Colors.themePrimary,
    margin: defaultMargin
  },
  contactUsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  versionContainer: {
    marginHorizontal: defaultMargin
  },


  divider: {
    margin: defaultMargin,
    height: 1,
    backgroundColor: Colors.gray6
  },
  emptySpace: {
    margin: defaultMargin * 0.5
  }
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
      marginBottom: 10
    }
  ]),
  languageText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 18,
      color: Colors.black
    }
  ]),
  linkText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      fontSize: 18,
      color: Colors.black,
      marginHorizontal: defaultMargin
    }
  ]),
  contactEmailText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      color: Colors.black,
      textAlign: "center"
    }
  ]),
  contactPhoneText: StyleSheetUtils.flatten([
    TextStyles.body,
    {
      marginTop: 10,
      lineHeight: 23,
      color: Colors.black,
      textAlign: "center"
    }
  ]),
  versionText: {
    fontSize: 12,
    color: Colors.black
  }

});

type Props = {
  navigation: any,
}

const SettingsScreen = (props: Props) => {

  const { navigation } = props;
  const { developerMode } = useSelector(s => s).uiState;
  const dispatch = useDispatch();
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(LangService.code);
  const [languages, setLanguages] = useState(LangService.languageObj);
  const [debugStatus, setDebugStatus] = useState(0);
  const [connected, setConnected] = useState("");

  useEffect(() => {
    if (!languages || Object.keys(languages).length === 0) {
      setSelectedLanguageCode(LangService.code);
      setLanguages(LangService.languageObj);
    }
  }, [languages]);

  useEffect(() => {
    LangService.getLanguages();
    navigation.setParams();
    navigation.setOptions({
      title: LangService.strings.SETTINGS,
      headerLeft: () => null
    });
    trackScreen("/settings", "/settings");
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });
    return () => unsubscribe;
  }, []);


  const loadContents = (langCode) => {
    if (connected) {
      LangService.storeLangCode(langCode);
      LangService.getLanguages();
    }
  };

  const setLanguageAndReload = code => {
    dispatch(fetchNavigation(code));
    trackEvent("change", "change_language", code);
    setSelectedLanguageCode(code);
    LangService.setLanguage(code);
    dispatch(setLanguage(code));
    navigation.setOptions({ title: LangService.strings.SETTINGS });
    // Set navigation params to force an update
    navigation.setParams();

    loadContents(code);
  };

  const navigateToWelcomeScreen = () => {
    const { navigate } = navigation;
    dispatch(showBottomBar(false));
    dispatch(selectCurrentBottomBarTab(0));
    navigate("WelcomeScreen");
  };

  const navigateToDownloadsScreen = () => {
    const { navigate } = navigation;
    navigate("DownloadsScreen");
  };

  const navigateToDebugScreen = () => {
    const { navigate } = navigation;
    navigate("DebugScreen");
  };

  const displayLanguageSegment = () => {
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
            {displayLanguages(languages)}
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  const displayLanguages = (languages) => {
    return languages.map(language => {
      const { name, slug } = language;
      const style = {
        ...TextStyles.bold,
        color: Colors.themePrimary,
        textDecorationLine: "underline"
      };
      const selectedStyle =
        selectedLanguageCode === slug ? style : null;
      const btnDisabled = selectedLanguageCode === slug;

      return (
        <TouchableOpacity
          key={name}
          onPress={() => setLanguageAndReload(slug)}
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
  };

  const displayDeveloperMenuButton = () => {
    return (
      <View>
        <View style={styles.divider} />
        <TouchableOpacity onPress={navigateToDebugScreen}>
          <Text style={textStyles.linkText}>Developer Info</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const updateDeveloperMode = () => {
    this.setState({ debugStatus: debugStatus + 1 });
    if (debugStatus >= 10) {
      setDebugStatus(0);
      dispatch(setDeveloperMode(!developerMode));
    }
  };


  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.themeSecondary} />
      <View style={styles.container}>
        {displayLanguageSegment()}
        <TouchableOpacity onPress={navigateToWelcomeScreen}>
          <Text style={textStyles.linkText}>
            {LangService.strings.SEE} {LangService.strings.TUTORIAL}
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={navigateToDownloadsScreen}>
          <Text style={textStyles.linkText}>
            {LangService.strings.OFFLINE_CONTENT}
          </Text>
        </TouchableOpacity>
        {developerMode ? displayDeveloperMenuButton() : null}
        <View style={styles.divider} />
        <View style={styles.versionContainer}>
          <Text style={textStyles.versionText}>
            version {DeviceInfo.getVersion()}
          </Text>
        </View>
        <View style={styles.contactUsContainer}>
          <TouchableWithoutFeedback onPress={updateDeveloperMode}>
            <Image
              source={LOGO}
              style={developerMode ? styles.debugIcon : styles.icon}
            />
          </TouchableWithoutFeedback>
          <View style={styles.contactTextContainer}>
            <Text
              onPress={() =>
                Linking.openURL(
                  `mailto:${LangService.strings.CONTACT_MAIL_ADRESS}?subject=${
                    LangService.strings.CONTACT_MAIL_SUBJECT
                  }`
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
    </>
  );
};

export default SettingsScreen;
