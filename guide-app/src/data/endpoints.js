
import Config from "react-native-config";

export const API_BASE_URL = __DEV__ ? Config.API_BASE_URL_DEV : Config.API_BASE_URL_PROD

export const DEPRECATED_API_BASE_URL = __DEV__ ? Config.DEPRECATED_API_BASE_URL_DEV : Config.DEPRECATED_API_BASE_URL_PROD

export const LANGUAGE_API_URL = __DEV__ ? Config.LANGUAGE_API_URL_DEV : Config.LANGUAGE_API_URL_PROD

export const GROUP_ID = __DEV__ ? parseInt(Config.GROUP_ID_DEV, 10) : parseInt(Config.GROUP_ID_PROD, 10);
