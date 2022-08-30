// @flow
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showBottomBar } from "@actions/uiStateActions";
import Map from "@shared-components/Map";

type Props = {
  navigation: any,
  currentCategory: ?NavigationCategory,
  selectGuide(id: number): void,
  selectGuideGroup(id: number): void,
  dispatchShowBottomBar(visible: boolean): void,
};

const CategoryMapScreen = (props: Props) => {
  const { navigation } = props;
  const { navigation: nav } = useSelector((s) => s.uiState);
  const { currentHomeTab: categoryIndex } = useSelector((s) => s.uiState);
  const currentCategory = nav.navigationCategories[categoryIndex];
  const dispatch = useDispatch();
  const { name: title } = currentCategory || {};

  useEffect(() => {
    navigation.setParams({ title });
    dispatch(showBottomBar(false));
    return () => dispatch(showBottomBar(true));
  }, []);

  return <Map navigation={navigation} />;
};
export default CategoryMapScreen;
