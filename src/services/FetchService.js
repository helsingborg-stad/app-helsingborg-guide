/**
 * Created by msaeed on 2017-04-10.
 */
import * as _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob'
import {PermissionsAndroid , Platform} from 'react-native'


let instance = null;

const Headers =[
    'http://','https://','ftp://'
];

const MIME =[
    'jpeg','jpg','png','mp3','mp4','m4a'
];

export class FetchService{

    basePath;

    constructor() {
        this.basePath = RNFetchBlob.fs.dirs.CacheDir;

    }
    static getInstance(){
        if(!instance)
            instance = new FetchService();
        return instance;
    }
//######################################
    //The Json scanner
    scanJsonTree(mObject){
        let paths = [];
        const keys = Object.keys(mObject);

        if(!keys.length)
            return paths;

        keys.forEach((key,index)=>{
            // console.log(typeof mObject[key]);

            let item = mObject[key];
            if(this._isDownloadableUrl(item)){
                paths = paths.concat([item])
            }

            if(this._isObject(item))
                paths = paths.concat(this.scanJsonTree(item));
        });

        return _.uniq(paths);

    }

    _isString(data){
        return (typeof data)=='string';
    }

    _isObject(data){
        if(!data)
            return false;
        return (typeof data)=='object';
    }
    _isUrl(str) {

        if(!this._isString(str))
            return false;
        let index =_.findIndex(Headers, header=>{
            return _.startsWith(_.toLower(str),header)
        });
        return !(index==-1);

    }
    _isDownloadableUrl(str){

        if(!this._isUrl(str))
            return false;
        let index =_.findIndex(MIME,ext=>{
            return _.endsWith(_.toLower(str),'.'+ext)
        });
        return !(index==-1);

    }
//########################################
    fetch(url){
        // console.log(dirs.DocumentDir)
        // console.log(dirs.CacheDir)
        // console.log(dirs.DCIMDir)
        // console.log(dirs.DownloadDir)
        let config = {
            fileCache : true,
            path : this.basePath +'/' + url

        };

         
        let task = RNFetchBlob.config(config).fetch('GET', url);
        console.log(url);
        return task;
        //ignore the permission  (cache store).
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(granted=>{
            if(granted)
                return  task.fetch('GET', url);
            else{
                console.log('permission Write to storage is not granted');
                return Promise.reject();
            }
        });

    }

    clearCache(path){
        return RNFetchBlob.fs.unlink(path);
    }

    clearSessionCache(sessionId){
        return RNFetchBlob.session(sessionId).dispose();
    }

    readFile(path){
        return RNFetchBlob.fs.readFile(path, 'base64')
    }

    isExist(path){
        let fullPath = this.getFullPath(path);
        return RNFetchBlob.fs.exists((Platform.OS=='android')?'file://'+fullPath:fullPath);
    }
    getFullPath(_path){
        let path = _path;
        if(!path)
            path = '';
        return (this.basePath + "/" + path);

    }
    getExt(url){
        let l = url.length;
        if(!l) return '';
        //what to do
        return url[l-3]+url[l-2]+url[l-1];
    }


}
