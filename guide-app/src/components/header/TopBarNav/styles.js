import { Platform } from "react-native";

export default StyleSheet.create({

  topBarNavigation: {
    ...Platform.select({
      android: {
        paddingTop: 16,
      },
    }),
    paddingBottom: 16,
  },
})
