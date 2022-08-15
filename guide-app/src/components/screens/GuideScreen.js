// @flow

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { connect } from "react-redux";
import GuideView from "@shared-components/GuideView";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import {
  selectCurrentContentObject,
  showBottomBar,
  selectCurrentSharingLink
} from "@actions/uiStateActions";
import { releaseAudioFile } from "@actions/audioActions";
import { trackScreen } from "@utils/MatomoUtils";
import useDeepLinking from "@hooks/useDeepLinking";


declare type Props = {
  currentGuide: ?Guide,
  navigation: any,
  route: any,
  contentObjects: [],
  dispatchSelectContentObject(contentObject: ContentObject): void,
  dispatchReleaseAudio(): void,
  dispatchShowBottomBar(visible: boolean): void,
  dispatchCurrentSharingLink(link: string): void,
};

const GuideScreen = (props: Props) => {

  const { currentGuide, navigation, route, currentSharingLink, dispatchCurrentSharingLink } = props;
  const { contentObjects } = currentGuide;
  const { params } = route;
  const { clearLinking } = useDeepLinking();
  const [redirect, setRedirect] = useState(params?.redirect?.length ? params?.redirect?.length === 2 ? params?.redirect[1] : params?.redirect[0] : false);


  useEffect(() => {
    return () => {
      redirect && setRedirect(false);
      props.dispatchReleaseAudio();
      if (params && params.bottomBarOnUnmount) {
        props.dispatchShowBottomBar(true);
      }
    };
  }, []);

  useEffect(() => {
    if (params) {
      const { path } = params || {};
      const title = currentGuide ? currentGuide.name : null;
      navigation.setOptions({
        title,
        headerRight: () => <View style={{ width: 36 }} />,
        headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />
      });
    }
  }, [params]);

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
    dispatchCurrentSharingLink(sharingLink);
    props.dispatchSelectContentObject(obj);
    trackScreen(newPath, newPath);
    redirect && setRedirect(false);
    console.log("the object", obj.links);
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
    ) : <ActivityIndicator style={{ flex: 1 }} />;
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
    dispatchCurrentSharingLink: (link: string) => dispatch(selectCurrentSharingLink(link))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GuideScreen);
