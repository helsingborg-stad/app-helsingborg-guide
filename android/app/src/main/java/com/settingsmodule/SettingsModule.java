package com.settingsmodule;

import android.content.Intent;
import android.provider.Settings;
import android.support.annotation.Nullable;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;


/**
 * Created by msaeed on 2017-03-14.
 */

public class SettingsModule extends ReactContextBaseJavaModule {

    ReactApplicationContext context;


    public SettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "SettingsAndroid";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    //##############################################################

    @ReactMethod
    public void openWifiSetting() {
        Intent intent = new Intent(Settings.ACTION_WIFI_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);


    }

    @ReactMethod
    public void openLocationSetting() {
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);


    }

    @ReactMethod
    public void openBlSetting() {
        Intent intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);


    }
}
