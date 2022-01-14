
import Config from "react-native-config";

export const eventCalendarURL = __DEV__ ? Config.EVENT_CALENDAR_URL_DEV : Config.EVENT_CALENDAR_URL_PROD

export const sharingFadeUrl = __DEV__ ? Config.SHARING_FADE_URL_DEV : Config.SHARING_FADE_URL_PROD

export const sharingIconUrl = __DEV__ ? Config.SHARING_ICON_URL_DEV : Config.SHARING_ICON_URL_PROD

export const webShopUrl = __DEV__ ? Config.WEB_SHOP_URL_DEV : Config.WEB_SHOP_URL_PROD
