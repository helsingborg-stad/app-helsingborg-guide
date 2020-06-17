`develop` [![Build Status](https://travis-ci.org/helsingborg-stad/app-helsingborg-guide.svg?branch=develop)](https://travis-ci.org/helsingborg-stad/app-helsingborg-guide)

# Guide Helsingborg

App for iphone/android displaying guides on specific locations in helsingborg. Integrated with event-api.

## Table of contents

- [Guide Helsingborg](#guide-helsingborg)
  - [Table of contents](#table-of-contents)
  - [Getting started](#getting-started)
  - [Monorepo](#monorepo)
  - [Working with cities](#working-with-cities)
  - [Adding a new city](#adding-a-new-city)
    - [Updating a city (Might be obsolete)](#updating-a-city-might-be-obsolete)
  - [API integration](#api-integration)
  - [Local development](#local-development)
    - [IOS](#ios)
    - [Android](#android)
  - [Overall solution](#overall-solution)
    - [React native](#react-native)
  - [Native components](#native-components)
    - [IOS](#ios-1)
      - [Beacons](#beacons)
      - [Notifications](#notifications)
      - [AudioManager](#audiomanager)
    - [Android](#android-1)
      - [BeaconModule](#beaconmodule)
      - [MediaModule](#mediamodule)
  - [Build for release](#build-for-release)
    - [IOS](#ios-2)
      - [Upload to app store](#upload-to-app-store)
          - [Tips: If it does not work to upload with Xcode use Application Loader Instead.](#tips-if-it-does-not-work-to-upload-with-xcode-use-application-loader-instead)
    - [Android](#android-2)

## Getting started

1. Clone repo from [Repo](ssh://git@github.com:helsingborg-stad/app-helsingborg-guide.git)
2. Change to the directory of your chosen city in `./cities`
3. Run `yarn install` to install node packages
4. Run `yarn start` to get Metro running
5. Run `npx react-native run-ios --device` or `npx react-native run-android` to build the app as normal

## Monorepo

We used [this article](https://web.archive.org/web/20200129104745/https://engineering.brigad.co/react-native-monorepos-code-sharing-f6c08172b417) to setup the monorepo and code sharing.
Setting this up included changing a lot of references to `node_modules` in the React Native projects (iOS/Android).

For `jetifier` there's a `postinstall` script in each cities `packages.json` to run it in the root directory. There's an [open issue](https://github.com/mikehardy/jetifier/issues/36) that would hopefully remove that need.

## Working with cities

The javascript code is shared between cities, so any changes are made in the `./guide-app/src` directory.
To facilitate that, we use yarn [workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), meaning all npm packages lives in `./node_modules`. The configuration for that is in `./package.json`

```json
  "workspaces": [
    "cities/*",
    "guide-app"
  ],
```

For each app to be able to build, we use a `babel.config.js` with `module-resolver` aliases that point to `./guide-app`. The **only exceptions** are `@assets` (points to `guide-app/assets/[city]`) and `@data` (e.g `cities/Lund/data`).\
There is also a `metro.config.js` in each city folder that makes sure Metro looks for packages in `./node_modules`.

## Adding a new city

**NOTE** This hasn't been tested after moving to monorepo structure to use with care.

1. In the top level of this repository run the add_city shell script with the name of the city and the ios and android bundle ids
   e.g. `sh add_city.sh Helsingborg org.hbg.GuideHbg com.guidehbg`
2. Also in the top level run the add_city_assets shell script to create new override asset directories under assets
   e.g. `sh add_city_assets.sh Helsingborg`
3. Replace the templated assets in the assets/city_name folder with city-specific ones
4. Run the update_city shell script in the top level of this repository to copy the assets from this override directory into the actual city project
   e.g. `sh update_city.sh Helsingborg`
5. The metro bundler and any watchman watches should be killed as they get into a confused state

> To debug the Javascript packager will have to run in background. This will give the option for hotreloding and remote debugging Javascript from Chrome. When building for release this features is disabled.

### Updating a city (Might be obsolete)

**NOTE** This hasn't been tested after moving to monorepo structure to use with care.

Once you have a city-specific assets directory (see below) make any asset changes in the `./assets/city_name` directory.

Once the changes are ready, run the update_city shell script to copy all of the changed files into the city project (in ./cities/city_name)

Each of these are separate ReactNative projects with the aim of building completely separate guide apps.

## API integration

To fetch data from the API for respective city, the app uses a `GROUP_ID`, found in `[city]/data/endpoints.js`.

## Local development

### IOS

Prerequisites:

- [Cocoapods](https://cocoapods.org/)

1. `pod install`

> If you want to build from command line:

1. open root folder from terminal or cmd.
2. Type cmd `react-native run-ios` Simulator will start as well as the javascript packager

> If you want to debug from Xcode

1. Open Xcode
2. Choose `GuideHbg schema` and device you want to debug on(simulated or on device) in dropdown in the top of the window.
3. Press play
   - Make sure your device is on the same network if you run on physical device.

### Android

Prerequisites:

- Create a file `android/release.properties` that contains

```
storeFile=../relative/path/to/release.keystore
```

> If you want to build from command line:

1. Go to root folder of solution
2. Type `react-native run-android`

> If you want to debug from Android studio

1. Open android studio
2. Click the bug symbol with the little play button on top in the ribbon.

---

## Overall solution

### React native

Most of the user interface(UI) is created in react native with JSX syntax. Some of the UI elements is also based on the native components which comes with react.

The basic architechture follow standard react flow with state and props. The data flow is handled with redux which is handling data in a single store across the entire application. Data only flow in one direction having the store as single atomic state.

The basic folder structure for the react part is as follows:

```
root
│   index.js
└───src
│   │
|   └───components
|   │   └───  screens
|   │   └───  shared
|   │
|   └───service
└───android
└───ios
|
```

The views are gathered in the screens folder in which act as the house for different components ans modules. The shared folder holds components that can be used by different views.

The services folder has most of the view logic of the application as well as communication between custom native components(ios and android) and react native.

## Native components

The application has some custom native compnentes both in android and in IOS. Mostly to communicate with beacons trough bluetooth. The native componentes share the same contract(as much as possible) so that the implemenation can be fairly the the same for IOS and android.

The beacon technology is based on bluetooth low energy(BLE). There is essentially two protocols used for this, Eddystone and iBeacon. iBeacon is a simple api for IOS and has no equvalent in android therefore Eddystone was choosen.

### IOS

#### Beacons

The eddystone protocol implementation for IOS is forked from [EssBeaconScanner](https://github.com/google/eddystone). The library has a simple library for start scanning reading some information from the beacon and determin the type.

The IosBeacon.m uses some of the functions in the beacon library and exposes them to react.

The most important methods are:

```objc

- (void)beaconScanner:(ESSBeaconScanner *)scanner
        didFindBeacon:(id)beaconInfo {

  ESSBeaconInfo *_beaconInfo = (ESSBeaconInfo *) beaconInfo;

  [self sendEventWithName:@"BEACON_ENTERED_REGION_IOS" body:[NSString stringWithFormat:@"{\"txPower\":\"%@\",\"rssi\":\"%@\",\"uid\":\"%@\"}",_beaconInfo.txPower,_beaconInfo.RSSI, _beaconInfo.beaconID.beaconID]];
  NSLog(@"I Saw an Eddystone!: %@",beaconInfo );
}


-(void)beaconScanner:(ESSBeaconScanner *)scanner didUpdateBeacon:(id)beaconInfo{

  ESSBeaconInfo *_beaconInfo = (ESSBeaconInfo *) beaconInfo;

  [self sendEventWithName:@"UPDATE_BEACON_DATA" body:[NSString stringWithFormat:@"{\"txPower\":\"%@\",\"rssi\":\"%@\",\"uid\":\"%@\"}",_beaconInfo.txPower,_beaconInfo.RSSI, _beaconInfo.beaconID.beaconID]];
  NSLog(@"I Saw an Eddystone!: %@",beaconInfo );


}

```

The method will push all the beacons that is in proximity to the React context.

#### Notifications

Notification are also abstracted in a native method `NotificationManager.m`

Method exposed to React:

```objc

RCT_EXPORT_METHOD(showMediaNotification:(NSString *)title:(NSString *)body:(NSString *)identifier)
{
  [self requestNotification:title body:body identifier:identifier];
}
```

This will simply display a notification from the application.

#### AudioManager

The AudioManager exposes many methods to React for handling playback of audio.

- First the init method takes a file that can be played

```objc
RCT_EXPORT_METHOD(init:(NSString *)fileName title:(NSString*) title body:(NSString*) body )
```

Control methods are:

- start

```objc
RCT_EXPORT_METHOD(start)
```

- stop

```objc
RCT_EXPORT_METHOD(stop)
```

- pause

```objc
RCT_EXPORT_METHOD(pause)
```

- seekTo

```objc
RCT_EXPORT_METHOD(seekTo:(NSInteger)seconds)
```

Also some meta data methods is exposed
\*isPlaying

````objc
RCT_REMAP_METHOD(isPlaying,
                 resolveIsPlaying:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
*getCurrentPosition
```objc
RCT_REMAP_METHOD(getCurrentPosition,
                 resolverCurrentTime:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
````

\*getDuration

```objc
RCT_REMAP_METHOD(getDuration,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)

```

### Android

#### BeaconModule

The BeaconModule int android is a bit more complex then in IOS or at least have one more step in order to start scanning.

First sted is to init:

```java
public void init(Promise promise)
```

Then in react listen on `BEACON_SERVICE_CONNECTED` (more on the messaging system between react and android [here](https://facebook.github.io/react-native/docs/native-modules-android.html))

After the the application can start scanning for beacons.

```java
public void startRangingBeacons(String regionId, Promise promise)
```

Stop scanning is also exposed so the application can stop scanning when navigating around the application.

```java
public void stopRangingBeacons(String regionId, Promise promise)

```

#### MediaModule

The MediaModule.java in android exposes the same methods as the IOS AudioModule. Which makes the implementation in React simple.

Here is the exposed methods:

```java


 @ReactMethod
    public void init(String url){

        try {
            this.release();
        }catch (Exception e){
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
    public void start(){
        if(mediaPlayer !=null)
            mediaPlayer.start();
    }

    @ReactMethod
    public void pause(){
        if(mediaPlayer !=null)
            mediaPlayer.pause();
    }
    @ReactMethod
    public void stop(){
        if(mediaPlayer !=null)
            mediaPlayer.stop();
    }
    @ReactMethod
    public void release(){
        if(mediaPlayer !=null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
    }
    @ReactMethod
    public void getCurrentPosition(Promise jsPromise){
        if(mediaPlayer !=null){
            int position = mediaPlayer.getCurrentPosition();
            jsPromise.resolve(position);
        }
    }
    @ReactMethod
    public void isPlaying(Promise jsPromise){
        if(mediaPlayer !=null){
            boolean isPlaying = mediaPlayer.isPlaying();
            jsPromise.resolve(isPlaying);
        }
    }
    @ReactMethod
    public void getDuration(Promise jsPromise){
        if(mediaPlayer !=null){
            int duration = mediaPlayer.getDuration();
            jsPromise.resolve(duration);
        }
    }
    @ReactMethod
    public void seekTo(int newPosition){
        if(mediaPlayer !=null){
            mediaPlayer.seekTo(newPosition);
        }
    }
```

## Build for release

### IOS

To build for App Store follow the steps on this [page](https://facebook.github.io/react-native/docs/running-on-device.html#building-your-app-for-production).

#### Upload to app store

The steps to upload to App Store are:

In XCode:

1.  Set release build configuration

- Product > Scheme > Edit scheme

2.  Bump build number

3.  Create archive

- Choose generic device from device menu.
- Select menu Product->Archive

4.  Upload package

- Select Window->Organizer
- Press upload to app store(This will only upload to itunes connect)
- Follow the steps choosing the correct account.

###### Tips: If it does not work to upload with Xcode use Application Loader Instead.

### Android

Building for release in Android is pretty much covered [here](https://facebook.github.io/react-native/docs/signed-apk-android.html)

make sure to create a file `android/release.properties` that contains

```
storeFile=../relative/path/to/release.keystore
keyAlias=key-alias
keyPassword=key-password
storePassword=store-password
```

From the `android/` directory:

- To build an App Bundle, run `./gradlew bundleStoreRelease`
- To build an APK, run `./gradlew assembleStoreRelease`
