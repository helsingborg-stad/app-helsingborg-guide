package com.guideapp;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.view.View;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.fullscreenvideomodule.FullScreenVideoModule;

public class VideoActivity extends ReactActivity {
  private static final String EXTRA_URL = "url";
  private static final String EXTRA_PAUSED = "paused";
  private static final String EXTRA_CURRENT_TIME = "current time";

  public static Intent createIntent(Context context, String url, boolean paused, float currentTime) {
    return new Intent(context, VideoActivity.class)
        .putExtra(EXTRA_URL, url)
        .putExtra(EXTRA_PAUSED, paused)
        .putExtra(EXTRA_CURRENT_TIME, currentTime);
  }

  @Override
  protected String getMainComponentName() {
    return "VideoApp";
  }

  public String getUrlParameter() {
    final Intent intent = getIntent();
    return intent.getStringExtra(EXTRA_URL);
  }

  public boolean getPausedParameter() {
    final Intent intent = getIntent();
    return intent.getBooleanExtra(EXTRA_PAUSED, true);
  }

  public float getCurrentTimeParameter() {
    final Intent intent = getIntent();
    return intent.getFloatExtra(EXTRA_CURRENT_TIME, 0f);
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      int visibility = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_FULLSCREEN;

      if (Build.VERSION.SDK_INT >= 19) {
        visibility |= View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
      }

      getWindow().getDecorView().setSystemUiVisibility(visibility);
    }
  }

  @Override
  public void onBackPressed() {
    // Normally the default back behaviour would be enough, but currently MainActivity
    // is still listening for back even though it's paused

    final ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
    if (reactContext != null) {
      FullScreenVideoModule module = reactContext.getNativeModule(FullScreenVideoModule.class);
      module.collapse();
    } else {
      finish();
    }
  }
}
