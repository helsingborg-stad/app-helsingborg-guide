import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({

  wrapper: {
    position: "relative",
    width: "100%"
  },

  wrapperFocused: {
    position: "relative",
    width: "100%",
    overflow: "visible",
    zIndex: 99999
  },

  container: {
    flexDirection: "row"
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "rgba(209, 209, 209, 1)",
    borderRadius: 8
  },

  textInput: {
    flex: 1,
    fontSize: 16,
  },
  textInputCancelButton: {
    justifyContent: "center",
    marginRight: 0
  },
  textInputCancel: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 0
  },

  searchModal: {
    width: Dimensions.get("window").width,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 18,
    height: "70%",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",

    backgroundColor: "white",
    zIndex: 100000
  },

  searchModalTop: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center"
  },

  searchModalCancel: {
    textAlign: "center",
    alignSelf: "center",
    color: "#A40082",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Roboto",
    paddingLeft: 18
  }

});

export default styles;
