//
//  NotificationManger.h
//  GuideHbg
//
//  Created by Filip Nilsson on 2017-04-24.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef NotificationManger_h
#define NotificationManger_h


#endif /* NotificationManger_h */

#import <React/RCTBridgeModule.h>
#import <AVFoundation/AVFoundation.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

#import <UserNotifications/UserNotifications.h>


@interface NotificationManager : RCTEventEmitter <RCTBridgeModule>


-(void)requestNotification: (NSString*)title body:(NSString *)body identifier:(NSString *)identifier;



@end


