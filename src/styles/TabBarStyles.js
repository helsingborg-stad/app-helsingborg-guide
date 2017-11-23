import React from "react";
import {
  Image,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import LangService from "../services/langService";
import {
  Colors,
} from "./";

const guideIcon = require("../images/tab-bar/iconStartpageUnselected.png");
const downloadedIcon = require("../images/tab-bar/iconDownloads.png");
const settingsIcon = require("../images/tab-bar/iconSettings.png");

const styles = StyleSheet.create({
  iconActive: {
    tintColor: Colors.purple,
    width: 22,
    height: 22,
  },
  iconInactive: {
    tintColor: Colors.warmGrey,
    width: 22,
    height: 22,
  },
});

const TabBarStyles = {
  guide: {
    tabBarLabel: () => LangService.strings.GUIDE.toUpperCase(),
    tabBarIcon: ({ focused }) => (
      <Image
        source={guideIcon}
        style={focused ? styles.iconActive : styles.iconInactive}
      />
    ),
  },
  downloaded: {
    tabBarLabel: () => LangService.strings.OFFLINE_CONTENT_TITLE.toUpperCase(),
    tabBarIcon: ({ focused }) => (
      <Image
        source={downloadedIcon}
        style={focused ? styles.iconActive : styles.iconInactive}
      />
    ),
  },
  settings: {
    tabBarLabel: () => LangService.strings.SETTINGS.toUpperCase(),
    tabBarIcon: ({ focused }) => (
      <Image
        source={settingsIcon}
        style={focused ? styles.iconActive : styles.iconInactive}
      />
    ),
  },
};

const propTypes = {
  focused: PropTypes.bool.isRequired,
};
TabBarStyles.guide.tabBarIcon.propTypes = propTypes;
TabBarStyles.downloaded.tabBarIcon.propTypes = propTypes;
TabBarStyles.settings.tabBarIcon.propTypes = propTypes;

export default TabBarStyles;
