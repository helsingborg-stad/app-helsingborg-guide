// @flow
import { setNavigationCategories } from "../actions/navigationActions";

/**
 * Responsible for updating the renderable navigation categories.
 *
 * Listens for changes in navigation , guides and guidegroups.
 * Reacts and updates the renderable navigation categories.
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
    case "FETCH_NAVIGATION_SUCCESS":
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
