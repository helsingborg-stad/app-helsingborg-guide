// @flow
import { setNavigationCategories, setLanguage, fetchNavigation } from "../actions/navigationActions";
import { fetchGuides } from "../actions/guideActions";
import { fetchGuideGroups } from "../actions/guideGroupActions";

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
    case "FETCH_NAVIGATION_SUCCESS":
    {
      const { currentLanguage } = nextState.navigation;
      // TODO fetch a range of guides/guidegroups
      dispatch(fetchGuides(currentLanguage));
      dispatch(fetchGuideGroups(currentLanguage));
      break;
    }
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
