import { AsyncStorage, NativeModules} from 'react-native';
import {LANGUAGE} from "../lib/my_consts";
import strings from '../languages/strings'
import instructions from '../languages/instructions';
import dc from '../data/datacontext';


const DEFAULT_CODE ='sv_SE';
const LANGUAGES = [
    {code:'en_GB',long:'English'},
    {code:'sv_SE',long:'Svenska'},
];

export class LangService{

    static strings = [];
    static instructions = [];
    static code;
    static languageObj = {};

    static setLanguage(lang){
        let code = DEFAULT_CODE;
       // let keys = Object.keys(LangService.languageObj);
        //if(keys.length && keys.find(item=>item==lang))
        code = lang;
        LangService.strings = strings[code];
        LangService.instructions = instructions[code];
        LangService.code = code;

    }

    static storeLangCode(code){
        AsyncStorage.setItem(LANGUAGE,JSON.stringify(code));
    }

    static loadStoredLanguage(){
        return AsyncStorage.getItem(LANGUAGE)
            .then(value=>{
                if(value) {
                    console.log('The stored language:', JSON.parse(value));
                    LangService.setLanguage(JSON.parse(value));
                }else{
                    console.log('No stored language found, loading the default lang:', DEFAULT_CODE);
                    LangService.setLanguage(DEFAULT_CODE);
                }
                    return Promise.resolve(true);

            }).catch(error=>console.log('error',error));

    }

    static getDefaultCode(){
        return DEFAULT_CODE;
    }

    static getLanguages(){
        if(Object.keys(LangService.languageObj).length)
            return Promise.resolve(LangService.languageObj);

        const instance = dc();
        return instance.language.getAvailableLanguages()
            .then(languageObj=>{
                if(languageObj) {
                    console.log('available languages', languageObj);
                    LangService.languageObj = languageObj;
                    return Promise.resolve(languageObj);
                }
            });
    }

    static getString(key,langCode){
        let keys = Object.keys(LangService.languageObj);
        if(keys.find(item=>item==langCode))
            return  (strings[langCode])[key];
        else return null;
    }



}