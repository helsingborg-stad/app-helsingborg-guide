// @flow
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { useSelector } from "react-redux";
import MarkerListView from "@shared-components/MarkerListView";
import { Colors } from "@assets/styles";

type Props = {
  navigation: Object,
};

const Map = (props: Props) => {
  const { navigation } = props;
  const nav = useSelector((s) => s.navigation);
  const currentCategory = nav.navigationCategories[0];
  const [items, setItems] = useState([]);
  const [delay, setDelay] = useState(false);

  useEffect(() => {
    let temp = [];
    nav.navigationCategories.map((category) => {
      if (category?.items) {
        category.items.map((item) => {
          item && temp.push(item);
        });
      }
    });
    setItems(temp);
    setTimeout(() => setDelay(true), 200);
  }, []);

  const mapItems: MapItem[] = [];
  items.forEach((navItem) => {
    const { guide, guideGroup } = navItem;
    if (guideGroup) {
      mapItems.push({ guideGroup: navItem.guideGroup });
    }
    if (guide) {
      mapItems.push({ guide });
    }
  });

  if (!currentCategory) {
    return null;
  }
  return (
    <>
      <StatusBar barStyle={"dark-content"} backgroundColor={Colors.white} />
      {delay && (
        <MarkerListView
          items={mapItems}
          navigation={navigation}
          showListButton={false}
          keepStatusBar={true}
        />
      )}
    </>
  );
};

export default Map;
