// @flow

function getIdFromMapItem(item: MapItem): string {
  if (item?.contentObject) {
    return item.contentObject?.id;
  }
  if (item?.guide) {
    return `${item.guide?.id}`;
  }
  if (item?.guideGroup) {
    return `${item.guideGroup?.id}`;
  }

  return "";
}

function getLocationFromItem(item: MapItem): ?Location {

  if (item?.guide) {
    return item?.guide?.location;
  }
  if (item?.guideGroup) {
    return item?.guideGroup?.location;
  }
  if (item?.contentObject) {
    return item?.contentObject?.location;
  }

  return null;
}

function getLocations(items: MapItem[]): Location[] {
  const locs: Location[] = [];
  items.forEach(i => {
    const l = getLocationFromItem(i);
    if (l) {
      locs.push(l);
    }
  });
  return locs;
}

function getNumberOfGuides(item: MapItem, all: []): ?number {

  const { guide, guideGroup } = item;
  if (guide) {
    return guide?.contentObjects?.length;
  }
  if (guideGroup) {
    if (all?.guideGroups) {
      return all?.guideGroups?.find(item => item.parentID === guideGroup.id)?.guideAmount || null;
    }
    else {
      return guideGroup?.guidesCount;
    }
  }

  return 0;
}

export default {
  getIdFromMapItem,
  getLocationFromItem,
  getLocations,
  getNumberOfGuides
};
