// @flow
import { setRenderableNavigationCategories } from "../actions/navigationActions";
import { LocationUtils } from "../utils";

/**
 * Responsible for updating the renderable navigation categories.
 *
 * Listens for changes in navigation , guides and guidegroups.
 * Reacts and updates the renderable navigation categories.
 */

function getRenderableNavigationCategories(
  categories: NavigationCategory[],
  guideGroups: GuideGroup[],
  guides: Guide[]): RenderableNavigationCategory[] {
  if (categories.length === 0) return [];
  if (guideGroups.length === 0 && guides.length === 0) return [];

  const sections: RenderableNavigationCategory[] = categories.map((cat) => {
    const items: RenderableNavigationItem[] = [];
    cat.items.forEach((item) => {
      const { id, type } = item;

      let result: ?RenderableNavigationItem;
      if (type === "guide") {
        const g = guides.find(i => i.id === id);
        if (g) {
          result = {
            id,
            image: g.images.medium,
            title: g.name,
            type: g.guideType,
            guidesCount: g.contentObjects.length,
            distance: -1,
          };
        }
      } else if (type === "guidegroup") {
        const gg = guideGroups.find(i => i.id === id);
        if (gg) {
          const guidesCount = guides.filter(g => g.guideGroupId === gg.id).length;
          result = {
            id,
            image: gg.images.medium,
            title: gg.name,
            type,
            guidesCount,
            lonlat: gg.location,
            distance: 0,
          };
        }
      }

      if (result) {
        items.push(result);
      } else {
        console.log("Did not find: ", item);
      }
    });

    const section: RenderableNavigationCategory =
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
    case "FETCH_GUIDEGROUPS_SUCCESS":
    case "FETCH_GUIDES_SUCCESS":
      {
        const { items: guideGroups } = nextState.guideGroups;
        const { items: guides } = nextState.guides;
        const { navigationCategories: categories } = nextState.navigation;
        const renderableCategories = getRenderableNavigationCategories(categories, guideGroups, guides);
        // TODO update distance as well
        dispatch(setRenderableNavigationCategories(renderableCategories));
      }
      break;
    case "GEOLOCATION_UPDATE_SUCCESS":
    {
      const { geolocation, navigation } = nextState;
      if (!geolocation) break;

      const { renderableNavigationCategories } = navigation;
      const { coords } = geolocation;

      const categories = renderableNavigationCategories.map((cat) => {
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
      break;
    }
    default:
      break;
  }
  return result;
};
