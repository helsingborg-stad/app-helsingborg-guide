package com.notificationmodule;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.session.MediaSession;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.v4.app.TaskStackBuilder;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v7.app.NotificationCompat;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.guidehbg.MainActivity;
import com.guidehbg.R;

/**
 * Created by msaeed on 2017-03-14.
 */

public class NotificationModule extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    NotificationManager mManager;

    private static final String N_ID = "id";
    private static final String N_TITLE  = "title";
    private static final String N_CONTENT  = "content";
    private static final String N_BIG_TITLE  = "big_content_title";
    private static final String N_EXT_CONTENT  = "ext_content";
    private static final int BKG_COLOR = Color.rgb(211,80,152);
    private static final int SMALL_ICON = R.mipmap.ic_launcher;


    public NotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        mManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    @Override
    public String getName() {
        return "NotificationAndroid";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    //##############################################################

    private NotificationCompat.Builder buildNotification(String title,String content){
        NotificationCompat.Builder mBuilder;
        Intent resultIntent = new Intent(context, MainActivity.class);
        resultIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        //TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
        //stackBuilder.addParentStack(MainActivity.class);
        //stackBuilder.addNextIntent(resultIntent);
//        PendingIntent resultPendingIntent =
//                stackBuilder.getPendingIntent(
//                        0,
//                        PendingIntent.FLAG_UPDATE_CURRENT
//                );


        mBuilder = (NotificationCompat.Builder) new NotificationCompat.Builder(context)
                .setSmallIcon(SMALL_ICON)
                .setContentTitle(title)
                .setColor(BKG_COLOR)
                .setContentText(content)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setContentIntent(PendingIntent.getActivity(context,1,resultIntent,PendingIntent.FLAG_UPDATE_CURRENT));
        return mBuilder;
    }

    @ReactMethod
    public void closeNotification(int id){
        mManager.cancel(id);
    }

    @ReactMethod
    public void closeAll(){
        mManager.cancelAll();
    }




    @ReactMethod
    public void showSimple(String title, String content,int id){
        NotificationCompat.Builder mBuilder = buildNotification(title,content);
        mBuilder.setSound(Uri.parse("android.resource://com.guidehbg/" + R.raw.notify01))
        .setAutoCancel(true);

        mManager.notify(id,mBuilder.build());
    }

    @ReactMethod
    public void showMediaNotification(String title, String content, int id){
        NotificationCompat.Builder mBuilder = buildNotification(title,content);
        mBuilder.setOngoing(false);
        mManager.notify(id,mBuilder.build());
    }

    @ReactMethod
    public void showExtended(ReadableMap rm){

        NotificationCompat.InboxStyle style = new NotificationCompat.InboxStyle();
        style.setBigContentTitle(rm.getString(N_BIG_TITLE));
        ReadableArray events = rm.getArray(N_EXT_CONTENT);
        for (int i=0; i < events.size(); i++) {
            style.addLine(events.getString(i));
        }

        final NotificationCompat.Builder mBuilder =
                (NotificationCompat.Builder) buildNotification(rm.getString(N_TITLE),rm.getString(N_CONTENT))
                //.setLargeIcon(resource)
                .setStyle(style);

        mManager.notify(12121,mBuilder.build());


    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    public void showMediaControl(){
        MediaSession mMediaSession = new MediaSession(context,"GooMedia");

        Notification notification = new NotificationCompat.Builder(context)
                // Show controls on lock screen even when user hides sensitive content.
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setSmallIcon(R.drawable.src_images_hbg)
                // Add media control buttons that invoke intents in your media service
                //.addAction(R.drawable.common_google_signin_btn_icon_dark_normal, "Previous", ) // #0

                // Apply the media style template
                .setStyle(new NotificationCompat.MediaStyle()
                        //.setShowActionsInCompactView(0 /* #1: pause button */)
                        .setMediaSession(MediaSessionCompat.Token.fromToken(mMediaSession.getSessionToken())))
                .setContentTitle("Wonderful music")
                .setContentText("My Awesome Band")
                //.setLargeIcon(albumArtBitmap)
                .build();
        mManager.notify(2000,notification);

    }
}
