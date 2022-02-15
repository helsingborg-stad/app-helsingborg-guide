import { StyleSheet, Dimensions } from "react-native"

const styles = StyleSheet.create({

  wrapper: {
    width: '100%',
    paddingTop: 10
  },

  wrapperFocused: {
    width: Dimensions.get("window").width,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    overflow: 'hidden',
    zIndex: 99999,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  container: {
    flexDirection: 'row',
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'white',
    paddingHorizontal: 15,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 8,
  },

  textInput: {
      flex: 1,
  }
})

export default styles;
