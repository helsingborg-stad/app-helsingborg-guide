// @flow
/* eslint-disable no-use-before-define */

export const CREATE_GUIDE = "CREATE_GUIDE";
export const UPDATE_GUIDE = "UPDATE_GUIDE";
export const LOAD_GUIDES_SUCCESS = "LOAD_GUIDES_SUCCESS";

export const FETCH_NAVIGATION_REQUEST = "FETCH_NAVIGATION_REQUEST";
export const FETCH_NAVIGATION_FAILURE = "FETCH_NAVIGATION_FAILURE";
export const FETCH_NAVIGATION_SUCCESS = "FETCH_NAVIGATION_SUCCESS";

export const UPDATE_SUBLOCATION = "UPDATE_SUBLOCATION";
export const LOAD_SUBLOCATIONS_SUCCESS = "LOAD_SUBLOCATIONS_SUCCESS";

export const UPDATE_METRIC = "UPDATE_METRIC";

export const LOAD_FILE = "LOAD_FILE";
export const LOAD_FILE_SUCCESS = "LOAD_FILE_SUCCESS";
export const RELEASE_FILE = "RELEASE_FILE";
export const TOGGLE_PLAY = "TOGGLE_PLAY";
export const UPDATE_AUDIO = "UPDATE_AUDIO_PROGRESS";

export const INTERNET_CHANGED = "INTERNET_CHANGED";

export const ERROR_HAPPENED = "ERROR_HAPPENED";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const CREATE_DOWNLOAD_TASK_SUCCESS = "CREATE_DOWNLOAD_TASK_SUCCESS";
export const CANCEL_DOWNLOAD_TASK_SUCCESS = "CANCEL_DOWNLOAD_TASK_SUCCESS";
export const RESUME_DOWNLOAD_TASK_SUCCESS = "RESUME_DOWNLOAD_TASK_SUCCESS";
export const CLEAR_CACHE_DOWNLOAD_TASK_SUCCESS =
  "CLEAR_CACHE_DOWNLOAD_TASK_SUCCESS";
export const DOWNLOAD_TASK_PROGRESSED = "DOWNLOAD_TASK_PROGRESSED";
export const DOWNLOAD_TASK_COMPLETED = "DOWNLOAD_TASK_COMPLETED";
export const DOWNLOAD_INFO_CLOSED = "DOWNLOAD_INFO_CLOSED";
export const UPDATE_DOWNLOAD_TASK_ = "UPDATE_DOWNLOAD_TASK";
export const SET_DOWNLOAD_DATA_VERSION = "SET_DOWNLOAD_DATA_VERSION";

export const OPEN_MENU = "OPEN_MENU";
export const CLOSE_MENU = "CLOSE_MENU";
export const TOGGLE_MENU = "TOGGLE_MENU";

export const GEOLOCATION_UPDATE_SUCCESS = "GEOLOCATION_UPDATE_SUCCESS";

export type Error = { message: string };
export type Images = { thumbnail: string, medium: string, large: string };
export type OpenHour = {
  weekday: string,
  closed: boolean,
  opening: string,
  closing: string,
  dayNumber: number
};
export type OpenHourException = {
  exception_date: string,
  exception_information: string
};
export type Link = { service: string, url: string };
export type Location = {
  id: number,
  streetAddress: string,
  latitude: number,
  longitude: number,
  openHours: OpenHour[],
  openHoursException: OpenHourException[],
  links: Link[]
};
export type GuideGroup = {
  id: number,
  description: string,
  name: string,
  slug: string,
  images: Images[],
  active: boolean,
  location: Location[]
};
export type PointProperty = {
  id: number,
  guideID: number,
  name: string,
  icon: string
};
export type Action =
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

export type GuideGroupState = {
  isFetching: boolean,
  items: GuideGroup[],
}

export type UIState = {
  currentGuideGroup: ?GuideGroup,
}

export type RootState = {
  uiState: UIState,
  guideGroups: GuideGroupState,
}

export type Dispatch = (action: Action | ThunkAction) => any;
export type GetState = () => RootState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
