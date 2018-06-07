// @flow
import { LocationUtils } from "../utils";
import { setGuidesAndGuideGroups } from "../actions/guideGroupActions";

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

function updateDistanceForGuides(guides: Guide[], currentPosition: PositionLongLat): Guide[] {
  const updated = guides.map((g) => {
    const distances: number[] = [];
    // calculting distances to all objects
    g.contentObjects.forEach(
      (obj) => {
        const { location } = obj;
        if (location) {
          const d = LocationUtils.getDistanceBetweenCoordinates(currentPosition, obj.location);
          distances.push(d);
        }
      });
    // finding the shortest
    if (distances.length > 0) {
      const shortest = Math.min(...distances);
      return { ...g, distance: shortest };
    }
    return { ...g };
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
      const { guideGroups, guides } = nextState;
      const updatedGG: GuideGroup[] = updateGuidesCount(guideGroups.items, guides.items);
      dispatch(setGuidesAndGuideGroups(updatedGG, guides.items));
      break;
    }
    case "GEOLOCATION_UPDATE_SUCCESS":
    {
      // updating guide groups distances
      const { geolocation, guideGroups, guides } = nextState;
      if (!geolocation) break;

      const { coords } = geolocation;
      const updatedGG: GuideGroup[] = updateDistance(guideGroups.items, coords);
      const updatedGuides: Guide[] = updateDistanceForGuides(guides.items, coords);
      dispatch(setGuidesAndGuideGroups(updatedGG, updatedGuides));
      break;
    }
    default:
      break;
  }
  return result;
};
