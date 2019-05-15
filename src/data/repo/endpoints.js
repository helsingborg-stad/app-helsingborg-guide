import { NativeModules } from "react-native";

const { applicationId } = NativeModules.Configuration;

export const API_BASE_URL = applicationId === "com.ustwo.GuideHbg" ? "https://hbg-guide.herokuapp.com" : "https://guide-api.helsingborg.se/";
export const _LANGUAGE_API_URL = `${API_BASE_URL}/languages`;
