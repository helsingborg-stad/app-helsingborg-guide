// @flow
import React, { memo, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { connect, useSelector } from "react-redux";
import MarkerListView from "@shared-components/MarkerListView";
import { Colors } from "@assets/styles";

type Props = {
  navigation: any,
  currentCategory: ?NavigationCategory,
};

const Map = (props: Props) => {
  const { navigation, currentCategory, barStyle, items } = props;


  if (!currentCategory) {
    return null;
  }


  const [delay, setDelay] = useState(false);

  useEffect(() => {
    setTimeout(() => setDelay(true), 200);
  }, []);

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
        barStyle={"dark-content"}
        backgroundColor={Colors.white}
      />
      {delay && <MarkerListView
        items={mapItems}
        navigation={navigation}
        showListButton={false}
        keepStatusBar={true}
      />}
    </>
  );
};


function mapStateToProps(state: RootState) {
  const { uiState, navigation } = state;
  const { currentHomeTab: categoryIndex } = uiState;
  const category = navigation.navigationCategories[0];
  let items = [];

  navigation.navigationCategories.map(category => {
    if (category?.items) {
      category.items.map(item => {
        item && items.push(item);
      });
    }
  });

  return {
    currentCategory: category,
    items
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

export default connect(mapStateToProps, mapDispatchToProps)(Map);
