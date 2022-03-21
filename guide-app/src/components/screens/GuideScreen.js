// @flow

import React, { Component, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { connect } from "react-redux";

import GuideView from "@shared-components/GuideView";
import { AnalyticsUtils } from "@utils";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import SearchButton from "@src/components/header/SearchButton";
import {
  selectCurrentContentObject,
  showBottomBar,
  selectCurrentSharingLink,
} from "@actions/uiStateActions";
import { releaseAudioFile } from "@actions/audioActions";
import { trackScreen } from "@utils/MatomoUtils";
import useDeepLinking from "@hooks/useDeepLinking";


declare type Props = {
  currentGuide: ?Guide,
  navigation: any,
  contentObjects: [],
  dispatchSelectContentObject(contentObject: ContentObject): void,
  dispatchReleaseAudio(): void,
  dispatchShowBottomBar(visible: boolean): void,
  dispatchCurrentSharingLink(link: string): void,
};

const GuideScreen = (props) => {

  const { currentGuide, navigation, currentSharingLink, dispatchCurrentSharingLink } = props;
  const { contentObjects } = currentGuide;
  const { params } = navigation.state;
  const { clearLinking } = useDeepLinking()
  const [redirect, setRedirect] = useState( params?.redirect?.length ? params?.redirect?.length === 2 ? params?.redirect[1] : params?.redirect[0] : false)


  useEffect(() => {
    const title = currentGuide ? currentGuide.name : null;
    props.navigation.setParams({ title });
    return () => {
      redirect && setRedirect(false)
      props.dispatchReleaseAudio();
      if (params && params.bottomBarOnUnmount) {
        props.dispatchShowBottomBar(true);
      }
    };
  }, []);

  useEffect(() => {
    if(!navigation.isFocused()) {
      clearLinking(navigation);
    }
  },[navigation.isFocused()])


  useEffect(() => {
    if (redirect) {
      console.log("THE RE", redirect)
      let index = -1;
      let object = contentObjects.find((contentObj, i) => {
        if (contentObj.id === redirect) {
          index = i;
        }
        return contentObj.id === redirect;
      });
      if (object && index !== -1) {
        onPressContentObject(object, index, contentObjects);
      }
      else {
        setRedirect(false)
      }
    }
  }, [redirect]);


  const onPressContentObject = (obj: ContentObject, index, array) => {
    const prevPath = navigation.state.params.path;
    const newPath = `${prevPath}/${obj?.title}`;
    const sharingLink = currentSharingLink + `/${obj?.id}`;
    dispatchCurrentSharingLink(sharingLink)
      props.dispatchSelectContentObject(obj);
    trackScreen(newPath, newPath);
    redirect && setRedirect(false)
    navigation.navigate("ObjectScreen", {
      title: obj.title,
      currentGuide: props.currentGuide,
      selectObject: props.dispatchSelectContentObject,
      array: array,
      order: obj?.order,
      swipeable: true,
      path: newPath,
    });
  };

  return !(!!redirect) ?
    currentGuide ? (
      <GuideView
        guide={currentGuide}
        onPressContentObject={onPressContentObject}
      />
    ) : (
      <View />
    ) : <ActivityIndicator style={{flex: 1}} />;
};

function mapStateToProps(state: RootState) {
  const { currentGuide, currentSharingLink } = state.uiState;
  return { currentGuide, currentSharingLink };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchSelectContentObject: (contentObject: ContentObject) =>
      dispatch(selectCurrentContentObject(contentObject)),
    dispatchReleaseAudio: () => dispatch(releaseAudioFile()),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible)),
    dispatchCurrentSharingLink: (link: string) => dispatch(selectCurrentSharingLink(link)),
  };
}


GuideScreen["navigationOptions"] = ({ navigation }) => {
  const { params } = navigation.state;
  if (params) {
    const { title, path } = params;
    return {
      title,
      headerRight: () => <SearchButton navigation={navigation} path={path} />,
      headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />,
    };
  }
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GuideScreen);
