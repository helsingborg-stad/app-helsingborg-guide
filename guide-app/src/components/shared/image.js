import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ActivityIndicator,
  Platform,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import fetchService from "@services/FetchService";
import Colors from "@assets/styles/Colors";

const placeholderImage = require("@assets/images/no-image-featured-image.png");

type Props = {
  internet: any,
  source: any,
  guideID: any,
  spinner: any,
  style: any,
  resizeMethod: any,
  resizeMode: any,
  children: Array,
};

const OImage = (props: Props) => {
  const { guideID, spinner, style, resizeMethod, resizeMode, children } = props;
  const [source, setSource] = useState(props.source || null);
  const [loading, setLoading] = useState(false);
  const [previousInternet, setPreviousInternet] = useState(null);
  const internet = useSelector((s) => s.internet);

  const updateSource = async () => {
    if (internet.connected !== previousInternet?.connected) {
      setPreviousInternet(internet);
      if (internet.connected) {
        return { internet, source };
      } else {
        // Only load the offline image if no internet.
        if (source && source.uri && typeof source.uri === "string") {
          const path = source.uri;
          const fullPath = fetchService.getFullPath(path, guideID);
          try {
            const exist = await fetchService.isExist(path, guideID);
            return exist
              ? setSource({ uri: `file://${fullPath}` })
              : setSource({ uri: path });
          } catch (error) {
            console.warn("error in OImage:isExist", error);
          }
        } else {
          setSource(placeholderImage);
        }
      }
    }
  };

  useEffect(() => {
    updateSource().then(() => null);
  }, [internet, source]);

  const onLoadStart = () => {
    setLoading(true);
  };
  const onLoadEnd = () => {
    setLoading(false);
  };

  const displaySpinner = (width, height) => {
    let hasSpinner = true;
    if (typeof spinner === "boolean") {
      hasSpinner = spinner;
    }
    if (loading && hasSpinner) {
      const indicatorStyle = {
        position: "absolute",
        left: width / 2 - 10,
        top: height / 2 - 10,
      };

      return (
        <View style={{ width, height, backgroundColor: Colors.offWhite4 }}>
          <ActivityIndicator style={indicatorStyle} />
        </View>
      );
    }
    return null;
  };

  const loadFile = (fullPath) => {
    if (Platform.OS === "ios") {
      fetchService.readFile(fullPath).then((data) => {
        setSource({ uri: `data:image/png;base64,${data}` });
      });
    } else if (Platform.OS === "android") {
      setSource({ uri: `file://${fullPath}` });
    }
  };

  const displayImage = () => {
    let width = 0;
    let height = 0;

    // TODO: Make all the images follow the same style structure.
    // TODO: Merge this script with image_view.js.
    // TODO: Update Slynga thumbnails to be loaded through this script.

    if (style[0]) {
      height = style[0].height;
      width = style[0].width;
    } else {
      width = style.width;
      height = style.height;
    }

    return (
      <ImageBackground
        style={style}
        source={source}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        resizeMethod={resizeMethod}
        resizeMode={resizeMode}
      >
        {displaySpinner(width, height)}
        {children}
      </ImageBackground>
    );
  };

  return displayImage();
};

export default OImage;
