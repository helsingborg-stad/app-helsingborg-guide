package com.mediamodule;


import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
public class MediaModule extends ReactContextBaseJavaModule implements
        MediaPlayer.OnPreparedListener,
        MediaPlayer.OnCompletionListener,
        MediaPlayer.OnErrorListener {

    private static final String MEDIA_PREPARED = "MEDIA_PREPARED";
    private static final String MEDIA_COMPLETED = "MEDIA_COMPLETED";
    private static final String MEDIA_ERROR = "MEDIA_ERROR";


    MediaPlayer mediaPlayer;
    ReactApplicationContext context;


    public MediaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "MediaAndroid";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        //constants.put();
        return constants;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    //#################################################################

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    public void init(String url) {

        try {
            this.release();
        } catch (Exception e) {
            e.printStackTrace();
        }

        mediaPlayer = new MediaPlayer();
        mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);

        try {
            mediaPlayer.setDataSource(url);
            mediaPlayer.setOnPreparedListener(this);
            mediaPlayer.setOnCompletionListener(this);
            mediaPlayer.setOnErrorListener(this);
            mediaPlayer.prepareAsync();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    @ReactMethod
    public void start() {
        if (mediaPlayer != null)
            mediaPlayer.start();
    }

    @ReactMethod
    public void pause() {
        if (mediaPlayer != null)
            mediaPlayer.pause();
    }

    @ReactMethod
    public void stop() {
        if (mediaPlayer != null)
            mediaPlayer.stop();
    }

    @ReactMethod
    public void release() {
        if (mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
    }

    @ReactMethod
    public void getCurrentPosition(Promise jsPromise) {
        if (mediaPlayer != null) {
            int position = mediaPlayer.getCurrentPosition();
            jsPromise.resolve(position);
        }
    }

    @ReactMethod
    public void isPlaying(Promise jsPromise) {
        if (mediaPlayer != null) {
            boolean isPlaying = mediaPlayer.isPlaying();
            jsPromise.resolve(isPlaying);
        }
    }

    @ReactMethod
    public void getDuration(Promise jsPromise) {
        if (mediaPlayer != null) {
            int duration = mediaPlayer.getDuration();
            jsPromise.resolve(duration);
        }
    }

    @ReactMethod
    public void seekTo(int newPosition) {
        if (mediaPlayer != null) {
            mediaPlayer.seekTo(newPosition);
        }
    }


    @Override
    public void onPrepared(MediaPlayer mediaPlayer) {
        mediaPlayer.start();
        sendEvent(context, MEDIA_PREPARED, Arguments.createMap());
    }

    @Override
    public void onCompletion(MediaPlayer mp) {
        Log.i("Media_completed", "media comple");
        sendEvent(context, MEDIA_COMPLETED, Arguments.createMap());

    }

    @Override
    public boolean onError(MediaPlayer mp, int what, int extra) {
        WritableMap params = Arguments.createMap();
        //params.putBoolean();
        sendEvent(context, MEDIA_ERROR, Arguments.createMap());
        return false;
    }
}
