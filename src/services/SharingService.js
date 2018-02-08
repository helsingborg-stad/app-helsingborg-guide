import {
  Share,
  Image,
  Text,
  View,
  Modal,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import ImageMarker from "react-native-image-marker";
import LangService from "../services/langService";
import Colors from "../styles/Colors";

const fontSize = 80;
const lineDistance = 10;
const margin = 80;
const fadeUrl = "https://api.helsingborg.se/assets/guide/images/share_fade.png";
const iconUrl = "https://api.helsingborg.se/assets/guide/images/share_icon.png";

let origin;
let isCreatingImage = false;
let shareTitle;
let shareMessage;
let shareUrl;
let shareSubject;

const Background = require("../images/black.png");
const shareIcon = require("../images/share.png");


const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    left: (Dimensions.get("window").width / 2) - 25,
    top: (Dimensions.get("window").height / 2) - 25,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    left: 0,
    top: 0,
    opacity: 0.5,
    position: "absolute",
  },
  imageHolder: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "black",
    width: Dimensions.get("window").width,
  },
  shareBoxOuter: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "#ffffff66",
    borderRadius: 1,
    padding: 10,
  },
  shareIcon: {
    marginRight: 10,
    marginLeft: 5,
  },
  shareText: {
    fontSize: 16,
    marginRight: 5,
    fontWeight: "bold",
    color: "white",
  },
});

export default {

  beginShare(title, message, url, width, height, subject) {
    // Examples: https://github.com/JimmyDaddy/react-native-image-marker/blob/master/example/example/app.js
    isCreatingImage = true;
    origin.forceUpdate();
    Image.getSize(fadeUrl, (fadeWidth, fadeHeight) => {
      Image.getSize(iconUrl, async (iconWidth, iconHeight) => {
        const resultA = await ImageMarker.markWithImage(url, fadeUrl, 0, parseInt(height) - fadeHeight, 1);
        const resultB = await ImageMarker.addText(resultA, title, margin, (parseInt(height) * 2) - (fontSize * 2) - margin - lineDistance, Colors.white, "Roboto-bold", fontSize);
        const resultC = await ImageMarker.addText(resultB, LangService.strings.SHARING_OVERLAY_TITLE, margin, (parseInt(height) * 2) - fontSize - margin, Colors.white, "Roboto", fontSize);
        const resultD = await ImageMarker.markWithImage(resultC, iconUrl, (parseInt(width) * 2) - iconWidth - margin, (parseInt(height) * 2) - iconHeight - margin, 1);

        shareTitle = title;
        shareMessage = title;
        shareUrl = `file://${resultD}`;
        shareSubject = subject;

        isCreatingImage = false;
        origin.forceUpdate();
      });
    });
  },

  finishShare() {
    Share.share({
      title: shareTitle,
      message: shareMessage,
      url: shareUrl,
      subject: shareSubject,
    });
  },

  showShareButton(title, image, sender) {
    origin = sender;
    return (
      <View>
        <TouchableOpacity onPress={() => { this.beginShare(title, "", image.url, image.width, image.height, title); }}>
          <View style={styles.shareBoxOuter}>
            <Image style={styles.shareIcon} source={shareIcon} />
            <Text style={styles.shareText}>{LangService.strings.SHARE}</Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={isCreatingImage}
          animationType="fade"
          transparent
          onDismiss={this.finishShare}
        >
          <View >
            {this.loadOverlay()}
          </View>
        </Modal>
      </View>
    );
  },

  loadOverlay() {
    return (
      <View style={styles.imageHolder}>
        <Image source={Background} style={styles.image} />
        <ActivityIndicator
          animating
          color="#bc2b78"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  },
};
