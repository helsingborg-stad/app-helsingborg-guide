// @flow
import { LocationUtils } from "../utils";
import { setGuideGroups } from "../actions/guideGroupActions";

/**
 * Responsible for patching local content.
 * Adding data sucha s guidesCount and distance.
 */

function updateGuidesCount(guideGroups: GuideGroup[], guides: Guide[]): GuideGroup[] {
  if (guides.length === 0) {
    return guideGroups.map(gg => ({ ...gg, guideCount: 0 }));
  }

  const updated: GuideGroup[] = guideGroups.map((gg) => {
    // search for belonging guides
    const guidesCount = guides.filter(g => g.guideGroupId === gg.id).length;
    return { ...gg, guidesCount };
  });

  return updated;
}

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const result = next(action);
  const nextState = getState();

  switch (action.type) {
    case "FETCH_GUIDEGROUPS_SUCCESS":
    case "FETCH_GUIDES_SUCCESS":
    // case "GEOLOCATION_UPDATE_SUCCESS":
    {
      // calculate new guidesCount
      const { guideGroups, guides } = nextState;
      const updatedGG: GuideGroup[] = updateGuidesCount(guideGroups.items, guides.items);
      dispatch(setGuideGroups(updatedGG));
      break;
    }
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
