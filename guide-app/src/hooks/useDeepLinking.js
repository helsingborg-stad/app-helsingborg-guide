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
      let item;
      navigationCategories.map(category => {
        let temp;
        temp = category.items.find(group => group.id.toString() === id_1.toString());
        if (temp) {
          item = temp;
        }
      });

      dispatch(selectCurrentBottomBarTab(0));
      dispatch(showBottomBar(false));

      switch (item.type) {
        case "guidegroup":
          if (item?.guideGroup && item?.id) {
            item?.id && (await dispatch(selectCurrentGuideGroup(item.id)));
            const title = item?.guideGroup?.name;
            const slug = item?.guideGroup?.slug;
            const path = `/places/${slug || title}`;
            trackScreen(path, path);
            props.navigation.navigate("LocationScreen", {
              title,
              bottomBarOnUnmount: true,
              path: path,
              ...(id_2 && { redirect: [id_2, id_3] }),
            });
          }
          return;
        case "guide":
          const { guide } = item;
          if (guide) {
            dispatch(selectCurrentGuideByID(guide.id))
            const type = guide?.guideType;
            if (type === "guide") {
              const slug = guide?.slug;
              const title = guide?.name;
              const path = `/tours/${slug || title}`;
              trackScreen(path, path);
              props?.navigation.navigate("GuideDetailsScreen", {
                title: title,
                bottomBarOnUnmount: true,
                path: path,
                ...(id_2 && { redirect: id_2 }),
              });
            } else if (type === "trail") {
              const slug = guide?.slug;
              const title = guide?.name;
              const path = `/tours/${slug || title}`;
              trackScreen(path, path);
              props?.navigation.navigate("TrailScreen", {
                title: title,
                bottomBarOnUnmount: true,
                path: path,
                ...(id_2 && { redirect: id_2 }),
              });
            }
          }
          return;
        case "interactive_guide":
          const { interactiveGuide } = item;
          if (interactiveGuide) {
            props.selectGuide(interactiveGuide.id);
            const title = interactiveGuide?.title;
            const path = `/tours/${title}`;
            trackScreen(path, path);
            props?.navigation.navigate("QuizScreen", {
              quiz: interactiveGuide,
              title: title,
            });
            props.dispatchShowBottomBar(false);

          }
          break;
        default:
          return;
      }
    }
  };
  return { linkingHome };
};

export default useDeepLinking;
