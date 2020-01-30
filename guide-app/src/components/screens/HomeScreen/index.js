// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import LangService from "@services/langService";
import { HeaderStyles } from "@assets/styles";
import styles from "./styles";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentCategory,
  selectCurrentHomeTab,
  showBottomBar
} from "@actions/uiStateActions";
import NavigationListItem from "@shared-components/NavigationListItem";
import { compareDistance } from "@utils/SortingUtils";
import { AnalyticsUtils } from "@utils";
import SegmentControlPill from "@shared-components/SegmentControlPill";
import mapIcon from "@assets/images/mapIcon.png";

type Section = {
  title: string,
  data: NavigationItem[],
  category: NavigationCategory,
  hideFooter?: boolean
};

type Props = {
  navigation: any,
  currentHomeTab: number,
  showLoadingSpinner: boolean,
  items: NavigationItem[],
  navigationCategoryLabels: string[],
  sections: Section[],
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  selectCurrentCategory(section: NavigationCategory): void,
  selectCurrentTab(tabIndex: number): void,
  dispatchShowBottomBar(visible: boolean): void
};

class HomeScreen extends Component<Props> {
  static navigationOptions = () => {
    const title = LangService.strings.APP_NAME;
    return {
      ...HeaderStyles.noElevation,
      title
    };
  };

  componentDidMount() {
    this.props.dispatchShowBottomBar(true);
  }

  onPressItem = (item: NavigationItem): void => {
    switch (item.type) {
      case "guide": {
        const { guide } = item;
        if (guide) {
          this.props.selectGuide(guide.id);
          const type = guide.guideType;
          if (type === "guide") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("GuideDetailsScreen", {
              title: guide.name,
              bottomBarOnUnmount: true
            });
            this.props.dispatchShowBottomBar(false);
          } else if (type === "trail") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props.navigation.navigate("TrailScreen", {
              title: guide.name,
              bottomBarOnUnmount: true
            });
            this.props.dispatchShowBottomBar(false);
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
          this.props.navigation.navigate("LocationScreen", {
            title,
            bottomBarOnUnmount: true
          });
          this.props.dispatchShowBottomBar(false);
        }
        break;
      default:
        break;
    }
  };

  render() {
    const {
      currentHomeTab,
      items,
      navigation,
      navigationCategoryLabels,
      selectCurrentTab
    } = this.props;

    if (this.props.showLoadingSpinner) {
      return <ActivityIndicator style={styles.loadingSpinner} />;
    }

    return (
      <>
        <SafeAreaView>
          <View style={styles.topBarNavigation}>
            <SegmentControlPill
              initialSelectedIndex={currentHomeTab}
              onSegmentIndexChange={selectCurrentTab}
              labels={navigationCategoryLabels}
            />
          </View>
        </SafeAreaView>

        <FlatList
          key={currentHomeTab}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item, index }) => {
            return (
              <NavigationListItem
                index={index}
                item={item}
                onPressItem={this.onPressItem}
              />
            );
          }}
          keyExtractor={item => item.id.toString()}
          data={items}
        />
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate("CategoryMapScreen")}
        >
          <Image style={styles.mapIcon} source={mapIcon} />
        </TouchableOpacity>
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  const {
    navigation,
    guides,
    guideGroups,
    uiState: { currentHomeTab }
  } = state;
  const { isFetching, navigationCategories } = navigation;

  const noContent = guides.items.length === 0 || guideGroups.items.length === 0;

  const categories = navigationCategories.map(cat => {
    const data = cat.items
      .filter(item => item.guide || item.guideGroup)
      .sort(compareDistance);
    if (data.length > 0) {
      return {
        title: cat.name,
        data,
        category: cat
      };
    } else if (noContent) {
      return {
        title: cat.name,
        data,
        category: cat,
        showSpinner: true,
        hideFooter: true
      };
    }
  });

  const items = !isFetching ? categories[currentHomeTab]?.data : null;
  const navigationCategoryLabels = navigationCategories.map(({ name }) => name);

  return {
    categories,
    currentHomeTab,
    items,
    showLoadingSpinner: isFetching,
    navigationSections: navigationCategories,
    navigationCategoryLabels
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (category: NavigationCategory) =>
      dispatch(selectCurrentCategory(category.id)),
    selectCurrentTab: (tabIndex: number) =>
      dispatch(selectCurrentHomeTab(tabIndex)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
