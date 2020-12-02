// @flow
import { LocationUtils } from "@utils";
import { setGuidesAndGuideGroups } from "@actions/guideGroupActions";

/**
 * Responsible for patching local content.
 * Adding data such as distance.
 */

function updateDistance(
  guideGroups: GuideGroup[],
  currentPosition: PositionLongLat
): GuideGroup[] {
  const updated = guideGroups.map(gg => {
    const distance = LocationUtils.getDistanceBetweenCoordinates(
      currentPosition,
      gg.location
    );
    return { ...gg, distance };
  });

  return updated;
}

function updateDistanceForGuides(
  guides: Guide[],
  currentPosition: PositionLongLat
): Guide[] {
  const updated = guides.map(g => {
    const distances: number[] = [];
    // calculting distances to all objects
    g.contentObjects.forEach(obj => {
      const { location } = obj;
      if (location) {
        const d = LocationUtils.getDistanceBetweenCoordinates(
          currentPosition,
          obj.location
        );
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

export default ({ dispatch, getState }: Store) => (next: Dispatch) => (
  action: Action
) => {
  const result = next(action);
  const nextState = getState();

  switch (action.type) {
    case "GEOLOCATION_UPDATE_SUCCESS": {
      // updating guide groups distances
      const {
        geolocation: { position },
        guideGroups,
        guides,
        interactiveGuides,
      } = nextState;
      if (!position) {
        break;
      }

      const { coords } = position;
      const updatedGG: GuideGroup[] = updateDistance(guideGroups.items, coords);
      const updatedGuides: Guide[] = updateDistanceForGuides(
        guides.items,
        coords
      );
      dispatch(
        setGuidesAndGuideGroups(
          updatedGG,
          updatedGuides,
          interactiveGuides.items
        )
      );
      break;
    }
    default:
      break;
  }
  return result;
};
