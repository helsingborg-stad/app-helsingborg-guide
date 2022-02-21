// @flow

import React, { Component, useEffect } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import GuideView from "@shared-components/GuideView";
import { AnalyticsUtils } from "@utils";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import SearchButton from "@src/components/header/SearchButton";
import {
  selectCurrentContentObject,
  showBottomBar,
} from "@actions/uiStateActions";
import { releaseAudioFile } from "@actions/audioActions";
import { trackScreen } from "@utils/MatomoUtils";


declare type Props = {
  currentGuide: ?Guide,
  navigation: any,
  contentObjects: [],
  dispatchSelectContentObject(contentObject: ContentObject): void,
  dispatchReleaseAudio(): void,
  dispatchShowBottomBar(visible: boolean): void,
};

const GuideScreen = (props) => {

  const { currentGuide, navigation } = props;
  const { contentObjects } = currentGuide;
  const { params } = navigation.state;
  const { redirect } = params;

    useEffect(() => {
      const title = currentGuide ? currentGuide.name : null;
      props.navigation.setParams({ title });

      return () => {
        props.dispatchReleaseAudio();
        if (params && params.bottomBarOnUnmount) {
          props.dispatchShowBottomBar(true);
        }
      }
    },[])


  useEffect(() => {
    if (redirect) {
      let index = -1;
      let object = contentObjects.find((contentObj, i) =>  {
          if(contentObj.id === redirect) {
            index = i;
          }
        return contentObj.id === redirect
      })
      if (object && index !== -1) {
        onPressContentObject(object, index, contentObjects)
      }
    }
  },[redirect])



    const onPressContentObject = (obj: ContentObject, index, array) => {
      const prevPath = navigation.state.params.path
      const newPath = `${prevPath}/${obj?.title}`
      console.log("CONTENT OBJECT", obj?.id)
      props.dispatchSelectContentObject(obj);
      trackScreen(newPath, newPath)
        navigation.navigate("ObjectScreen", {
        title: obj.title,
        currentGuide: props.currentGuide,
        selectObject: props.dispatchSelectContentObject,
        array: array,
        order: obj?.order,
        swipeable: true,
        path: newPath
      });
  };

    return currentGuide ? (
      <GuideView
        guide={currentGuide}
        onPressContentObject={onPressContentObject}
      />
    ) : (
      <View />
    );
}

function mapStateToProps(state: RootState) {
  const { currentGuide } = state.uiState;
  return { currentGuide };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    dispatchSelectContentObject: (contentObject: ContentObject) =>
      dispatch(selectCurrentContentObject(contentObject)),
    dispatchReleaseAudio: () => dispatch(releaseAudioFile()),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible)),
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
