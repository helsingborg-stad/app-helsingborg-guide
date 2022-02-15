// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StatusBar } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import LocationView from "@shared-components/LocationView";
import { Colors, HeaderStyles } from "@assets/styles";
import { selectCurrentGuide, showBottomBar } from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";


type Props = {
  currentGuideGroup: GuideGroup,
  currentGuides: Guide[],
  currentInteractiveGuide?: InteractiveGuide,
  geolocation: GeolocationType,
  navigation: Object,
  isFetchingGuides: boolean,
  selectCurrentGuide(guide: Guide): void,
  dispatchShowBottomBar(visible: boolean): void,
};

class LocationScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const { title, path } = navigation.state.params;
    return {
      ...HeaderStyles.noElevation,
      title,
      headerRight: () => <View />,
      headerLeft: () => <HeaderBackButton navigation={navigation} path={path} />,
    };
  };

  componentWillUnmount() {
    const { navigation } = this.props;
    if (navigation.state.params && navigation.state.params.bottomBarOnUnmount) {
      this.props.dispatchShowBottomBar(true);
    }
  }

  onPressGuide = (guide: Guide) => {
    const { navigation } = this.props;
    const slug = guide?.slug;
    const title = guide?.name;
    const prevPath = navigation.state.params.path
    const newPath = `${prevPath}/${slug || title}`
    trackScreen(newPath, newPath)
    // AnalyticsUtils.logEvent("view_guide", { name: slug });
    if (guide.guideType === "trail") {
      this.props.selectCurrentGuide(guide);
      navigation.navigate("TrailScreen", {
        guide,
        title: title,
        path: newPath
      });
    } else if (guide.guideType === "guide") {
      this.props.selectCurrentGuide(guide);
      navigation.navigate("GuideDetailsScreen", {
        title: guide.name,
        path: newPath
      });
    }
  };

  onPressInteractiveGuide = (interactiveGuide: InteractiveGuide) => {
    const { navigation } = this.props;
    trackScreen("view_interactive_guide", interactiveGuide?.title || "")
    navigation.navigate("QuizScreen", {
      quiz: interactiveGuide,
    });
  };

  render() {
    const {
      currentGuideGroup,
      currentGuides,
      currentInteractiveGuide,
      geolocation,
      isFetchingGuides,
    } = this.props;
    const now = new Date();
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <LocationView
          guideGroup={currentGuideGroup}
          guides={currentGuides}
          interactiveGuide={currentInteractiveGuide}
          now={now}
          geolocation={geolocation}
          navigation={this.props.navigation}
          onPressGuide={this.onPressGuide}
          onPressInteractiveGuide={this.onPressInteractiveGuide}
          isFetchingGuides={isFetchingGuides}
        />
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { groupItems: guideItems, isFetching: isFetchingGuides } = state.guides;
  const {
    items: interactiveGuideItems,
    isFetching: isFetchingInteractiveGuides,
  } = state.interactiveGuides;
  const { currentGuideGroup } = state.uiState;
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
    currentInteractiveGuide,
    geolocation: geolocation?.position,
    isFetchingGuides: isFetchingGuides || isFetchingInteractiveGuides,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectCurrentGuide: (guide: Guide) => dispatch(selectCurrentGuide(guide)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationScreen);
