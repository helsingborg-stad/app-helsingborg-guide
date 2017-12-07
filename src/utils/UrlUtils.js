import { Linking } from "react-native";

export default {
  openUrlIfValid: async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        return Linking.openURL(url);
      }
    } catch (error) {
      return null;
    }
    return null;
  },
};
