// @flow

import React, { memo, Component, useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { connect } from "react-redux";

import InfoOverlayToggleView from "@shared-components/InfoOverlayToggleView";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import TrailView from "@shared-components/TrailView";
import { releaseAudioFile } from "@actions/audioActions";
import {
  selectCurrentContentObject,
  selectCurrentGuideGroup,
  selectCurrentGuide,
  showBottomBar,
} from "@actions/uiStateActions";
import { Colors } from "@assets/styles";


type Props = {
  currentGuide: Guide,
  navigation: Object,
  dispatchReleaseAudio(): void,
  dispatchShowBottomBar(visible: boolean): void
};


const TrailScreen = (props: Props) => {
  const { navigation, dispatchReleaseAudio, dispatchShowBottomBar, currentGuide } = props;
  const { path, redirect } = navigation?.state?.params;
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  useEffect(() => {
    if (navigation.isFocused()) {
      navigation.setParams({
        toggleInfoOverlay: toggleInfoOverlay,
      })
    }
  }, [navigation.isFocused()]);

  useEffect(() => {
    return () => {
      dispatchReleaseAudio();
      if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
        dispatchShowBottomBar(true);
      }
    };
  }, []);


  const toggleInfoOverlay = () => {
    setShowInfoOverlay(!showInfoOverlay);
  };


  if (currentGuide.contentObjects.length <= 0) {
    return null;
  }

  const mapItems: MapItem[] = currentGuide.contentObjects.map(item => ({
    contentObject: item,
  }));

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.themeSecondary}
      />
      <TrailView
        trail={currentGuide}
        items={mapItems}
        path={path}
        showInfoOverlay={showInfoOverlay}
        onToggleInfoOverlay={toggleInfoOverlay}
        navigation={navigation}
        redirect={redirect}
      />
    </>
  );
};

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchReleaseAudio: () => dispatch(releaseAudioFile()),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible)),
    dispatchSelectContentObject: contentObject =>
      dispatch(selectCurrentContentObject(contentObject)),
    selectGuideGroup: id => dispatch(selectCurrentGuideGroup(id)),
    selectGuide: guide => dispatch(selectCurrentGuide(guide)),
  };
}

TrailScreen["navigationOptions"] = ({ navigation }) => {
  let title = null;
  let path = null;
  let toggleInfoOverlay = () => {
  };
  const { params = {} } = navigation.state;
  if (params) {
    ({ title } = params);
    ({ path } = params);
    ({ toggleInfoOverlay } = params);
  }

  return {
    title,
    headerRight: () => (
      <InfoOverlayToggleView onToggleInfoOverlay={toggleInfoOverlay} />),
    headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrailScreen);
