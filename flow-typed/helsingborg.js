// @flow

declare type Images = { thumbnail: string, medium: string, large: string };
declare type OpenHour = {
  weekday: string,
  closed: boolean,
  opening: string,
  closing: string,
  dayNumber: number
};
/* TODO: camelCase */
declare type OpenHourException = {
  exception_date: string,
  exeption_information: string
};
declare type Link = { service: string, url: string };
declare type Location = {
  id: number,
  streetAddress: string,
  latitude: number,
  longitude: number,
  openHours: OpenHour[],
  openHoursException: OpenHourException[],
  links: Link[]
};
declare type GuideGroup = {
  id: number,
  description: string,
  name: string,
  slug: string,
  images: Images,
  active: boolean,
  location: Location,
  pointProperties: PointProperty[],
};
declare type PointProperty = {
  id: number,
  slug: string,
  name: string,
  icon?: string
};
declare type Action =
  | { type: "SELECT_CURRENT_GUIDEGROUP", guideGroup: GuideGroup }
  | { type: "FETCH_GUIDEGROUPS_REQUEST" }
  | { type: "FETCH_GUIDEGROUPS_SUCCESS", guideGroups: GuideGroup[] }
  | { type: "FETCH_GUIDEGROUPS_FAILURE", error: Error };

declare type GuideGroupState = {
  isFetching: boolean,
  items: GuideGroup[],
}

declare type UIState = {
  currentGuideGroup: ?GuideGroup
}

declare type RootState = {
  uiState: UIState,
  guideGroups: GuideGroupState,
  geolocation: GeolocationType
}

declare type Dispatch = (action: Action | ThunkAction) => any;
declare type GetState = () => RootState;
declare type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

declare type Coords = {
  speed: number,
  longitude: number,
  latitude: number,
  accuracy: number,
  heading: number,
  altitude: number,
  altitudeAccuracy: number
}

/* in lack of a better name. Geolocation was taken */
declare type GeolocationType = {
  timestamp: number,
  coords: Coords
}
