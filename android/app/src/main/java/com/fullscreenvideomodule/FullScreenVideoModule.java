package com.fullscreenvideomodule;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.guidehbg.VideoActivity;

public class FullScreenVideoModule extends ReactContextBaseJavaModule {
  private float mCurrentTime;
  private boolean mPaused;
  private Promise mOnCollapsePromise;

  public FullScreenVideoModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "FullScreenVideoModule";
  }


  @ReactMethod
  public void getPlayerStateOnCollapse(Promise promise) {
    if (mOnCollapsePromise != null) {
      mOnCollapsePromise.reject("ERROR_PREVIOUS_PROMISE_PENDING", "New request before the previous finished");
    }
    mOnCollapsePromise = promise;
  }

  @ReactMethod
  public void open(String url, boolean paused, float currentTime) {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }

    activity.startActivity(VideoActivity.createIntent(activity, url, paused, currentTime));
  }

  @ReactMethod
  public void collapse() {
    final Activity activity = getCurrentActivity();
    if (activity instanceof VideoActivity) {
      VideoActivity videoActivity = (VideoActivity) activity;

      if (mOnCollapsePromise != null) {
        final WritableMap params = Arguments.createMap();
        params.putBoolean("paused", mPaused);
        params.putDouble("currentTime", mCurrentTime);
        mOnCollapsePromise.resolve(params);
        mOnCollapsePromise = null;
      }
      videoActivity.finish();
    }
  }

  @ReactMethod
  public void getVideoParameters(final Promise promise) {
    if (resolveGetVideoParameters(promise)) {
      return;
    }

    final Handler handler = new Handler();
    final int[] retries = {0};
    handler.postDelayed(new Runnable() {
      @Override
      public void run() {
        retries[0] += 1;
        if (resolveGetVideoParameters(promise)) {
          return;
        }

        if (retries[0] > 100) {
          promise.reject("WRONG_ACTIVITY", "The current activity is not VideoActivity");
          return;
        }
        handler.postDelayed(this, 10);
      }
    }, 10);
  }

  private boolean resolveGetVideoParameters(Promise promise) {
    final Activity activity = getCurrentActivity();
    if (!(activity instanceof VideoActivity)) {
      return false;
    }

    VideoActivity videoActivity = (VideoActivity) activity;
    final WritableMap result = Arguments.createMap();
    result.putString("url", videoActivity.getUrlParameter());
    result.putBoolean("paused", videoActivity.getPausedParameter());
    result.putDouble("currentTime", videoActivity.getCurrentTimeParameter());

    promise.resolve(result);
    return true;
  }

  @ReactMethod
  public void setFullscreenPlayState(boolean paused, float currentTime) {
    mPaused = paused;
    mCurrentTime = currentTime;
  }
}
