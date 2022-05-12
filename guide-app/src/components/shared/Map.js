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


  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setTimeout(() => setTesting(true), 200);
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
        barStyle={barStyle || "light-content"}
        backgroundColor={Colors.themeSecondary}
      />
      {testing && <MarkerListView
        items={mapItems}
        navigation={navigation}
        showListButton={false}
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
    category.items.map(item => {
      items.push(item);
    })
  })

  return {
    currentCategory: category,
    items,
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
