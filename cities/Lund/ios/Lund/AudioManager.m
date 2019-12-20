//
//  AudioManager.m
//  StartingOut
//
//  Created by Amir Alagic on 3/17/17.
//

#import <Foundation/Foundation.h>
#import "AudioManager.h"
#import "NotificationManager.h"

@implementation AudioManager

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"MEDIA_PREPARED", @"MEDIA_COMPLETED", @"MEDIA_ERROR"];
}

RCT_EXPORT_METHOD(init:(NSString *)fileName title:(NSString*) title body:(NSString*) body )
{
  self.title = title;
  self.body = body;
  NSURL *urlStream = [NSURL URLWithString:fileName];
  AVAsset *asset = [AVURLAsset URLAssetWithURL:urlStream options:nil];
  AVPlayerItem *anItem = [AVPlayerItem playerItemWithAsset:asset];
  
  if (self.audioPlayer != nil)
    [self.audioPlayer removeObserver:self forKeyPath:@"status"];
  
  self.audioPlayer = [AVPlayer playerWithPlayerItem:anItem];
  [self.audioPlayer addObserver:self forKeyPath:@"status" options:0 context:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(itemDidFinishPlaying:) name:AVPlayerItemDidPlayToEndTimeNotification object:self.audioPlayer.currentItem];
  [self sendEventWithName:@"MEDIA_PREPARED" body:@"SomeBody"];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAppEnteringBackground) name:UIApplicationDidEnterBackgroundNotification object:nil];
}

-(void)handleAppEnteringBackground{
  if([[self isPlaying] isEqualToString:@"true"]){
    NotificationManager *notifier = [NotificationManager alloc];
    [notifier requestNotification:  self.title body:self.body identifier:@"hbgstad" ];
  }
}


- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
  if (object == self.audioPlayer && [keyPath isEqualToString:@"status"]) {
    if (self.audioPlayer.status == AVPlayerItemStatusReadyToPlay) {
      [self sendEventWithName:@"MEDIA_PREPARED" body:@"SomeBody"];
      NSError *error = nil;
      AVAudioSession *session = [AVAudioSession sharedInstance];
      [session setCategory: AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionDuckOthers error:&error];
      [session setActive: YES error: nil];
      BOOL result = [session setActive:YES error:&error];
      if (!result) {
        NSLog(@"Error activating audio session: %@", error);
      }
      [self.audioPlayer play];
    } else if (self.audioPlayer.status == AVPlayerItemStatusFailed) {
      [self sendEventWithName:@"MEDIA_ERROR" body:@"SomeBody"];
    }
  }
}

-(void)itemDidFinishPlaying:(NSNotification *) notification {
  [self sendEventWithName:@"MEDIA_COMPLETED" body:@"SomeBody"];
}

RCT_EXPORT_METHOD(start)
{
  NSError *error = nil;
  AVAudioSession *session = [AVAudioSession sharedInstance];
  [session setCategory: AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionDuckOthers error:&error];
  [session setActive: YES error: nil];
  BOOL result = [session setActive:YES error:&error];
  if (!result) {
    NSLog(@"Error activating audio session: %@", error);
  }
  [self.audioPlayer play];
}



RCT_EXPORT_METHOD(pause)
{
  [self.audioPlayer pause];
}

RCT_EXPORT_METHOD(stop)
{
  [self.audioPlayer pause];
}

RCT_REMAP_METHOD(getDuration,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  CMTime time = self.audioPlayer.currentItem.asset.duration;
  float floatTime = (float) time.value/time.timescale;
  
  
  resolve([NSNumber numberWithFloat:floatTime]);
}

RCT_REMAP_METHOD(getCurrentPosition,
                 resolverCurrentTime:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  CMTime time = self.audioPlayer.currentItem.currentTime;
  float floatTime = (float) time.value/time.timescale;
  resolve([NSNumber numberWithFloat:floatTime]);
}

RCT_REMAP_METHOD(isPlaying,
                 resolveIsPlaying:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *isPlaying = [self isPlaying];
  resolve(isPlaying);
}

-(NSString*)isPlaying{
  NSString *result = @"false";
  if(([self.audioPlayer rate] != 0) && ([self.audioPlayer error] == nil)){
    result = @"true";
  }
  
  return result;
}

RCT_EXPORT_METHOD(seekTo:(NSInteger)seconds)
{
  int32_t timeScale = self.audioPlayer.currentItem.asset.duration.timescale;
  CMTime time = CMTimeMakeWithSeconds(seconds, timeScale);
  [self.audioPlayer seekToTime:time toleranceBefore:kCMTimeZero toleranceAfter:kCMTimeZero];
}

RCT_EXPORT_METHOD(release1)
{
  [self.audioPlayer pause];
}

@end
