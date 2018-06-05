// @flow
import { setNavigationCategories } from "../actions/navigationActions";
import { LocationUtils } from "../utils";

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
  if (categories.length === 0) return [];
  if (guideGroups.length === 0 && guides.length === 0) return [];

  const sections: NavigationCategory[] = categories.map((cat) => {
    const items: NavigationItem[] = [];
    cat.items.forEach((item) => {
      const { id, type } = item;

      let result: ?NavigationItem;
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

      if (result) {
        items.push(result);
      } else {
        console.log("Did not find: ", item);
      }
    });

    const section: NavigationCategory =
      {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        items,
      };
    return section;
  });

  return sections;
}

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const result = next(action);
  const nextState = getState();

  switch (action.type) {
    case "FETCH_NAVIGATION_SUCCESS":
    case "SET_GUIDEGROUPS":
      {
        const { items: guideGroups } = nextState.guideGroups;
        const { items: guides } = nextState.guides;
        const { navigationCategories: categories } = nextState.navigation;
        const renderableCategories = linkNavigationWithContent(categories, guideGroups, guides);
        dispatch(setNavigationCategories(renderableCategories));
      }
      break;
    // TODO fix
    /*
                        const { geolocation, navigation } = nextState;
                        if (!geolocation) break;

                        const { navigationCategories } = navigation;
                        const { coords } = geolocation;

                        const categories = navigationCategories.map((cat) => {
                          const items = cat.items.map((item) => {
                            const { lonlat } = item;
                            let distance = 0;
                            if (lonlat) {
                              distance = LocationUtils.getDistanceBetweenCoordinates(coords, lonlat);
                            }
                            return { ...item, distance };
                          });
                          return { ...cat, items };
                        });
                        dispatch(setRenderableNavigationCategories(categories));
                        */
    default:
      break;
  }
  return result;
};
