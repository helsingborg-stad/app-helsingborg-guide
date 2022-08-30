// @flow

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import GuideView from "@shared-components/GuideView";
import {
  selectCurrentContentObject,
  showBottomBar,
  selectCurrentSharingLink,
} from "@actions/uiStateActions";
import { releaseAudioFile } from "@actions/audioActions";
import { trackScreen } from "@utils/MatomoUtils";
import useDeepLinking from "@hooks/useDeepLinking";

declare type Props = {
  navigation: any,
  route: any,
};

const GuideScreen = (props: Props) => {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const { currentGuide, currentSharingLink } = useSelector((s) => s.uiState);
  const { contentObjects } = currentGuide;
  const { params } = route;
  const { clearLinking } = useDeepLinking();

  const [redirect, setRedirect] = useState(
    params?.redirect?.length
      ? params?.redirect?.length === 2
        ? params?.redirect[1]
        : params?.redirect[0]
      : false
  );

  useEffect(() => {
    return () => {
      redirect && setRedirect(false);
      dispatch(releaseAudioFile());
      if (params && params.bottomBarOnUnmount) {
        dispatch(showBottomBar(true));
      }
    };
  }, []);

  useEffect(() => {
    if (!navigation.isFocused()) {
      clearLinking(navigation);
    }
  }, [navigation.isFocused()]);

  useEffect(() => {
    if (redirect) {
      let index = -1;
      let object = contentObjects.find((contentObj, i) => {
        if (contentObj.id === redirect) {
          index = i;
        }
        return contentObj.id === redirect;
      });
      if (object && index !== -1) {
        onPressContentObject(object, index, contentObjects);
      } else {
        setRedirect(false);
        console.log("not found guide");
        navigation.navigate("NotFoundScreen");
      }
    }
  }, [redirect]);

  const onPressContentObject = (obj: ContentObject, index, array) => {
    const prevPath = params.path;
    const newPath = `${prevPath}/${obj?.title}`;
    const sharingLink = currentSharingLink + `/${obj?.id}`;
    dispatch(selectCurrentSharingLink(sharingLink));
    dispatch(selectCurrentContentObject(obj));
    trackScreen(newPath, newPath);
    redirect && setRedirect(false);
    navigation.navigate("ObjectScreen", {
      title: obj.title,
      currentGuide: props.currentGuide,
      selectObject: (object) => dispatch(selectCurrentContentObject(object)),
      array: array,
      order: obj?.order,
      swipeable: true,
      path: newPath,
    });
  };

  return !redirect ? (
    currentGuide ? (
      <GuideView
        guide={currentGuide}
        onPressContentObject={onPressContentObject}
      />
    ) : (
      <View />
    )
  ) : (
    <ActivityIndicator style={{ flex: 1 }} />
  );
};

export default GuideScreen;
