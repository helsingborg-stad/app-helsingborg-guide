import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "@assets/styles";

const style = StyleSheet.create({

  container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    overflow: "hidden",
    backgroundColor: Colors.themePrimary
  },

  notFound: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundTop: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 25,
  },
  notFoundBubble: {
    alignItems: "center",
    justifyContent: "center",
    width: 159,
    height: 159,
    borderRadius: 159,
    backgroundColor: "#F8F8F8",
    marginBottom: 25
  },

  notFound404: {
    fontSize: 64,
    fontWeight: "400",
    fontFamily: "Roboto",
    fontStyle: "italic",
    color: Colors.themePrimary
  },

  notFoundBottom: {
    flex: 1.3,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  notFoundTitle: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 26,
    fontFamily: "Roboto",
    color: Colors.white,
    textAlign: "center",
    paddingBottom: 5,
  },

  notFoundDescription: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    fontFamily: "Roboto",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 20,
  },

  notFoundContact: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    fontFamily: "Roboto",
    color: Colors.white,
    textAlign: "center",
  },

  notFoundMail: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    fontFamily: "Roboto",
    color: Colors.white,
    textAlign: "center",
    textDecorationLine: "underline",
  },

  notFoundBack: {
    width: 190,
    height: 50,
    backgroundColor: "transparent",
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#F8F8F8",
    marginTop: 45,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  notFoundBackText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    fontFamily: "Roboto",
    color: Colors.white,
    textAlign: "center",
    paddingLeft: 5,
  },

  city: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    width: '100%',
    maxWidth: '100%',
  }

});

export default style;
