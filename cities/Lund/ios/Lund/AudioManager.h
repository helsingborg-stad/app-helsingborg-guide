//
//  AudioManager.h
//  StartingOut
//
//  Created by Amir on 3/17/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef AudioManager_h
#define AudioManager_h


#endif /* AudioManager_h */

#import <React/RCTBridgeModule.h>
#import <AVFoundation/AVFoundation.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface AudioManager : RCTEventEmitter <RCTBridgeModule>

@property NSString* title;
@property NSString* body;

@property (strong, nonatomic) AVPlayer *audioPlayer;

@end
