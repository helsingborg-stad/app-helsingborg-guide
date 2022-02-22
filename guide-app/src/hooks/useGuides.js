import { useDispatch, useSelector } from "react-redux";
import Navigation from "@services/navigationService";
import { fetchGuides } from "@actions/guideActions";
import { fetchGuideGroups } from "@actions/guideGroupActions";
import {
  selectCurrentGuideByID,
  selectCurrentGuideGroup,
  showBottomBar,
} from "@actions/uiStateActions";
import { trackScreen } from "@utils/MatomoUtils";

const useGuides = () => {
  const dispatch = useDispatch();
  const { navigation, guideGroups, guides } = useSelector(s => s );
  const { navigationCategories, currentLanguage } = navigation;

  const linkToGuide = (item, params) => {

    switch (item?.type) {

      case "guidegroup":
        dispatch(selectCurrentGuideGroup(item.id));
        if (item?.guideGroup) {
          const title = item?.guideGroup?.name;
          const slug = item?.guideGroup?.slug;
          const path = `/places/${slug || title}`;
          trackScreen(path, path);
          Navigation.navigate("LocationScreen", {
            title,
            bottomBarOnUnmount: true,
            path: path,
            ...(params?.id_2 && { redirect: [params?.id_2, params?.id_3] }),
          });
          dispatch(showBottomBar(false));
        }
        break;

      case "guide": {
        const { guide } = item;
        if (guide) {
          console.log("guide id", guide.id)
          dispatch(selectCurrentGuideByID(guide.id))
          const type = guide?.guideType;
          if (type === "guide") {
            const slug = guide?.slug;
            const title = guide?.name;
            const path = `/tours/${slug || title}`;
            trackScreen(path, path);
            Navigation.navigate("GuideDetailsScreen", {
              title: title,
              bottomBarOnUnmount: true,
              path: path,
              ...(params?.id_2 && { redirect: params?.id_2 }),
            });
            dispatch(showBottomBar(false));
          } else if (type === "trail") {
            const slug = guide?.slug;
            const title = guide?.name;
            const path = `/tours/${slug || title}`;
            trackScreen(path, path);
            Navigation.navigate("TrailScreen", {
              title: title,
              bottomBarOnUnmount: true,
              path: path,
              ...(params?.id_2 && { redirect: params?.id_2 }),
            });
            dispatch(showBottomBar(false));
          }
        }
        break;
      }

      case "interactive_guide":
        const { interactiveGuide } = item;
        if (interactiveGuide) {
          dispatch(selectCurrentGuideByID(interactiveGuide.id))
          const title = interactiveGuide?.title;
          const path = `/tours/${title}`;
          trackScreen(path, path);
          Navigation.navigate("QuizScreen", {
            quiz: interactiveGuide,
            title: title,
          });
          dispatch(showBottomBar(false));
        }
        break;

      default:
        break;
    }
  }




  const getGuides = () => {
    if (navigationCategories.length) {
      navigationCategories.forEach(cat => {
        const _guides: number[] = [];
        const _guideGroups: number[] = [];
        const _interactiveGuides: number[] = [];
        cat.items.forEach(navItem => {
          const { type, id } = navItem;
          if (type === "guide") {
            _guides.push(id);
          } else if (type === "guidegroup") {
            _guideGroups.push(id);
          } else if (type === "interactive_guide") {
            _interactiveGuides.push(id);
          }
        });

        if(!guides.items.length && _guides.length) {
          dispatch(fetchGuides((currentLanguage || "sv"), _guides))
        }
        if(!guideGroups.items.length && _guideGroups.length) {
          dispatch(fetchGuideGroups((currentLanguage || "sv"), _guideGroups))
        }
      })
    }
  }

  return { linkToGuide, getGuides }

}

export default useGuides;
