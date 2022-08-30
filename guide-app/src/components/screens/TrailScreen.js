// @flow

import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import InfoOverlayToggleView from "@shared-components/InfoOverlayToggleView";
import TrailView from "@shared-components/TrailView";
import { releaseAudioFile } from "@actions/audioActions";
import { showBottomBar } from "@actions/uiStateActions";
import { Colors } from "@assets/styles";

type Props = {
  navigation: Object,
  route: Object,
};

const TrailScreen = (props: Props) => {
  const { navigation, route } = props;
  const { currentGuide } = useSelector((s) => s.uiState);
  const { path, redirect } = route?.params || {};
  const dispatch = useDispatch();
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  useEffect(() => {
    if (navigation.isFocused()) {
      navigation.setOptions({
        headerRight: () => (
          <InfoOverlayToggleView onToggleInfoOverlay={onToggleInfoOverlay} />
        ),});
    }
  }, [navigation.isFocused()]);

  useEffect(() => {
    return () => {
      dispatch(releaseAudioFile());
      if (route?.params && route.params?.bottomBarOnUnmount) {
        dispatch(showBottomBar(true));
      }
    };
  }, []);

  const onToggleInfoOverlay = () => {
    setShowInfoOverlay(!showInfoOverlay);
  };

  if (currentGuide.contentObjects.length <= 0) {
    return null;
  }

  const mapItems: MapItem[] = currentGuide.contentObjects.map((item) => ({
    contentObject: item,
  }));

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.white} />
      <TrailView
        trail={currentGuide}
        items={mapItems}
        path={path}
        showInfoOverlay={showInfoOverlay}
        onToggleInfoOverlay={onToggleInfoOverlay}
        navigation={navigation}
        route={route}
        redirect={redirect}
      />
    </>
  );
};

export default TrailScreen;
