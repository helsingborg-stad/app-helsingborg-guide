/* eslint-disable prettier/prettier */
// @flow
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Text,
  Keyboard,
  Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Orientation from "react-native-orientation-locker";
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
  clearSearchFilter,
  fetchAllGuidesForAllGroups
} from "@actions/uiStateActions";
import { fetchNavigation } from "@actions/navigationActions";

import HomeSettings from "@shared-components/HomeSettings";
import NavigationListItem from "@shared-components/NavigationListItem";
import { compareDistance } from "@utils/SortingUtils";
import LocationUtils from "@utils/LocationUtils";
import SegmentControlPill from "@shared-components/SegmentControlPill";
import Scrollable from "@shared-components/Scrollable";
import mapIcon from "@assets/images/mapIcon.png";
import useDeepLinking from "@hooks/useDeepLinking";
import useGuides from "@hooks/useGuides";
import LocationService from "@services/locationService";
import Map from "@shared-components/Map";

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
  navigationCategories: Array,
  navigationCategoryLabels: string[],
  sections: Section[],
  currentLanguage: string,
  fetchNavigationItems: any,
  guides: any,
  guideGroups: any,

  fetchNavigation(code: string): void,
  fetchGuideGroups(currentLanguage: string, guideGroups: Array): void,
  fetchGuides(currentLanguage: string, guides: Array): void,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  selectCurrentCategory(section: NavigationCategory): void,
  selectCurrentTab(tabIndex: number): void,
  dispatchShowBottomBar(visible: boolean): void,
  clearSearchFilter(): void,
};

const HomeScreen = (props: Props) => {
  const { params } = props.navigation?.state;
  const { linkingHome, clearLinking } = useDeepLinking();
  const { linkToGuide } = useGuides();
  const [segmentLayout, setSegmentLayout] = useState(0);

  const id_1 = params?.id_1;
  const locationService = LocationService.getInstance();
  const {
    currentHomeTab,
    items,
    navigation,
    navigationCategories,
    navigationCategoryLabels,
    selectCurrentTab,
    showLoadingSpinner,
    fetchNavigationItems,
    currentLanguage,
    dispatchShowBottomBar,
    dispatchClearSearchFilter,
    dispatchFetchAllGuidesforAllGroups,
    isFetching,
  } = props;

  const labels = [...navigationCategoryLabels, "map"];

  useEffect(() => {
    dispatchFetchAllGuidesforAllGroups();
  }, []);


  useEffect(() => {
    if (navigation.isFocused() && currentHomeTab !== (labels.length - 1)) {
      dispatchShowBottomBar(true);
    } else {
      clearLinking(navigation);
    }
  }, [navigation.isFocused()]);

  useEffect(() => {
    Orientation.lockToPortrait();
    props.dispatchShowBottomBar(true);
    return () => {
      Keyboard.dismiss();
      props.selectCurrentTab(0);
      dispatchClearSearchFilter();
    };
  }, []);

  useEffect(() => {
    if (id_1 && navigationCategories.length && !isFetching) {
      linkingHome(params, props);
    }
  }, [params, navigationCategories, isFetching]);

  const onPressItem = (item): void => {
    linkToGuide(item);
  };

  useEffect(() => {
    props.dispatchShowBottomBar(currentHomeTab !== (labels.length - 1));
  }, [currentHomeTab]);


  if (showLoadingSpinner || id_1) {
    return <ActivityIndicator style={styles.loadingSpinner} />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <SafeAreaView edges={["right", "top", "left"]} style={[styles.homeContainer]}>
        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <>
            <View
              onLayout={(event) => {
                !segmentLayout && setSegmentLayout(event.nativeEvent.layout?.height);
              }}
              style={styles.topBarNavigation}>
              <SegmentControlPill
                initialSelectedIndex={currentHomeTab}
                onSegmentIndexChange={selectCurrentTab}
                labels={labels}
              />
            </View>
            {currentHomeTab !== (labels.length - 1) ? <>
              {segmentLayout ?
                <HomeSettings segmentLayout={segmentLayout} /> : null}
              {!items || (items && items?.length === 0) ? (
                <View style={styles.sectionNoContent}>
                  <Text style={styles.sectionNoContentText}>
                    {LangService.strings.CONTENT_MISSING}
                  </Text>
                </View>
              ) : (
                <>
                  <Scrollable
                    key={currentHomeTab}
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    refreshControl={true}
                    refreshAction={() => {
                      locationService.getGeoLocation().catch(console.warn);
                      props.selectCurrentTab(0);
                      fetchNavigationItems(currentLanguage, currentHomeTab);
                      props.dispatchShowBottomBar(true);
                    }}
                  >
                    <Text style={styles.title}>{LangService.strings.EXPERIENCES}</Text>
                    {items?.length && items.map((item, index) => (
                      <NavigationListItem
                        key={item.id}
                        index={item.id}
                        item={item}
                        navigation={navigation}
                        onPressItem={() => onPressItem(item, items, index)}
                      />
                    ))}
                  </Scrollable>
                </>
              )}
            </> : <Map
              navigation={navigation}
              barStyle={"dark-content"} />}
          </>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

function mapStateToProps(state: RootState) {
  const {
    navigation,
    guideGroups,
    guides,
    uiState: { currentHomeTab, searchFilter },
    geolocation,
    position
  } = state;
  const { navigationCategories, currentLanguage } = navigation;
  const { fetchingIds } = guideGroups;
  const { distance, text: searchText } = searchFilter;
  const { all } = guides;
  let categories = "";
  let distanceMetres = distance * 1000;


  categories = [...navigationCategories.map(cat => {
    const data = cat.items
      .map((item) => {
        let copy = { ...item };
        if (copy?.interactiveGuide) {
          copy.interactiveGuide = {
            ...copy.interactiveGuide,
            name: copy.interactiveGuide?.title,
            images: { large: copy.interactiveGuide?.image, thumbnail: copy.interactiveGuide?.image }
          };
        }
        return copy;
      })
      .filter((item) => {
        return item.guide || item.guideGroup || item.interactiveGuide;
      })
      .sort(compareDistance);
    if (data.length > 0) {
      return {
        title: cat.name,
        data,
        category: cat
      };
    }
  })];

  // console.log("categories", categories)

  const isFetching = fetchingIds.length > 0;

  let items =
    !isFetching && categories.length > 0
      ? categories[currentHomeTab]?.data
      : null;

  const coords = geolocation?.coords || geolocation?.position?.coords || position?.coords;

  if (items?.length) {
    items = items.map(v => ({ ...v, children: [] }));
    let original = items;

    // FILTER SEARCH
    if (searchText.trim().length >= 3) {
      items = items.filter(item => {
        let name = item?.guideGroup?.name || item.guide?.name || item.interactiveGuide?.name || "";
        let searchCriteria = true;
        if (searchText) {
          searchCriteria = name.toUpperCase().trim().indexOf(searchText.toUpperCase().trim()) !== -1;
        }
        return searchCriteria;
      });
    }

    //FILTER CHILDREN OF GROUPS
    let allGroups = all.guideGroups;
    if (allGroups?.length && searchText.trim().length >= 3) {
      allGroups.filter(item => {
        if (item?.items) {
          item.items.map(subItem => {
            if (subItem?.name) {
              let searchCriteria = searchText?.trim().length >= 3 ? subItem?.name?.toUpperCase()?.trim()?.indexOf(searchText?.toUpperCase()?.trim()) !== -1 : false;
              if (searchCriteria) {
                let parent = original.find(parentItem => parentItem.id === item.parentID);
                !items.includes(parent) && items.push(parent);
                if (typeof items.indexOf(parent) === "number") {
                  items[items.indexOf(parent)].children.push(subItem);
                }
              }
            }
          });
        }
      });
    }

    //FILTER DISTANCE
    if (distance) {
      items = items.filter(item => {
        const itemLocation = item?.guideGroup?.location || item?.guide?.location || item?.interactiveGuide?.location;
        const itemDistance = LocationUtils.getDistanceBetweenCoordinates(
          coords,
          itemLocation
        );
        return distanceMetres < 3000 ? itemDistance <= distanceMetres : true;
      });
    }

    //SORT BY LOCATION
    if (coords) {
      const itemsWithLocation = [];
      const itemsWithoutLocation = [];
      items.forEach(item => {
        let location = item?.guideGroup?.location || item?.guide?.location || item?.interactiveGuide?.location;
        location ? itemsWithLocation.push(item) : itemsWithoutLocation.push(item);
      });
      itemsWithLocation.sort((a, b) => {
        const aLoc = a?.guideGroup?.location || a?.guide?.location || a?.interactiveGuide?.location;
        const bLoc = b?.guideGroup?.location || b?.guide?.location || b?.interactiveGuide?.location;
        const distanceA = LocationUtils.getDistanceBetweenCoordinates(
          coords,
          aLoc
        );
        const distanceB = LocationUtils.getDistanceBetweenCoordinates(
          coords,
          bLoc
        );
        return distanceA > distanceB ? 1 : -1;
      });
      items = itemsWithLocation.concat(itemsWithoutLocation);
    }
  }


  const navigationCategoryLabels = navigationCategories.map(({ name }) => name);

  return {
    categories,
    currentHomeTab,
    items,
    guideGroups,
    guides,
    showLoadingSpinner: isFetching,
    navigationCategories,
    navigationCategoryLabels,
    currentLanguage,
    isFetching,
  };
}

function mapDispatchToProps(dispatch: Dispatch, state: RootState) {
  return {
    fetchNavigationItems: (code: string, homeTab: number) => dispatch(fetchNavigation(code, homeTab)),
    selectGuide: (id: number) => dispatch(selectCurrentGuideByID(id)),
    selectGuideGroup: (id: number) => dispatch(selectCurrentGuideGroup(id)),
    selectCurrentCategory: (category: NavigationCategory) =>
      dispatch(selectCurrentCategory(category.id)),
    selectCurrentTab: (tabIndex: number) =>
      dispatch(selectCurrentHomeTab(tabIndex)),
    dispatchShowBottomBar: (visible: boolean) =>
      dispatch(showBottomBar(visible)),
    dispatchClearSearchFilter: () =>
      dispatch(clearSearchFilter()),
    dispatchFetchAllGuidesforAllGroups: () =>
      dispatch(fetchAllGuidesForAllGroups())
  };
}


HomeScreen["navigationOptions"] = () => (
  {
    title: LangService.strings.APP_NAME,
    ...HeaderStyles.noElevation
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
