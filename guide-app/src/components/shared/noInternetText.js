import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LangService from "@services/langService";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noInternetContainer: {
    flex: 1,
  },
  iconContainer: { flex: 1, alignItems: "center", maxWidth: 30 },
  icon: {},
  bigTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigText: {
    fontSize: 12,
    color: "white",
  },
});

const NoInternetText = () => (
  <View style={styles.wrapper}>
    <View style={styles.noInternetContainer}>
      <View style={styles.bigTextContainer}>
        <Text style={styles.bigText}>
          {LangService.strings.NO_INTERNET_CONNECTION}
        </Text>
      </View>
    </View>
  </View>
);

export default NoInternetText;
