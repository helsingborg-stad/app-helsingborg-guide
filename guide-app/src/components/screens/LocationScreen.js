// @flow

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ActivityIndicator, View, StatusBar } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import LocationView from "@shared-components/LocationView";
import { Colors, HeaderStyles } from "@assets/styles";
import { selectCurrentGuide, showBottomBar, selectCurrentSharingLink } from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";
import useDeepLinking from "@hooks/useDeepLinking";

type Props = {
  currentGuideGroup: GuideGroup,
  currentGuides: Guide[],
  currentInteractiveGuide?: InteractiveGuide,
  currentSharingLink: string,
  geolocation: GeolocationType,
  navigation: Object,
  isFetchingGuides: boolean,
  selectCurrentGuide(guide: Guide): void,
  dispatchShowBottomBar(visible: boolean): void,
  dispatchCurrentSharingLink(link: string): void,
};

const LocationScreen = (props: Props) => {
  const {
    currentGuideGroup,
    currentGuides,
    currentInteractiveGuide,
    geolocation,
    isFetchingGuides,
    navigation,
    currentSharingLink,
    dispatchCurrentSharingLink,
  } = props;
  const [redirect, setRedirect] = useState(navigation?.state?.params?.redirect)
  const [redirected, setRedirected] = useState(false)
  const { clearLinking }  = useDeepLinking()

  useEffect(() => {
    return () => {
      if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
        props.dispatchShowBottomBar(true);
        setRedirected(false);
      }
    }
  },[])

  useEffect(() => {
    if(!navigation.isFocused()) {
      clearLinking(navigation);
    }
  },[navigation.isFocused()])


  useEffect(() => {
    if (redirect?.length && redirect[0]) {
      const currentGuide = currentGuides.find(guide => guide.id.toString() === redirect[0].toString());
      if (currentGuide && !redirected) {
        setRedirected(true);
        onPressGuide(currentGuide);
      }
      else {
        clearLinking(navigation, ["redirect"]);
        navigation.navigate("NotFoundScreen", {link: redirect[0]});
      }
    }
  },[redirect, currentGuides])



  const onPressGuide = (guide: Guide) => {
    const slug = guide?.slug;
    const title = guide?.name;
    const prevPath = navigation.state.params.path;
    const newPath = `${prevPath}/${slug || title}`;
    const sharingLink = currentSharingLink + `/${guide?.id}`
    dispatchCurrentSharingLink(sharingLink)
    trackScreen(newPath, newPath);
    redirect && setRedirect(false)
    if (guide.guideType === "trail") {
      props.selectCurrentGuide(guide);
      navigation.navigate("TrailScreen", {
        guide,
        title: title,
        path: newPath,
        ...(redirect?.length === 2 && {redirect: redirect[1]})
      });
    } else if (guide.guideType === "guide") {
      console.log("the guide", guide?.id);
      props.selectCurrentGuide(guide);
      navigation.navigate("GuideDetailsScreen", {
        title: guide.name,
        path: newPath,
        ...(redirect?.length && {redirect: redirect})
      });
    }
  };

  const onPressInteractiveGuide = (interactiveGuide: InteractiveGuide) => {
    const sharingLink = currentSharingLink + `/${interactiveGuide?.id}`
    dispatchCurrentSharingLink(sharingLink)
    trackScreen("view_interactive_guide", interactiveGuide?.title || "");
    navigation.navigate("QuizScreen", {
      quiz: interactiveGuide,
    });
  };

    const now = new Date();

    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        {!redirect?.length ?
          <LocationView
            guideGroup={currentGuideGroup}
            guides={currentGuides}
            interactiveGuide={currentInteractiveGuide}
            now={now}
            geolocation={geolocation}
            navigation={navigation}
            onPressGuide={onPressGuide}
            onPressInteractiveGuide={onPressInteractiveGuide}
            isFetchingGuides={isFetchingGuides}
          />
        : <ActivityIndicator style={{flex: 1}} />}
      </>
    );
};

function mapStateToProps(state: RootState) {
  const { groupItems: guideItems, isFetching: isFetchingGuides } = state.guides;
  const {
    items: interactiveGuideItems,
    isFetching: isFetchingInteractiveGuides,
  } = state.interactiveGuides;
  const { currentGuideGroup, currentSharingLink } = state.uiState;
  const { geolocation } = state;


  let currentGuides = [];
  let currentInteractiveGuide = null;
  if (currentGuideGroup) {
    currentGuides = guideItems.filter(
      guide => guide.guideGroupId === currentGuideGroup.id,
    );
    currentInteractiveGuide = interactiveGuideItems.find(
      interactiveGuide => interactiveGuide.guideGroupId === currentGuideGroup.id,
    );
  }

  return {
    currentGuideGroup,
    currentGuides,
    currentInteractiveGuide,
    currentSharingLink,
    geolocation: geolocation?.position,
    isFetchingGuides: isFetchingGuides || isFetchingInteractiveGuides,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentGuide: (guide: Guide) => dispatch(selectCurrentGuide(guide)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible)),
    dispatchCurrentSharingLink: (link: string) => dispatch(selectCurrentSharingLink(link)),
  };
}


LocationScreen["navigationOptions"] = ({ navigation }) => {
  const { title, path } = navigation.state.params;
  return {
    ...HeaderStyles.noElevation,
    title,
    headerRight: () => <View />,
    headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />,
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationScreen);
