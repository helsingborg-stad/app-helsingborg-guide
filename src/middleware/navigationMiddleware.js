// @flow
import { setNavigationCategories, fetchNavigation } from "../actions/navigationActions";
import { fetchGuides, fetchGuidesForGuideGroup } from "../actions/guideActions";
import { fetchGuideGroups, setGuidesAndGuideGroups } from "../actions/guideGroupActions";

/**
 * Responsible for linking the navigation categories with it's content (guide, guidegroups etc.).
 *
 * Also reloads navigation when language is changed.
 */

function linkNavigationWithContent(
  categories: NavigationCategory[],
  guideGroups: GuideGroup[],
  guides: Guide[]): NavigationCategory[] {
  const sections: NavigationCategory[] = categories.map((cat) => {
    const items: NavigationItem[] = [];
    cat.items.forEach((item) => {
      const { id, type } = item;

      let result: NavigationItem = { ...item };
      delete result.guide;
      delete result.guideGroup;

      if (type === "guide") {
        const guide = guides.find(i => i.id === id);
        if (guide) {
          result = {
            ...item,
            guide,
          };
        }
      } else if (type === "guidegroup") {
        const guideGroup = guideGroups.find(i => i.id === id);
        if (guideGroup) {
          result = {
            ...item,
            guideGroup,
          };
        }
      }

      items.push(result);
    });

    return { ...cat, items };
  });

  return sections;
}

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const result = next(action);
  const nextState = getState();

  switch (action.type) {
    case "SET_LANGUAGE": {
      const { currentLanguage } = nextState.navigation;
      dispatch(fetchNavigation(currentLanguage));
      break;
    }
    case "SELECT_CURRENT_GUIDEGROUP": {
      const { guideGroup } = action;
      const { currentLanguage } = nextState.navigation;
      dispatch(fetchGuidesForGuideGroup(currentLanguage, guideGroup.id));
      break;
    }
    case "FETCH_NAVIGATION_SUCCESS":
    {
      const { navigation } = nextState;
      const { currentLanguage, navigationCategories } = navigation;

      // clear downloaded guides/guidegroups
      dispatch(setGuidesAndGuideGroups([], []));

      // batch fetch a range of guides/guidegroups per navigation section
      navigationCategories.forEach((cat) => {
        const guides: number[] = [];
        const guideGroups: number[] = [];
        cat.items.forEach((navItem) => {
          const { type, id } = navItem;
          if (type === "guide") {
            guides.push(id);
          } else if (type === "guidegroup") {
            guideGroups.push(id);
          }
        });
        dispatch(fetchGuides(currentLanguage, guides));
        dispatch(fetchGuideGroups(currentLanguage, guideGroups));
      });
      break;
    }
    case "FETCH_GUIDES_SUCCESS":
    case "FETCH_GUIDEGROUPS_SUCCESS":
    case "SET_GUIDES_AND_GUIDEGROUPS":
      {
        const { items: guideGroups } = nextState.guideGroups;
        const { items: guides } = nextState.guides;
        const { navigationCategories: categories } = nextState.navigation;
        const renderableCategories = linkNavigationWithContent(categories, guideGroups, guides);
        dispatch(setNavigationCategories(renderableCategories));
      }
      break;
    default:
      break;
  }
  return result;
};
