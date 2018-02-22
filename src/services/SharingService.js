import {
  Image,
  Text,
  View,
  Modal,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import React from "react";
import Share from "react-native-share";
import RNFetchBlob from "react-native-fetch-blob";
import ImageMarker from "react-native-image-marker";
import LangService from "../services/langService";
import Colors from "../styles/Colors";
import fetchService from "../services/FetchService";

const fontSize = 40;
const lineDistance = 5;
const margin = 40;
const fadeUrl = "https://api.helsingborg.se/assets/guide/images/share_fade.png";
const iconUrl = "https://api.helsingborg.se/assets/guide/images/share_icon.png";

let origin;
let isCreatingImage = false;
const iosShare = {
  title: "title",
  message: "message",
  subject: "subject",
  url: "url",
};

const Background = require("../images/black.png");
const shareIcon = require("../images/share.png");


const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    left: (Dimensions.get("window").width / 2) - 12.5,
    top: (Dimensions.get("window").height / 2) - 12.5,
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

  fetch(url) {
    const config = {
      fileCache: true,
      path: `${RNFetchBlob.fs.dirs.DownloadDir}/fade.png`,
    };

    return RNFetchBlob.config(config).fetch("GET", url);
  },

  beginShare(title, message, url, width, height, subject) {
    // The sharing process is different on ios and android.
    if (Platform.OS === "android") { this.shareAndroid(title, message, url, width, height, subject); } else { this.shareIOs(title, message, url, width, height, subject); }
  },

  shareAndroid(title, message, url, width, height, subject) {
    // Examples: https://github.com/JimmyDaddy/react-native-image-marker/blob/master/example/example/app.js

    isCreatingImage = true;
    origin.forceUpdate();

    // First we need to download the main image.
    const mainTask = fetchService.fetch(url);
    return mainTask.then((mainRes) => {
      if (mainRes) {
        // Once we have the main image, we need to download the fade overlay. //TODO: Check if cached instead of re-downloading every time.
        const fadeTask = fetchService.fetch(fadeUrl);
        return fadeTask.then((fadeRes) => {
          if (fadeRes) {
            // Last thing we need to download is the icon for the overlay. //TODO: Check if cached instead of re-downloading every time.
            const iconTask = fetchService.fetch(iconUrl);
            return iconTask.then((iconRes) => {
              if (iconRes) {
                // Setting up the paths of the local files.
                const localMainUrl = mainRes.path();
                const localFadeUrl = fadeRes.path();
                const localIconUrl = iconRes.path();
                // Once we have all parts of the overlay, we need to get the size of the files.
                Image.getSize(`file://${localFadeUrl}`, (fadeWidth, fadeHeight) => {
                  Image.getSize(`file://${localIconUrl}`, async (iconWidth, iconHeight) => {
                    // Constructing the sharing image by layering the various elements on top one after another.
                    // Warnign: Font styles can behave weirdly on Android. If you make changes that don't look correctly, check out node_modules/react-native-image-marker/android/src/main/java/com/jimmydaddy/imagemarker/ImageMarkerManager.java: 130-143
                    const resultA = await ImageMarker.markWithImage(localMainUrl, localFadeUrl, 0, height - fadeHeight, 1);
                    const resultB = await ImageMarker.addText(resultA, title, margin, parseInt(height) - (fontSize) - margin - lineDistance, Colors.white, "Roboto-Bold", fontSize);
                    const resultC = await ImageMarker.addText(resultB, LangService.strings.SHARING_OVERLAY_TITLE, margin, parseInt(height) - margin, Colors.white, "Roboto", fontSize);
                    const resultD = await ImageMarker.markWithImage(resultC, localIconUrl, parseInt(width) - (iconWidth / 2) - margin, parseInt(height) - (iconHeight / 2) - margin, 0.5);

                    // To be able to share an image on Android, the file needs to exist outside of the app cache. To move it, we need permission.
                    const granted = await PermissionsAndroid.check(
                      "android.permission.READ_EXTERNAL_STORAGE",
                    );
                    if (!granted) {
                      const response = await PermissionsAndroid.request(
                        "android.permission.READ_EXTERNAL_STORAGE",
                      );
                      if (!response) {
                        // Oh. well. No share for you :(
                        return;
                      }
                    }
                    RNFetchBlob.fs.cp(resultD, `${RNFetchBlob.fs.dirs.DownloadDir}/guideHBG.jpg`).then(() => {
                      let finalPath = `${RNFetchBlob.fs.dirs.DownloadDir}/guideHBG.jpg`;
                      finalPath = `file://${finalPath}`;

                      RNFetchBlob.fs.exists(finalPath)
                        .then((exist) => {
                          // Only attempt to share the file if we successfully managed to move it.
                          if (exist) {
                            const shareImg = {
                              title,
                              message,
                              subject,
                              url: finalPath,
                            };

                            Share.open(shareImg);

                            isCreatingImage = false;
                            origin.forceUpdate();
                          }
                        });
                    });
                  });
                });
              }
            });
          }
        });
      }
    });
  },

  shareIOs(title, message, url, width, height, subject) {
    isCreatingImage = true;
    origin.forceUpdate();

    // First we need to download the main image.
    const mainTask = fetchService.fetch(url);
    return mainTask.then((mainRes) => {
      if (mainRes) {
        // Once we have all parts of the overlay, we need to get the size of the files.
        Image.getSize(fadeUrl, (fadeWidth, fadeHeight) => {
          Image.getSize(iconUrl, async (iconWidth, iconHeight) => {
            // Constructing the sharing image by layering the various elements on top one after another.
            // iOS does weird stuff with the size of the image, meaning that all positioning needs to be multiplied by 2.
            const resultA = await ImageMarker.markWithImage(url, fadeUrl, 0, parseInt(height) - fadeHeight, 1);
            const resultB = await ImageMarker.addText(resultA, title, (margin * 2), (parseInt(height) * 2) - (fontSize * 4) - (margin * 2) - lineDistance, Colors.white, "Roboto-bold", fontSize * 2);
            const resultC = await ImageMarker.addText(resultB, LangService.strings.SHARING_OVERLAY_TITLE, margin * 2, (parseInt(height) * 2) - (fontSize * 2) - (margin * 2), Colors.white, "Roboto", fontSize * 2);
            const resultD = await ImageMarker.markWithImage(resultC, iconUrl, (parseInt(width) * 2) - iconWidth - (margin * 2), (parseInt(height) * 2) - iconHeight - (margin * 2), 1);

            // Ios dismisses the share menu when an update is forced, hence why we're just setting the vars here.
            iosShare.message = message;
            iosShare.subject = subject;
            iosShare.title = title;
            iosShare.url = resultD;

            isCreatingImage = false;
            await origin.forceUpdate();
          });
        });
      }
    });
  },

  modalClosed() {
    // Forcing update doesn't affect Android share overlay.
    if (Platform.OS === "ios") {
      Share.open(iosShare);
    }
  },

  showShareButton(title, image, sender) {
    origin = sender;
    let imageUrl = image.url;
    let imageWidth = image.width;
    let imageHeight = image.height;

    // If the main image is wider than 1900, we need to use a smaller one. The largest one generated by Wordpress is unfortunately only 1000 wide, but it's better than potentially crashing the app.
    if (parseInt(imageWidth) > 1900) {
      imageUrl = image.sizes.large;
      imageWidth = image.sizes["large-width"];
      imageHeight = image.sizes["large-height"];
    }

    return (
      <View>
        <TouchableOpacity onPress={() => { this.beginShare(title, "", imageUrl, imageWidth, imageHeight, title); }}>
          <View style={styles.shareBoxOuter}>
            <Image style={styles.shareIcon} source={shareIcon} />
            <Text style={styles.shareText}>{LangService.strings.SHARE}</Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={isCreatingImage}
          animationType="fade"
          transparent
          onDismiss={this.modalClosed}
          onRequestClose={this.modalClosed}
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
      <View style={styles.imageHolder} >
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
