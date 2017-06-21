/**
 * Created by amir on 3/17/17.
 */
import {NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';

let instance = null;
let MediaPlayer = NativeModules.AudioManager;
const {NGListener} = NativeModules; // NSListener is my class

const MEDIA_PREPARED = 'MEDIA_PREPARED';
const MEDIA_COMPLETED = 'MEDIA_COMPLETED';
const  MEDIA_ERROR = 'MEDIA_ERROR';

export class MediaServiceiOS {

    static url;
    eventEmitter;

    constructor() {
        this.eventEmitter = new NativeEventEmitter(NativeModules.AudioManager);
    }
    static getInstance(){
        if(!instance)
            instance = new MediaServiceiOS();
        return instance;
    }

    init(url){
        MediaServiceiOS.url = url;

        MediaPlayer.init(url);


    }

    start(){
       
        MediaPlayer.start();
    }

    pause(){
        MediaPlayer.pause();
    }

    stop(){
        MediaPlayer.stop();
    }

    release(){
        MediaPlayer.release1();
        MediaServiceiOS.url= null;
    }

    getMeta(){
        let meta={};
        return this.isPlaying()
            .then(isPlaying=>{
                meta['isPlaying']=isPlaying;
                return this.getDuration();
            })
            .then(duration=>{
                meta['duration']=duration;
                return this.getCurrentPosition();
            })
            .then(position=>{
                meta['currentPosition']=position;
                return Promise.resolve(meta);
            });
    }

    getDuration(){
      
        return MediaPlayer.getDuration();
    }

    getCurrentPosition(){
        return MediaPlayer.getCurrentPosition();
    }

    isPlaying(){
        return MediaPlayer.isPlaying();
    }

    seekTo(position){
        MediaPlayer.seekTo(position);
    }

    onPrepared(callback){
        this.eventEmitter.addListener('MEDIA_PREPARED', callback);
    }
    unSubscribeOnPrepared(callback){
        this.eventEmitter.removeListener(MEDIA_PREPARED,callback);
    }

    onError(callback){
        this.eventEmitter.addListener(MEDIA_ERROR,callback);
    }
    unSubscribeOnError(callback){
        this.eventEmitter.removeListener(MEDIA_ERROR,callback);
    }

    onCompleted(callback){
        this.eventEmitter.addListener(MEDIA_COMPLETED,callback);
    }
    unSubscribeOnCompleted(callback){
        this.eventEmitter.removeListener(MEDIA_COMPLETED,callback);
    }


}
