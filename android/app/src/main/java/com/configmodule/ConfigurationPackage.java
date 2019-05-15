package com.configmodule;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.guidehbg.BuildConfig;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class ConfigurationModule extends ReactContextBaseJavaModule {
  public ConfigurationModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Configuration";
  }

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    final HashMap<String, Object> constants = new HashMap<>();
    constants.put("applicationId", BuildConfig.APPLICATION_ID);
    constants.put("appVersion", BuildConfig.VERSION_NAME);
    constants.put("buildVersion", BuildConfig.VERSION_CODE);
    
    return constants;
  }
}