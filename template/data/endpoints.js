export const API_BASE_URL = __DEV__
  ? "https://hbg-guide.herokuapp.com"
  : "https://guide-api.helsingborg.se";
export const _LANGUAGE_API_URL = `${API_BASE_URL}/languages`;

// Replace with correct group-id
export const GROUP_ID = __DEV__ ? 25 : 312;
