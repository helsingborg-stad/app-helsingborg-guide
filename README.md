`develop` [![Build Status](https://travis-ci.org/helsingborg-stad/app-helsingborg-guide.svg?branch=develop)](https://travis-ci.org/helsingborg-stad/app-helsingborg-guide)

# Guide Helsingborg
App for iphone/android displaying guides on specific locations in helsingborg. Integrated with event-api. 

## Getting started

1. Clone repo from [Repo](ssh://adchbgstad@adchbgstad.visualstudio.com:22/HybirdApp/_git/GuideHbg)
2. Install node packages 
    *   npm install

> To debug the Javascript packager will have to run in background. This will give the option for hotreloding and remote debugging Javascript from Chrome. When building for release this features is disabled.


### IOS
Prerequisites:
- [Cocoapods](https://cocoapods.org/)
1. ```pod install```

>If you want to build from command line:
    
1. open root folder from terminal or cmd.
2. Type cmd `react-native run-ios`   Simulator will start as well as the javascript packager

>If you want to debug from Xcode

1. Open Xcode
2. Choose `GuideHbg schema` and device you want to debug on(simulated or on device) in dropdown in the top of the window. 
3. Press play
    * Make sure your device is on the same network if you run on physical device.

### Android
Prerequisites:
- Create a file ```android/release.properties``` that contains
```
storeFile=../relative/path/to/release.keystore
```

>If you want to build from command line:
1. Go to root folder of solution
2. Type `react-native run-android`
    

>If you want to debug from Android studio
1. Open android studio
2. Click the bug symbol with the little play button on top in the ribbon. 

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

Notification are also abstracted in a native method ```NotificationManager.m``` 


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

* First the init method takes a file that can be played
```objc
RCT_EXPORT_METHOD(init:(NSString *)fileName title:(NSString*) title body:(NSString*) body )
```

Control methods are:
* start
```objc
RCT_EXPORT_METHOD(start)
```
* stop
```objc
RCT_EXPORT_METHOD(stop)
```
* pause
```objc
RCT_EXPORT_METHOD(pause)
```
* seekTo 
```objc
RCT_EXPORT_METHOD(seekTo:(NSInteger)seconds)
```

Also some meta data methods is exposed
*isPlaying
```objc
RCT_REMAP_METHOD(isPlaying,
                 resolveIsPlaying:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
*getCurrentPosition
```objc
RCT_REMAP_METHOD(getCurrentPosition,
                 resolverCurrentTime:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
```
*getDuration

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

Then in react listen on ```BEACON_SERVICE_CONNECTED``` (more on the messaging system between react and android [here](https://facebook.github.io/react-native/docs/native-modules-android.html))

After the the application can start scanning for beacons. 

```java
public void startRangingBeacons(String regionId, Promise promise)
````

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

To build for  App Store  follow the steps on this [page](https://facebook.github.io/react-native/docs/running-on-device.html#building-your-app-for-production).

#### Upload to app store
 The steps to upload to App Store are: 

 In XCode:

 1. Set release build configuration
 * Product > Scheme > Edit scheme

 2. Bump build number

 3. Create archive 
 * Choose generic device from device menu. 
 * Select menu Product->Archive

 4. Upload package
 * Select Window->Organizer
 * Press upload to app store(This will only upload to itunes connect)
 * Follow the steps choosing the correct account. 

 ###### Tips: If it does not work to upload with Xcode use Application Loader Instead.
  

 

### Android

Building for release in Android is pretty much covered [here](https://facebook.github.io/react-native/docs/signed-apk-android.html)

make sure to create a file ```android/release.properties``` that contains

```
storeFile=../relative/path/to/release.keystore
keyAlias=key-alias
keyPassword=key-password
storePassword=store-password
```

Then running ```cd android && ./gradlew assembleRelease```

from root folder in application.