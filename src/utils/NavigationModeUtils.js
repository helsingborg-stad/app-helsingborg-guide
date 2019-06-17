// @flow

/*
  Supported navigation modes for the tour guides.
  This should eventually be stored in the CMS.
*/

const NavigationModes = {
  Map: "MAP",
  AR: "AR",
};

function navigationModesForGuide(trail: Guide): Array<string> {
  // 1627406 is Sofiero Topp-10
  if (trail.id === 1627406) {
    return [NavigationModes.Map, NavigationModes.AR];
  }

  return [NavigationModes.Map];
}

export default {
  NavigationModes,
  navigationModesForGuide,
};
