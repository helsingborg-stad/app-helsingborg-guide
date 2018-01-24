import { AsyncStorage } from "react-native";
import { LANGUAGE } from "../lib/my_consts";
import strings from "../languages/strings";
import instructions from "../languages/instructions";
import dc from "../data/datacontext";

const DEFAULT_CODE = "sv";

export default class LangService {
  static strings = [];
  static instructions = [];
  static code;
  static languageObj = {};
  static forceNavigationUpdate = false;

  // TODO: All state from this class should be in the redux store
  static setLanguage(lang) {
    let code = DEFAULT_CODE;

    if (strings[lang]) {
      code = lang;
    }

    LangService.strings = strings[code];
    LangService.instructions = instructions[code];
    LangService.code = code;
    LangService.forceNavigationUpdate = true; // android workaround
  }

  static storeLangCode(code) {
    AsyncStorage.setItem(LANGUAGE, JSON.stringify(code));
  }

  static loadStoredLanguage() {
    return AsyncStorage.getItem(LANGUAGE)
      .then((value) => {
        if (value) {
          LangService.setLanguage(JSON.parse(value));
        } else {
          LangService.setLanguage(DEFAULT_CODE);
        }
        return Promise.resolve(true);
      })
      .catch(error => console.log("error", error));
  }

  static getDefaultCode() {
    return DEFAULT_CODE;
  }

  static getLanguages() {
    if (Object.keys(LangService.languageObj).length) return Promise.resolve(LangService.languageObj);

    const instance = dc();
    return instance.language.getAvailableLanguages().then((languageObj) => {
      if (languageObj) {
        LangService.languageObj = languageObj;
        return Promise.resolve(languageObj);
      }
      return null;
    });
  }

  static getString(key, langCode) {
    const keys = Object.keys(LangService.languageObj);
    if (keys.find(item => item === langCode)) return strings[langCode][key];
    return null;
  }
}
