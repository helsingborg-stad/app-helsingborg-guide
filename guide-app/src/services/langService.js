import AsyncStorage from "@react-native-async-storage/async-storage";
import { LANGUAGE } from "@src/lib/my_consts";
import strings from "@assets/languages/strings";
import instructions from "@assets/languages/instructions";
import dc from "@src/data/datacontext";

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
    LangService.setLanguage(DEFAULT_CODE); // we need to read the app name for the splash screen

    return AsyncStorage.getItem(LANGUAGE)
      .then(value => {
        if (value) {
          LangService.setLanguage(JSON.parse(value));
        }
        return Promise.resolve(true);
      })
      .catch(error => console.log("error", error));
  }

  static getDefaultCode() {
    return DEFAULT_CODE;
  }

  static getLanguages() {
    console.log("render state get lang", Object.keys(LangService.languageObj))
    if (Object.keys(LangService.languageObj).length) {
      return Promise.resolve(LangService.languageObj);
    }

    const instance = dc();
    return instance.language.getAvailableLanguages().then(languageObj => {
      if (languageObj) {
        LangService.languageObj = languageObj;
        return Promise.resolve(languageObj);
      }
      return null;
    }).catch(err => console.log("lang err", err))
  }

  static getString(key, langCode) {
    const keys = Object.keys(LangService.languageObj);
    if (keys.find(item => item === langCode)) {
      return strings[langCode][key];
    }
    return null;
  }
}
