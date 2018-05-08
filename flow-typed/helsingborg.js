// @flow

declare type Action =
  | { type: "SELECT_CURRENT_GUIDEGROUP", guideGroup: GuideGroup, guides: Guide[] }
  | { type: "SELECT_CURRENT_CONTENTOBJECT", contentObject: ContentObject }
  | { type: "FETCH_GUIDEGROUPS_REQUEST" }
  | { type: "FETCH_GUIDEGROUPS_SUCCESS", guideGroups: GuideGroup[] }
  | { type: "FETCH_GUIDEGROUPS_FAILURE", error: Error }
  | { type: "FETCH_GUIDES_REQUEST" }
  | { type: "FETCH_GUIDES_SUCCESS", guides: Guide[] }
  | { type: "FETCH_GUIDES_FAILURE", error: Error };

/*
 //TODO To be done
declare type ContentObject = {
}
*/

declare type Coords = {
  speed: number,
  longitude: number,
  latitude: number,
  accuracy: number,
  heading: number,
  altitude: number,
  altitudeAccuracy: number
}

declare type Dispatch = (action: Action | ThunkAction) => any;

/* in lack of a better name. Geolocation was taken */
declare type GeolocationType = {
  timestamp: number,
  coords: Coords
}

declare type GetState = () => RootState;

declare type ContentType = 'audio' | 'video';

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
}

declare type PositionLongLat = {
  longitude: number,
  latitude: number
}

declare type Beacon = {
  id: string,
  nid: string,
  position?: PositionLongLat,
  distance?: number
}

declare type LinkType = 'web' | 'instagram' | 'facebook' | 'twitter' | 'spotify' | 'youtube' | 'vimeo';

declare type Link = {
  url: string,
  title?: string,
  type?: LinkType
}

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
  beacon?: Beacon;
}

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
  contentObjects: ContentObject[]
}

declare type GuideType = 'guide' | 'trail';

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

declare type GuideGroupState = {
  isFetching: boolean,
  items: GuideGroup[],
}

declare type GuideState = {
  isFetching: boolean,
  items: Guide[],
}

declare type Images = { thumbnail: string, medium: string, large: string };

declare type LinkAndService = { service: string, url: string };

declare type Location = {
  id: number,
  streetAddress: string,
  latitude: number,
  longitude: number,
  openingHours: OpenHour[],
  openingHourExceptions: OpenHourException[],
  links: LinkAndService[]
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

declare type PostStatus = 'publish' | 'draft';

declare type RootState = {
  uiState: UIState,
  guideGroups: GuideGroupState,
  guides: GuideState,
  geolocation: GeolocationType
}

declare type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

declare type UIState = {
  currentGuideGroup: ?GuideGroup,
  currentGuides: ?Guide[],
  currentContentObject: ?ContentObject
}
