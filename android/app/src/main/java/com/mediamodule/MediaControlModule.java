package com.mediamodule;

import android.content.Intent;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class MediaControlModule extends ReactContextBaseJavaModule {


    private ReactApplicationContext context;


    public MediaControlModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }


    @Override
    public String getName() {
        return "MediaControlAndroid";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    //#######################################################################################

    @ReactMethod
    public void initMediaControlService() {
        Log.i("HELLO", "FROM INIT");
        Intent intent = new Intent(context.getApplicationContext(), MediaControlService.class);
        intent.setAction(MediaControlService.ACTION_PLAY);
        context.startService(intent);
    }


}