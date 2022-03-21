import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, Linking } from "react-native";
import Config from "react-native-config";
import { HeaderStyles } from "@assets/styles";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import LangService from "@services/langService";
import Icon from "react-native-vector-icons/Ionicons";
import ArrowRight from "@assets/images/arrow_right_2";
import styles from "./style";
import { useSelector } from "react-redux";


const NotFoundScreen = (props) => {
  const { navigation } = props;
  const { openedLink } = useSelector(s => s.uiState)
  const support = Config.SUPPORT_LINK;

  const toSupport = () => {
    Linking.openURL(`mailto:${support}?subject=${
      LangService.strings.CONTACT_MAIL_SUBJECT}
      &body=There was a problem opening this link in the app:
     ${openedLink}`)
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.notFound}>
          <View style={styles.notFoundTop}>
            <Text style={styles.notFoundTitle}>{LangService.strings.NOT_FOUND_TITLE}</Text>
            <Text style={styles.notFoundDescription}>{LangService.strings.NOT_FOUND_DESCRIPTION}</Text>
          </View>
          <View style={styles.notFoundBottom}>
            <Text style={styles.notFoundContact}>{LangService.strings.NOT_FOUND_CONTACT}</Text>
            <TouchableOpacity onPress={toSupport}><Text style={styles.notFoundMail}>kontaktcenter@helsingborg.se</Text></TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("HomeScreen")}
              style={styles.notFoundBack}>
              <ArrowRight />
              <Text style={styles.notFoundBackText}>{LangService.strings.GO_BACK}</Text>

            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

NotFoundScreen["navigationOptions"] = ({ navigation }) => {
  const { title, path } = navigation.state.params;
  return {
    ...HeaderStyles.noElevation,
    title,
    headerRight: () => <View />,
    headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />
  };
};

export default NotFoundScreen;
