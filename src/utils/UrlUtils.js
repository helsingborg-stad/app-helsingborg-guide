import { Linking, Alert } from "react-native";

export default {
  openUrlIfValid: async (url, title, message, cancel, accept) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Alert.alert(
          title, message,
          [
            { text: cancel, style: "cancel" },
            { text: accept, onPress: () => Linking.openURL(url), style: "default" },
          ],
          { cancelable: true },
        );
      }
    } catch (error) {
      return null;
    }
    return null;
  },
};
