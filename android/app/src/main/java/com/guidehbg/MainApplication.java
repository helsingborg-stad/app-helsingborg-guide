package com.guidehbg;

import android.app.Application;

import com.example.beaconmodule.BeaconPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnative.photoview.PhotoViewPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.mediamodule.MediaControlPackage;
import com.mediamodule.MediaPackage;
import com.notificationmodule.NotificationPackage;
import com.settingsmodule.SettingsPackage;

import com.fullscreenvideomodule.FullScreenVideoModule;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(new MainReactPackage(),
                    new PhotoViewPackage(),
                    new BeaconPackage(),
                    new VectorIconsPackage(),
                    new MapsPackage(),
                    new ReactVideoPackage(),
                    new RNFetchBlobPackage(),
                    new NotificationPackage(),
                    new SettingsPackage(),
                    new MediaPackage(),
                    new MediaControlPackage(),
                    new AppPackages());
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
