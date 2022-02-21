import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  selectCurrentGuide,
  selectCurrentCategory,
  selectCurrentHomeTab,
  showBottomBar,
  selectCurrentBottomBarTab,
} from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";

const useDeepLinking = () => {
  const dispatch = useDispatch();
  const { navigation } = useSelector(s => s);
  const { navigationCategories } = navigation;


  const linkingHome = async (params, props) => {
    console.log("the params in hook", params);
    const { type, id_1, id_2, id_3 } = params;
    if (id_1) {
      switch (type) {
        case "guidegroup":
          let item;
          navigationCategories.map(category => {
            let temp;
            temp = category.items.find(group => group.id.toString() === id_1.toString());
            if (temp) {
              item = temp;
            }
          });
          console.log("the ids", params);
          if (item?.guideGroup && item?.id) {
            item?.id && (await dispatch(selectCurrentGuideGroup(item.id)));
            const title = item?.guideGroup?.name;
            const slug = item?.guideGroup?.slug;
            const path = `/places/${slug || title}`;
            trackScreen(path, path);
            dispatch(selectCurrentBottomBarTab(0));
            props.navigation.navigate("LocationScreen", {
              title,
              bottomBarOnUnmount: true,
              path: path,
              ...(id_2 && { redirect: [id_2, id_3] }),
            });
          }
          return;
        case "guide":
          return;
        case "interactive_guide":
          return;
        case "trail":
          return;
        default:
          return;
      }
    }
  };
  return { linkingHome };
};

export default useDeepLinking;
