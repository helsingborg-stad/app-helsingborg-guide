// @flow

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ActivityIndicator, StatusBar } from "react-native";
import LocationView from "@shared-components/LocationView";
import { Colors } from "@assets/styles";
import { selectCurrentGuide, showBottomBar, selectCurrentSharingLink } from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";
import useDeepLinking from "@hooks/useDeepLinking";

type Props = {
  currentGuideGroup: GuideGroup,
  currentGuides: Guide[],
  guideItems: [],
  currentInteractiveGuide?: InteractiveGuide,
  currentSharingLink: string,
  geolocation: GeolocationType,
  navigation: Object,
  route: Object,
  isFetchingGuides: boolean,
  selectCurrentGuide(guide: Guide): void,
  dispatchShowBottomBar(visible: boolean): void,
  dispatchCurrentSharingLink(link: string): void,
};

const LocationScreen = (props: Props) => {
  const {
    currentGuideGroup,
    currentGuides,
    guideItems,
    currentInteractiveGuide,
    geolocation,
    isFetchingGuides,
    navigation,
    route,
    currentSharingLink,
    dispatchCurrentSharingLink
  } = props;
  const params = route?.params;
  const [redirect, setRedirect] = useState(params?.redirect);
  const [redirected, setRedirected] = useState(false);
  const { clearLinking } = useDeepLinking();

  useEffect(() => {
    return () => {
      if (params && params?.bottomBarOnUnmount) {
        props.dispatchShowBottomBar(true);
        setRedirected(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!navigation.isFocused()) {
      clearLinking(navigation);
    }
  }, [navigation.isFocused()]);


  useEffect(() => {
    if (redirect?.length && redirect[0] && currentGuides.length) {
      const currentGuide = currentGuides.find(guide => guide.id.toString() === redirect[0].toString());
      if (currentGuide && !redirected) {
        setRedirected(true);
        onPressGuide(currentGuide);
      }

      if (!currentGuide) {
        clearLinking(navigation, ["redirect"]);
        !currentGuide && navigation.navigate("NotFoundScreen", { link: redirect[0] });
      }
    }
  }, [redirect, currentGuides, guideItems]);


  const onPressGuide = (guide: Guide) => {
    const slug = guide?.slug;
    const title = guide?.name;
    const prevPath = route.params.path;
    const newPath = `${prevPath}/${slug || title}`;
    const sharingLink = currentSharingLink + `/${guide?.id}`;
    dispatchCurrentSharingLink(sharingLink);
    trackScreen(newPath, newPath);
    redirect && setRedirect(false);
    if (guide.guideType === "trail") {
      props.selectCurrentGuide(guide);
      navigation.navigate("TrailScreen", {
        guide,
        title: title,
        path: newPath,
        ...(redirect?.length === 2 && { redirect: redirect[1] })
      });
    } else if (guide.guideType === "guide") {
      props.selectCurrentGuide(guide);
      navigation.navigate("GuideDetailsScreen", {
        title: guide.name,
        path: newPath,
        ...(redirect?.length && { redirect: redirect })
      });
    }
  };

  const onPressInteractiveGuide = (interactiveGuide: InteractiveGuide) => {
    const sharingLink = currentSharingLink + `/${interactiveGuide?.id}`;
    dispatchCurrentSharingLink(sharingLink);
    trackScreen("view_interactive_guide", interactiveGuide?.title || "");
    navigation.navigate("QuizScreen", {
      quiz: interactiveGuide
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
        : <ActivityIndicator style={{ flex: 1 }} />}
    </>
  );
};

function mapStateToProps(state: RootState) {
  const { groupItems: guideItems, isFetching: isFetchingGuides } = state.guides;
  const {
    items: interactiveGuideItems,
    isFetching: isFetchingInteractiveGuides
  } = state.interactiveGuides;
  const { currentGuideGroup, currentSharingLink } = state.uiState;
  const { geolocation } = state;


  let currentGuides = [];
  let currentInteractiveGuide = null;
  if (currentGuideGroup) {
    currentGuides = guideItems.filter(
      guide => guide.guideGroupId === currentGuideGroup.id
    );
    currentInteractiveGuide = interactiveGuideItems.find(
      interactiveGuide => interactiveGuide.guideGroupId === currentGuideGroup.id
    );
  }

  return {
    currentGuideGroup,
    currentGuides,
    guideItems,
    currentInteractiveGuide,
    currentSharingLink,
    geolocation: geolocation?.position,
    isFetchingGuides: isFetchingGuides || isFetchingInteractiveGuides
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentGuide: (guide: Guide) => dispatch(selectCurrentGuide(guide)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible)),
    dispatchCurrentSharingLink: (link: string) => dispatch(selectCurrentSharingLink(link))
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationScreen);
