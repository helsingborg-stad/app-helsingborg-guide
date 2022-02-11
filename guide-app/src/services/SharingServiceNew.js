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
import React, { useReducer } from "react";
import Share from "react-native-share";
import RNFetchBlob from "rn-fetch-blob";
import ImageMarker from "react-native-image-marker";
import LangService from "@services/langService";
import Colors from "@assets/styles/Colors";
import fetchService from "@services/FetchService";
import { AnalyticsUtils } from "@utils";
import TextStyles from "@assets/styles/TextStyles";
import { sharingFadeUrl, sharingIconUrl } from "@data/urls";
import { trackEvent } from "../utils/MatomoUtils";

const shareImageURL = require("@assets/images/share_icon.png");
const fadeImageURL = require("@assets/images/share_fade.png");

const shareImage = Image.resolveAssetSource(shareImageURL);
const fadeImage = Image.resolveAssetSource(fadeImageURL);

console.log("shareIcon", shareImage, "fadeIcon", fadeImage);

const fontSize = 40;
const lineDistance = 5;
const margin = 40;
const iconScale = 0.5;

let origin;
let isCreatingImage = false;
let iosShare = {
  message: "",
  subject: "",
  title: "",
  url: "",
};

const Background = require("@assets/images/black.png");
const shareIcon = require("@assets/images/share.png");

const styles = StyleSheet.create({
  activityIndicator: {
    left: Dimensions.get("window").width / 2 - 12.5,
    position: "absolute",
    top: Dimensions.get("window").height / 2 - 12.5,
  },
  image: {
    height: Dimensions.get("window").height,
    left: 0,
    opacity: 0.5,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
  },
  imageHolder: {
    backgroundColor: "black",
    left: 0,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
  },
  shareBoxOuter: {
    backgroundColor: Colors.white,
    borderColor: Colors.themeSecondary,
    borderRadius: 1,
    borderWidth: 1,
    flexDirection: "row",
    padding: 10,
  },
  shareIcon: {
    marginLeft: 5,
    marginRight: 10,
    tintColor: Colors.themeSecondary,
  },
  shareText: {
    color: Colors.themeSecondary,
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
});

const SharedImageProperties = {
  markerScale: 1,
  scale: 1,
  quality: 100,
};

const SharedTextProperties = { color: Colors.white, fontSize };

const getPlatformURI = path =>
  Platform.OS === "ios" ? path : `file://${path}`;

function beginShare(title, message, url, width, height, subject, shareType, forceUpdate) {

  // AnalyticsUtils.logEvent(shareType, { name: title });
  // The sharing process is different on ios and android.
  if (Platform.OS === "android") {
    shareAndroid(title, message, url, width, height, subject, forceUpdate);
  } else {
    shareIOs(title, message, url, width, height, subject, forceUpdate);
  }
}


async function shareAndroid(title, message, url, width, height, subject, forceUpdate) {
  // Examples: https://github.com/JimmyDaddy/react-native-image-marker/blob/master/example/example/app.js

  function finish() {
    isCreatingImage = false;
    forceUpdate();
  }

  isCreatingImage = true;
  forceUpdate();

  // First we need to download the main image.
  const mainRes = await fetchService.fetch(url);
  const fadeRes = await fetchService.fetch(sharingFadeUrl); //TODO: Check if cached instead of re-downloading every time.
  const iconRes = await fetchService.fetch(sharingIconUrl); //TODO: Check if cached instead of re-downloading every time.
  // Setting up the paths of the local files.
  const localFadeUrl = getPlatformURI(fadeRes.path());
  const localIconUrl = getPlatformURI(iconRes.path());

  // Once we have all parts of the overlay, we need to get the size of the files.
  Image.getSize(localFadeUrl, async (fadeWidth, fadeHeight) => {
    Image.getSize(localIconUrl, async (iconWidth, iconHeight) => {
      const outputImage = await watermark({
        title,
        source: { url: mainRes.path(), width, height },
        fade: { url: fadeRes.path(), width: fadeWidth, height: fadeHeight },
        icon: { url: iconRes.path(), width: iconWidth, height: iconHeight },
      });

      // To be able to share an image on Android, the file needs to exist outside of the app cache. To move it, we need permission.
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (!granted) {
          const writeResponse = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );

          if (!writeResponse) {
            throw new Error("Could not request permissions");
          } // Oh. well. No share for you :(
        }
      } catch (e) {
        // Unable to get permissions to share.
        finish();
        return;
      }

      try {
        await RNFetchBlob.fs.cp(
          outputImage,
          `${RNFetchBlob.fs.dirs.DownloadDir}/GuideApp.jpg`
        );

        const finalPath = getPlatformURI(
          `${RNFetchBlob.fs.dirs.DownloadDir}/GuideApp.jpg`
        );

        const exist = await RNFetchBlob.fs.exists(finalPath);
        if (exist) {
          console.log("4");
          // Only attempt to share the file if we successfully managed to move it.
          Share.open({ title, message, subject, url: finalPath });
        }
      } catch (e) {
        // Could not share.
      }

      finish();
    });
  });
}

async function shareIOs(title, message, url, width, height, subject, forceUpdate) {
  isCreatingImage = true;
  forceUpdate();
  // First we need to download the main image.
  const mainRes = await fetchService.fetch(url);
  if (mainRes) {
    // Once we have all parts of the overlay, we need to get the size of the files.

    console.log("fadeURI", fadeImageURL);
    // Ios dismisses the share menu when an update is forced, hence why we're just setting the vars here.
    const outputImage = await watermark({
      title,
      source: { url, width, height },
      fade: { url: fadeImageURL, width: fadeImage.width, height: fadeImage.height },
      icon: { url: shareImageURL, width: shareImage.width, height: shareImage.height },
    });

    iosShare = {
      message,
      subject,
      title,
      url: outputImage,
    };

    isCreatingImage = false;
    forceUpdate();
  }
}


// Constructing the sharing image by layering the various elements on top one after another.
async function watermark(watermarkProperties) {
  const {
    title,
    source: { url: sourceURI, width: sourceWidth, height: sourceHeight },
    fade: { url: fadeURI, height: fadeHeight },
    icon: { url: iconURI, width: iconWidth, height: iconHeight },
  } = watermarkProperties;

  console.log("source url", sourceURI, "fade url", fadeURI)

  // Add the fade overlay
  const resultA = await ImageMarker.markImage({
    src: sourceURI,
    markerSrc: fadeURI,
    X: 0,
    Y: parseInt(sourceHeight) - fadeHeight,
    ...SharedImageProperties,
  });

  console.log("resulta", getPlatformURI(resultA), title, margin,
    parseInt(sourceHeight) - fontSize * 2 - margin - lineDistance,
    { ...TextStyles.defaultBoldFont,
      ...SharedTextProperties,
      ...SharedImageProperties,}
  )

  // Add the title for the image
  const resultB = await ImageMarker.markText({
    src: getPlatformURI(resultA),
    text: title,
    X: margin,
    Y: parseInt(sourceHeight) - fontSize * 2 - margin - lineDistance,
    ...TextStyles.defaultBoldFont,
    ...SharedTextProperties,
    ...SharedImageProperties,
  });

  console.log("resultb", resultB)



  // Add the subtitle (currently the App name)
  const resultC = await ImageMarker.markText({
    src: resultB,
    text: LangService.strings.SHARING_OVERLAY_TITLE,
    X: margin,
    Y: parseInt(sourceHeight) - fontSize - margin,
    ...TextStyles.defaultFont,
    ...SharedTextProperties,
    ...SharedImageProperties,
  });

  console.log("resultc", resultB)

  // Add the icon
  return await ImageMarker.markImage({
    src: resultC,
    markerSrc: iconURI,
    X: parseInt(sourceWidth) - iconWidth * iconScale - margin,
    Y: parseInt(sourceHeight) - iconHeight * iconScale - margin,
    ...SharedImageProperties,
    markerScale: iconScale,
  });
}

function modalClosed() {
  if (Platform.OS === "ios") {
    Share.open(iosShare);
  }
}

function loadOverlay() {
  return (
    <View style={styles.imageHolder}>
      <Image source={Background} style={styles.image} />
      <ActivityIndicator
        animating
        color={Colors.themeExtra4}
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
}

const ShowShareButton = (props) => {
  const { title, image, sender, shareType } = props;
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  origin = sender;
  let imageUrl = image.large;
  let imageWidth = 0;
  let imageHeight = 0;

  Image.getSize(imageUrl, (width, height) => {
    imageWidth = width;
    imageHeight = height;
  });
  // If the main image is wider than 1900, we need to use a smaller one. The largest one generated by Wordpress is unfortunately only 1000 wide, but it's better than potentially crashing the app.
  if (imageWidth > 1900) {
    imageUrl = image.medium;
    Image.getSize(imageUrl, (width, height) => {
      imageWidth = width;
      imageHeight = height;
    });
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          beginShare(
            title,
            "",
            imageUrl,
            imageWidth,
            imageHeight,
            title,
            shareType,
            forceUpdate
          );
        }}
      >
        <View style={styles.shareBoxOuter}>
          <Image style={styles.shareIcon} source={shareIcon} />
          <Text style={styles.shareText}>{LangService.strings.SHARE}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={isCreatingImage}
        animationType="fade"
        transparent
        onDismiss={modalClosed}
        onRequestClose={modalClosed}
      >
        <View>{loadOverlay()}</View>
      </Modal>
    </View>
  );
}

export default ShowShareButton;

