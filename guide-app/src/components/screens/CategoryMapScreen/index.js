// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { StatusBar, View } from "react-native";
import HeaderBackButton from "@shared-components/HeaderBackButton";
import MarkerListView from "@shared-components/MarkerListView";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentCategory,
  showBottomBar
} from "@actions/uiStateActions";

import { AnalyticsUtils } from "@utils";
import { Colors, HeaderStyles } from "@assets/styles";

type Props = {
  navigation: any,
  currentCategory: ?NavigationCategory,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  dispatchShowBottomBar(visible: boolean): void
};

class CategoryMapScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    let title = null;
    const { params } = navigation.state;
    if (params) {
      ({ title } = params);
    }
    return {
      ...HeaderStyles.noElevation,
      title,
      headerRight: () => <View />,
      headerLeft: () => <HeaderBackButton navigation={navigation} />
    };
  };

  constructor(props: Props) {
    super(props);

    const { currentCategory } = props;
    if (currentCategory) {
      const { name: title } = currentCategory;
      props.navigation.setParams({ title });
    }
  }

  componentDidMount() {
    this.props.dispatchShowBottomBar(false);
  }

  componentWillUnmount() {
    this.props.dispatchShowBottomBar(true);
  }

  onPressItem = (item: NavigationItem): void => {
    switch (item.type) {
      case "guide": {
        this.props.selectGuide(item.id);
        const { guide } = item;
        if (guide) {
          const { guideType } = guide;
          if (guideType === "guide") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("GuideDetailsScreen", {
              title: guide.name
            });
          } else if (guideType === "trail") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("TrailScreen", {
              title: guide.name
            });
          }
        }
        break;
      }
      case "guidegroup":
        this.props.selectGuideGroup(item.id);
        if (item.guideGroup) {
          const title = item.guideGroup.name;
          AnalyticsUtils.logEvent("view_location", {
            name: item.guideGroup.slug
          });
          this.props.navigation.navigate("LocationScreen", { title });
        }
        break;
      default:
    }
  };

  render() {
    const { currentCategory, navigation } = this.props;
    if (!currentCategory) {
      return null;
    }

    const { items } = currentCategory;

    const mapItems: MapItem[] = [];
    items.forEach(navItem => {
      const { guide, guideGroup } = navItem;
      if (guideGroup) {
        mapItems.push({ guideGroup: navItem.guideGroup });
      }
      if (guide) {
        mapItems.push({ guide });
      }
    });

    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.themeSecondary}
        />
        <MarkerListView
          items={mapItems}
          navigation={navigation}
          showListButton={false}
        />
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  const { uiState, navigation } = state;
  const { currentHomeTab: categoryIndex } = uiState;
  const category = navigation.navigationCategories[categoryIndex];

  return {
    currentCategory: category
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (category: NavigationCategory) =>
      dispatch(selectCurrentCategory(category.id)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryMapScreen);
