//
//  IosBeacon.h
//  StartingOut
//
//  Created by Amir on 3/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef IosBeacon_h
#define IosBeacon_h

#endif /* IosBeacon_h */

#import <CoreLocation/CoreLocation.h>
#import <React/RCTComponent.h>
#import <React/RCTEventEmitter.h>

@interface IosBeacon : RCTEventEmitter <RCTBridgeModule, CLLocationManagerDelegate>

@property (strong, nonatomic) CLBeaconRegion *beaconRegion;
@property (strong, nonatomic) CLLocationManager *locationManager;
@property (nonatomic, copy) RCTBubblingEventBlock onRangingBeacons;
@property (nonatomic, copy) RCTBubblingEventBlock onUpdateBeacon;

@end
