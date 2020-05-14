// @flow

declare type Action =
  | { type: "APP_STARTED" }
  | { type: "APP_BECAME_INACTIVE" }
  | { type: "APP_BECAME_ACTIVE" }
  | { type: "SHOW_BOTTOM_BAR", visible: boolean }
  | {
    type: "SELECT_CURRENT_GUIDEGROUP",
    guideGroup: GuideGroup,
    guides: Guide[]
  }
  | { type: "SELECT_CURRENT_CONTENTOBJECT", contentObject: ContentObject }
  | { type: "SELECT_CURRENT_GUIDE", guide: Guide }
  | { type: "SELECT_CURRENT_CONTENTOBJECT_IMAGE", swiperIndex: number }
  | { type: "SELECT_CURRENT_IMAGE", url: ?string }
  | { type: "SELECT_CURRENT_CATEGORY", id: number }
  | { type: "SELECT_CURRENT_BOTTOM_BAR_TAB", tabIndex: number }
  | { type: "SET_DEVELOPER_MODE", enabled: boolean }
  | { type: "SET_NAVIGATION_CATEGORIES", categories: NavigationCategory[] }
  | {
    type: "SET_GUIDES_AND_GUIDEGROUPS",
    guideGroups: GuideGroup[],
    guides: Guide[]
  }
  | { type: "FETCH_NAVIGATION_REQUEST" }
  | { type: "FETCH_NAVIGATION_SUCCESS", categories: NavigationCategory[] }
  | { type: "FETCH_NAVIGATION_FAILURE", error: Error }
  | { type: "FETCH_GUIDEGROUPS_REQUEST" }
  | { type: "FETCH_GUIDEGROUPS_SUCCESS", guideGroups: GuideGroup[] }
  | { type: "FETCH_GUIDEGROUPS_FAILURE", error: Error }
  | { type: "FETCH_GUIDES_REQUEST" }
  | { type: "FETCH_GUIDES_SUCCESS", guides: Guide[] }
  | { type: "FETCH_GUIDES_FAILURE", error: Error }
  | { type: "START_DOWNLOAD_GUIDE", guide: Guide }
  | { type: "PAUSE_DOWNLOAD_GUIDE", guide: Guide }
  | { type: "RESUME_DOWNLOAD_GUIDE", guide: Guide }
  | { type: "CANCEL_DOWNLOAD_GUIDE", guide: Guide }
  | { type: "DOWNLOAD_TASK_START", task: DownloadTask }
  | { type: "DOWNLOAD_TASK_SUCCESS", task: DownloadTask }
  | { type: "DOWNLOAD_TASK_FAILURE", task: DownloadTask, error: Error }
  | { type: "AUDIO_INIT_FILE", audio: AudioState }
  | { type: "AUDIO_LOAD_FILE", audio: AudioState }
  | { type: "AUDIO_LOAD_FILE_SUCCESS", prepared: boolean }
  | { type: "AUDIO_RELEASE_FILE" }
  | { type: "AUDIO_TOGGLE_PLAY" }
  | { type: "AUDIO_PAUSE" }
  | { type: "AUDIO_UPDATE", audio: AudioState }
  | { type: "AUDIO_MOVE_SLIDER", position: number }
  | { type: "AUDIO_MOVE_SLIDER_COMPLETE", position: number }
  | { type: "GEOLOCATION_UPDATE_SUCCESS", position: GeolocationType }
  | { type: "SET_LANGUAGE", langCode: string }
  | { type: "UPDATE_CAMERA_ANGLES", cameraAngles: ARState };

declare type NavigationItemType = "guide" | "guidegroup";

declare type NavigationItem = {
  id: number,
  type: NavigationItemType,
  guide?: Guide,
  guideGroup?: GuideGroup
};

declare type NavigationCategory = {
  id: number,
  description: string,
  name: string,
  slug: string,
  items: NavigationItem[]
};

declare type Coords = {
  speed: number,
  longitude: number,
  latitude: number,
  accuracy: number,
  heading: number,
  altitude: number,
  altitudeAccuracy: number
};

declare type Dispatch = (action: Action | ThunkAction) => any;

declare type Store = {
  dispatch: Dispatch,
  getState: GetState
};

/* in lack of a better name. Geolocation was taken */
declare type GeolocationType = {
  timestamp: number,
  coords: Coords
};

declare type GetState = () => RootState;

declare type ContentType = "audio" | "video";

declare type MediaContent = {
  contentType: ContentType,
  description: string,
  id: number,
  title: string,
  /** @format date-time */
  created: string,
  /** @format date-time */
  modified: string,
  url: string
};

declare type PositionLongLat = {
  longitude: number,
  latitude: number
};

declare type Beacon = {
  id: string,
  nid: string,
  distance?: number
};

declare type LinkType =
  | "web"
  | "instagram"
  | "facebook"
  | "twitter"
  | "spotify"
  | "youtube"
  | "vimeo";

declare type Link = {
  url: string,
  title?: string,
  type?: LinkType
};

declare type ContentObject = {
  id: string,
  order: number,
  postStatus: PostStatus,
  searchableId: string,
  title: string,
  description?: string,
  images: Images[],
  audio?: MediaContent,
  video?: MediaContent,
  links?: Link[],
  beacon?: Beacon,
  location?: Location
};

declare type Guide = {
  id: number,
  slug: string,
  name: string,
  /** @nullable */
  tagline?: ?string,
  /** @nullable */
  description?: string,
  postStatus: PostStatus,
  guideGroupId: number,
  /** @format date-time */
  dateStart?: string,
  /** @format date-time */
  dateEnd?: string,
  guideType: GuideType,
  childFriendly: boolean,
  images: Images,
  contentObjects: ContentObject[],
  distance?: number,
  location?: Location
};

declare type GuideType = "guide" | "trail";

declare type GuideGroup = {
  id: number,
  description: string,
  name: string,
  slug: string,
  images: Images,
  active: boolean,
  location: Location,
  pointProperties: PointProperty[],
  guidesCount: number,
  distance?: number
};

declare type GuideGroupState = {
  isFetching: boolean,
  items: GuideGroup[]
};

declare type GuideState = {
  isFetching: boolean,
  items: Guide[]
};

declare type Images = {
  thumbnail?: ?string,
  medium?: ?string,
  large?: ?string
};

declare type ResizeMode = "cover" | "contain" | "stretch" | "repeat" | "center";

declare type LinkAndService = { service: string, url: string };

declare type Location = {
  id: number,
  streetAddress: ?string,
  latitude: number,
  longitude: number,
  openingHours: OpenHour[],
  openingHourExceptions: OpenHourException[],
  links: LinkAndService[]
};

declare type MapItem = {
  guide?: Guide,
  guideGroup?: GuideGroup,
  contentObject?: ContentObject
};

declare type OpenHour = {
  weekday: string,
  closed: boolean,
  opening: string,
  closing: string,
  dayNumber: number
};

declare type OpenHourException = {
  date: string,
  description: string
};

declare type PointProperty = {
  id: number,
  slug: string,
  name: string,
  icon?: string
};

declare type AudioState = {
  url: string,
  title: string,
  avatar_url: string,
  hasAudio: boolean,
  isPrepared: boolean,
  isPlaying: boolean,
  duration: number,
  currentPosition: number,
  isMovingSlider: boolean
};

declare type PostStatus = "publish" | "draft";

declare type TaskStatus = "not_started" | "failed" | "pending" | "done";
declare type DownloadTask = {
  guideId: number,
  url: string,
  status: TaskStatus
};

declare type DownloadStatus = "stopped" | "pending" | "paused" | "done";
declare type OfflineGuide = {
  status: DownloadStatus,
  progress: number, // between 0 and 1
  downloadTasks: { [string]: DownloadTask },
  guide: Guide
};

declare type DownloadedGuidesState = {
  offlineGuides: { [number]: OfflineGuide }
};

declare type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

declare type UIState = {
  currentGuideGroup: ?GuideGroup,
  currentGuides: ?(Guide[]),
  currentContentObject: ?ContentObject,
  currentContentObjectImageIndex: number,
  currentGuide: ?Guide,
  currentImage: ?string,
  currentCategory: ?number,
  developerMode: boolean,
  currentBottomBarTab: number,
  showBottomBar: boolean
};

declare type NavigationState = {
  isFetching: boolean,
  navigationCategories: NavigationCategory[],
  currentLanguage: string
};

declare type ARState = {
  angleDelta: number,
  verticalAngle: number
};

declare type QuizState = {
  latestQuestionId: string
};

declare type RootState = {
  uiState: UIState,
  guideGroups: GuideGroupState,
  guides: GuideState,
  geolocation: {
    position: GeolocationType,
    bearing: number
  },
  audio: AudioState,
  downloadedGuides: DownloadedGuidesState,
  navigation: NavigationState,
  arState: ARState,
  quizState: QuizState
};
