// @flow

declare type Images = { thumbnail: string, medium: string, large: string };
declare type OpenHour = {
  weekday: string,
  closed: boolean,
  opening: string,
  closing: string,
  dayNumber: number
};
declare type OpenHourException = {
  exception_date: string,
  exception_information: string
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
  location: Location[]
};
declare type PointProperty = {
  id: number,
  guideID: number,
  name: string,
  icon: string
};
declare type Action =
  | { type: "SELECT_CURRENT_GUIDEGROUP", guideGroup: GuideGroup }
  | { type: "FETCH_GUIDEGROUPS_REQUEST" }
  | { type: "FETCH_GUIDEGROUPS_SUCCESS", guideGroups: GuideGroup[] }
  | { type: "FETCH_GUIDEGROUPS_FAILURE", error: Error }
  | { type: "FETCH_POINTPROPERTIES_REQUEST" }
  | {
    type: "FETCH_POINTPROPERTIES_SUCCESS",
    pointProperties: PointProperty[],
    guideID: number
  }
  | { type: "FETCH_POINTPROPERTIES_FAILURE", error: Error };

declare type GuideGroupState = {
  isFetching: boolean,
  items: GuideGroup[],
}

declare type UIState = {
  currentGuideGroup: ?GuideGroup,
}

declare type RootState = {
  uiState: UIState,
  guideGroups: GuideGroupState,
}

declare type Dispatch = (action: Action | ThunkAction) => any;
declare type GetState = () => RootState;
declare type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
