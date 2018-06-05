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

function updateDistance(guideGroups: GuideGroup[], currentPosition: PositionLongLat): GuideGroup[] {
  const updated = guideGroups.map((gg) => {
    const distance = LocationUtils.getDistanceBetweenCoordinates(currentPosition, gg.location);
    return { ...gg, distance };
  });

  return updated;
}

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
  const result = next(action);
  const nextState = getState();

  switch (action.type) {
    case "FETCH_GUIDEGROUPS_SUCCESS":
    case "FETCH_GUIDES_SUCCESS":
    {
      // calculate new guidesCount
      const { guideGroups, guides, geolocation } = nextState;
      let updatedGG: GuideGroup[] = updateGuidesCount(guideGroups.items, guides.items);
      if (geolocation) {
        const { coords } = geolocation;
        updatedGG = updateDistance(updatedGG, coords);
      }
      dispatch(setGuideGroups(updatedGG));
      break;
    }
    case "GEOLOCATION_UPDATE_SUCCESS":
    {
      // updating guide groups distances
      const { geolocation, guideGroups } = nextState;
      if (!geolocation) break;

      const { coords } = geolocation;
      const updatedGG: GuideGroup[] = updateDistance(guideGroups.items, coords);
      // TODO also update guides that are trails
      dispatch(setGuideGroups(updatedGG));
      break;
    }
    default:
      break;
  }
  return result;
};
