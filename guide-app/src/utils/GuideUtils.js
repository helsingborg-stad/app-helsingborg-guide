function getGuidesCountFromGuideGroup(guideGroup: ?GuideGroup): number {
  if (!guideGroup) {
    return 0;
  }
  if (!guideGroup.guidesCount) {
    return 0;
  }
  return guideGroup.guidesCount;
}

function getGuidesCountFromGuide(guide: ?Guide): number {
  if (!guide) {
    return 0;
  }
  return guide.contentObjects.length;
}

function getGuidesCount(item: ?NavigationItem): number {
  switch (item.type) {
    case "guidegroup":
      return getGuidesCountFromGuideGroup(item.guideGroup);
    case "guide":
      return getGuidesCountFromGuide(item.guide);
    default:
      return 0;
  }
}

export default { getGuidesCount };
