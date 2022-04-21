
import Config from "react-native-config";

export const API_BASE_URL = __DEV__ ? Config.API_BASE_URL_DEV : Config.API_BASE_URL_PROD

export const DEPRECATED_API_BASE_URL = Config.DEPRECATED_API_BASE_URL;

export const LANGUAGE_API_URL = Config.LANGUAGE_API_URL;

export const GROUP_ID = __DEV__ ? parseInt(Config.GROUP_ID_DEV, 10) : parseInt(Config.GROUP_ID_PROD, 10);

export const DEEP_LINKING_URL = Config.DEEP_LINKING_URL;

export const UNIVERSAL_LINKING_URL = Config.UNIVERSAL_LINKING_URL;

export const MATOMO_URL = Config.MATOMO_URL;

export const MATOMO_SITE_ID = Config.MATOMO_SITE_ID;

