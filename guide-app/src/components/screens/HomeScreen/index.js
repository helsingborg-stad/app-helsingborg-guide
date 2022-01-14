// @flow
import React, { Component } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  StatusBar,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from "react-redux";
import LangService from "@services/langService";
import { Colors, HeaderStyles } from "@assets/styles";
import styles from "./styles";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentCategory,
  selectCurrentHomeTab,
  showBottomBar,
} from "@actions/uiStateActions";
import NavigationListItem from "@shared-components/NavigationListItem";
import { compareDistance } from "@utils/SortingUtils";
import { AnalyticsUtils } from "@utils";
import SegmentControlPill from "@shared-components/SegmentControlPill";
import mapIcon from "@assets/images/mapIcon.png";
import { API_BASE_URL } from "@data/endpoints";
type Section = {
  title: string,
  data: NavigationItem[],
  category: NavigationCategory,
  hideFooter?: boolean,
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
  dispatchShowBottomBar(visible: boolean): void,
};

class HomeScreen extends Component<Props> {
  static navigationOptions = () => {
    const title = LangService.strings.APP_NAME;
    return {
      ...HeaderStyles?.noElevation,
      title,
    };
  };

  componentDidMount() {
    this.props.dispatchShowBottomBar(true);
  }

  onPressItem = (item: NavigationItem, items, index): void => {
    console.log("testing lol", item?.type, "items", items);
    switch (item?.type) {
      case "guide": {
        const { guide } = item;
        if (guide) {
          this.props.selectGuide(guide.id);
          const type = guide?.guideType;
          console.log("testing type lol", type);
          if (type === "guide") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props?.navigation.navigate("GuideDetailsScreen", {
              title: guide.name,
              bottomBarOnUnmount: true,
              array: items,
            });
            this.props.dispatchShowBottomBar(false);
          } else if (type === "trail") {
            AnalyticsUtils.logEvent("view_guide", { name: guide.slug });
            this.props?.navigation.navigate("TrailScreen", {
              title: guide.name,
              bottomBarOnUnmount: true,
              // array: items,
              // index: index,
            });
            this.props?.dispatchShowBottomBar(false);
          }
        }
        break;
      }
      case "guidegroup":
        this?.props?.selectGuideGroup(item.id);
        if (item.guideGroup) {
          const title = item?.guideGroup?.name;
          AnalyticsUtils.logEvent("view_location", {
            name: item?.guideGroup?.slug,
          });
          this.props.navigation.navigate("LocationScreen", {
            title,
            bottomBarOnUnmount: true,
            array: items,
          });
          this?.props?.dispatchShowBottomBar(false);
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
      selectCurrentTab,
      showLoadingSpinner,
    } = this.props;

    if (showLoadingSpinner) {
      return <ActivityIndicator style={styles.loadingSpinner} />;
    }

    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <SafeAreaView edges={['right', 'top', 'left']} style={styles.homeContainer}>
          <View style={styles.topBarNavigation}>
            <SegmentControlPill
              initialSelectedIndex={currentHomeTab}
              onSegmentIndexChange={selectCurrentTab}
              labels={navigationCategoryLabels}
            />
          </View>

        {!items || (items && items.length === 0) ? (
          <View style={styles.sectionNoContent}>
            <Text style={styles.sectionNoContentText}>
              {LangService.strings.CONTENT_MISSING}
              URL: {API_BASE_URL}
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              key={currentHomeTab}
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
            >
              {items.map((item, index) => (
                <NavigationListItem
                  key={index}
                  index={index}
                  item={item}
                  onPressItem={() => this.onPressItem(item, items, index)}
                />
              ))}
            </ScrollView>
            {/*<FlatList*/}
            {/*  key={currentHomeTab}*/}
            {/*  style={styles.container}*/}
            {/*  contentContainerStyle={styles.contentContainer}*/}
            {/*  renderItem={({ item, index }) => {*/}
            {/*    return (*/}
            {/*      <NavigationListItem*/}
            {/*        index={index}*/}
            {/*        item={item}*/}
            {/*        onPressItem={this.onPressItem}*/}
            {/*      />*/}
            {/*    );*/}
            {/*  }}*/}
            {/*  keyExtractor={item => item?.id.toString()}*/}
            {/*  data={items}*/}
            {/*/>*/}
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => navigation.navigate("CategoryMapScreen")}
            >
              <Image style={styles.mapIcon} source={mapIcon} />
            </TouchableOpacity>
          </>
        )}
        </SafeAreaView>
      </>
    );
  }
}

function mapStateToProps(state: RootState) {
  const {
    navigation,
    guideGroups,
    uiState: { currentHomeTab },
  } = state;
  const { navigationCategories } = navigation;
  const { fetchingIds } = guideGroups;

  const categories = navigationCategories.map(cat => {
    const data = cat.items
      .filter(item => item.guide || item.guideGroup)
      .sort(compareDistance);
    if (data.length > 0) {
      return {
        title: cat.name,
        data,
        category: cat,
      };
    }
  });

  const isFetching = fetchingIds.length > 0;

  const items =
    !isFetching && categories.length > 0
      ? categories[currentHomeTab]?.data
      : null;

  const navigationCategoryLabels = navigationCategories.map(({ name }) => name);

  return {
    categories,
    currentHomeTab,
    items,
    showLoadingSpinner: isFetching,
    navigationSections: navigationCategories,
    navigationCategoryLabels,
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
      dispatch(showBottomBar(visible)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
