//
//  NotificationManager.m
//  GuideHbg
//
//  Created by Filip Nilsson on 2017-04-24.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NotificationManager.h"

@implementation NotificationManager

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"NOTIFICATION_PRESSED"];
}

RCT_EXPORT_METHOD(showMediaNotification:(NSString *)title:(NSString *)body:(NSString *)identifier)
{
  [self requestNotification:title body:body identifier:identifier];
}


-(void)requestNotification: (NSString*)title body:(NSString *)body identifier:(NSString *)identifier
{
  
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  UNAuthorizationOptions options = UNAuthorizationOptionAlert + UNAuthorizationOptionSound;
  [center requestAuthorizationWithOptions:options
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
                          if (!granted) {
                            NSLog(@"Something went wrong");
                          }
                        }];
  
  [center getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
    if (settings.authorizationStatus != UNAuthorizationStatusAuthorized) {
      // Notifications not allowed
    }
  }];
  
  UNMutableNotificationContent *content = [UNMutableNotificationContent new];
  content.title = title;
  content.body = body;
  content.sound = [UNNotificationSound defaultSound];
  UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:1
                                                                                                  repeats:NO];
  
  
  UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:identifier
                                                                        content:content trigger:trigger];
  
  [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"Something went wrong: %@",error);
    }
  }];
  
  
}

@end



