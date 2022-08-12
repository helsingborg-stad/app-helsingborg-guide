import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, Linking } from "react-native";
import Config from "react-native-config";
import { HeaderStyles } from "@assets/styles";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import LangService from "@services/langService";
import ArrowRight from "@assets/images/arrow_right_2";
import CityBackground from "@assets/images/city.svg";
import NavigatorService from "@services/navigationService";
import styles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { showBottomBar } from "../../../actions/uiStateActions";

type Props = {
  navigation: Object,
}

const NotFoundScreen = (props: Props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { openedLink } = useSelector(s => s.uiState);
  const support = Config.SUPPORT_LINK;

  const toSupport = () => {
    Linking.openURL(`mailto:${support}?subject=${
      LangService.strings.CONTACT_MAIL_SUBJECT}
      &body=There was a problem opening this link in the app:
     ${openedLink}`);
  };
  useEffect(() => {
    navigation.isFocused() && dispatch(showBottomBar(false));
  }, [navigation.isFocused()]);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.notFound}>
          <View style={styles.notFoundTop}>
            <Text style={styles.notFoundTitle}>{LangService.strings.NOT_FOUND_TITLE}</Text>
            <Text style={styles.notFoundDescription}>{LangService.strings.NOT_FOUND_DESCRIPTION}</Text>
            <Text style={styles.notFoundDescription}>{LangService.strings.SCAN_QR_CODES_REMINDER}</Text>
          </View>
          <View style={styles.notFoundBottom}>
            <Text style={styles.notFoundContact}>{LangService.strings.NOT_FOUND_CONTACT}</Text>
            <TouchableOpacity onPress={toSupport}><Text style={styles.notFoundMail}>kontaktcenter@helsingborg.se</Text></TouchableOpacity>
            <TouchableOpacity
              onPress={() => NavigatorService.reset("HomeScreen")}
              style={styles.notFoundBack}>
              <ArrowRight />
              <Text style={styles.notFoundBackText}>{LangService.strings.GO_BACK}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.city}>
            <CityBackground />
          </View>
        </View>
      </View>
    </>
  );
};

NotFoundScreen["navigationOptions"] = ({ navigation, route }) => {
  const title = route?.params?.title || "";
  const path = route?.params?.path || "";
  return {
    ...HeaderStyles.noElevation,
    title,
    headerRight: () => <View />,
    headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />
  };
};

export default NotFoundScreen;
