//
//  IosBeacon.m
//  StartingOut
//
//  Created by Amir on 3/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "IosBeacon.h"

#import "ESSBeaconScanner.h"
#import "ESSEddystone.h"
#import <Foundation/Foundation.h>


@interface IosBeacon () <ESSBeaconScannerDelegate> {
  ESSBeaconScanner *_scanner;
}


@end

@implementation IosBeacon

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"BEACON_ENTERED_REGION_IOS", @"BEACON_SERVICE_CONNECTED", @"UPDATE_BEACON_DATA"];
}

RCT_EXPORT_METHOD(initialize)
{
  NSLog(@"initialized beacon scanner");
  self.locationManager = [[CLLocationManager alloc] init];
  self.locationManager.delegate = self;
  [self.locationManager requestWhenInUseAuthorization];
  
  
 
}

RCT_EXPORT_METHOD(startScanning)
{
  
  _scanner = [[ESSBeaconScanner alloc] init];
  _scanner.delegate = self;
  [_scanner startScanning];
}

RCT_EXPORT_METHOD(stopScanning)
{
  
  [_scanner stopScanning];
  
  _scanner = nil;
}
RCT_EXPORT_METHOD(unbind)
{
  [self.locationManager stopRangingBeaconsInRegion:self.beaconRegion];
  self.locationManager.delegate = nil;
  self.locationManager = nil;
}


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

- (void)initRegion {
  

}

-(void)locationManager:(CLLocationManager*)manager
       didRangeBeacons:(NSArray*)beacons
              inRegion:(CLBeaconRegion*)region
{
  
  NSDictionary *dictionary = [[NSDictionary alloc] init];
  NSMutableDictionary *mutableDict = [dictionary mutableCopy];
  
  for (CLBeacon *beacon in beacons) {
    
    [mutableDict setObject: beacon.major forKey: @"nid"];
    [mutableDict setObject: beacon.minor forKey: @"bid"];
    [mutableDict setObject: [NSString stringWithFormat: @"%ld", (long)beacon.rssi] forKey: @"rssi"];
    
    //[mutableDict setObject: [beacon ] forKey: @"nid"];
    NSString *proximityStr = nil;
    if (beacon.proximity == CLProximityUnknown) {
      proximityStr = @"Unknown Proximity";
    } else if (beacon.proximity == CLProximityImmediate) {
      proximityStr = @"Immediate";
    } else if (beacon.proximity == CLProximityNear) {
      proximityStr = @"Near";
    } else if (beacon.proximity == CLProximityFar) {
      proximityStr = @"Far";
    }
    NSLog(@"%@", [[beacon proximityUUID] UUIDString]);
    [mutableDict setObject: proximityStr forKey: @"distance"];
    //[mutableDict setObject:beacon.accuracy forKey:@"txPower"];
    
  }
  
}


RCT_EXPORT_METHOD(startRangingBeacons)
{
  [self.locationManager stopRangingBeaconsInRegion:self.beaconRegion];
  self.locationManager.delegate = nil;
  self.locationManager = nil;
}

RCT_REMAP_METHOD(startRangingBeacons,
                 resolve:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:@"B9407F30-F5F8-466E-AFF9-25556B57FE6D"];
  self.beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:uuid identifier:@"Estimote"];
  self.beaconRegion.notifyEntryStateOnDisplay = YES;
  [self.locationManager startRangingBeaconsInRegion:self.beaconRegion];
  resolve(@"RangingStarted");
}

RCT_REMAP_METHOD(stopRangingBeacons,
                 resolveStopRanging:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  if(self.beaconRegion != nil){
    [self.locationManager stopRangingBeaconsInRegion:self.beaconRegion];
  }
  resolve(@"RangingStopped");
}

@end
