// @flow
function getDistance(item: NavigationItem): number {
  const { guideGroup, guide } = item;
  if (guideGroup) {
    const { distance } = guideGroup;
    if (distance) {
      return distance;
    }
  }
  if (guide) {
    const { distance } = guide;
    if (distance) {
      return distance;
    }
  }
  return Number.MAX_VALUE;
}

export function compareDistance(a: NavigationItem, b: NavigationItem): number {
  return getDistance(a) - getDistance(b);
}

export default { compareDistance };
