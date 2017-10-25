package com.example.beaconmodule;


import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.RemoteException;
import android.support.annotation.Nullable;
import android.util.Log;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.altbeacon.beacon.*;
import org.altbeacon.beacon.service.ArmaRssiFilter;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;


public class BeaconModule extends ReactContextBaseJavaModule implements BeaconConsumer, RangeNotifier, MonitorNotifier {

    private static final int PERMISSION_REQUEST_COARSE_LOCATION = 1;
    private static final String TAG = "beacon";
    private static final String BEACON_REGION = "all_beacon_region";
    private static final String BEACON_ENTERED_REGION = "BEACON_ENTERED_REGION";
    private static final String BEACON_SERVICE_CONNECTED = "BEACON_SERVICE_CONNECTED";

    private ReactApplicationContext context;
    private BeaconManager beaconManager;
    BluetoothAdapter mBluetoothAdapter;


    public BeaconModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    @Override
    public String getName() {
        return "BeaconAndroid";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(BEACON_ENTERED_REGION, BEACON_ENTERED_REGION);
        return constants;
    }


    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


    @Override
    public void onBeaconServiceConnect() {
        Log.i(TAG, "service connected");
//        Identifier myBeaconNamespaceId = Identifier.parse("0xedd1ebeac04e5defa017");
//        //Identifier myBeaconInstanceId = Identifier.parse("0x000000000001");
//        Region region = new Region(BEACON_REGION, myBeaconNamespaceId, null, null);
//        try {
//            beaconManager.startRangingBeaconsInRegion(region);
//        } catch (RemoteException e) {
//            e.printStackTrace();
//        }

        beaconManager.addRangeNotifier(this);
        beaconManager.addMonitorNotifier(this);

        sendEvent(context, BEACON_SERVICE_CONNECTED, Arguments.createMap());
    }

    @ReactMethod
    public void isBluetoothEnabled(Promise promise) {
        promise.resolve(mBluetoothAdapter.isEnabled());
    }

    @ReactMethod
    public void init(Promise promise) {
        Log.i("BEACON_THING", "I Will start beacon thing");
        beaconManager = BeaconManager.getInstanceForApplication(context.getApplicationContext());
        // Detect the main identifier (UID) frame:
        beaconManager.getBeaconParsers().add(new BeaconParser().
                setBeaconLayout(BeaconParser.EDDYSTONE_UID_LAYOUT));

        BeaconManager.setRssiFilterImplClass(ArmaRssiFilter.class);


        beaconManager.bind(this);

        promise.resolve(Arguments.createMap());
    }

    @ReactMethod
    public void unbind(Promise promise) {
        Log.i("BEACON_THING", "I Will release beacon thing");

        beaconManager.unbind(this);

        promise.resolve(Arguments.createMap());
    }


    @ReactMethod
    public void startRangingBeacons(String regionId, Promise promise) {
        //Identifier myBeaconNamespaceId = Identifier.parse("0xedd1ebeac04e5defa017");
        Region region = new Region(regionId, null, null, null);
        try {
            beaconManager.startRangingBeaconsInRegion(region);
            promise.resolve(Arguments.createMap());
        } catch (RemoteException e) {
            e.printStackTrace();
            promise.reject(e);

        }

    }

    @ReactMethod
    public void stopRangingBeacons(String regionId, Promise promise) {
        Region region = getRangedRegionById(regionId);
        if (region == null) return;

        try {
            beaconManager.stopRangingBeaconsInRegion(region);
            //beaconManager.unbind(this);
            promise.resolve(Arguments.createMap());
        } catch (RemoteException e) {
            e.printStackTrace();
            promise.reject(e);
        }

    }

    private Region getRangedRegionById(String regionId) {
        Collection<Region> regions = beaconManager.getRangedRegions();
        for (Region region : regions) {
            if (region.getUniqueId().equals(regionId))
                return region;
        }
        return null;
    }


    @ReactMethod
    public void setBackgroundScanPeriod(int period) {
        beaconManager.setBackgroundScanPeriod((long) period);
    }

    @ReactMethod
    public void setBackgroundBetweenScanPeriod(int period) {
        beaconManager.setBackgroundBetweenScanPeriod((long) period);
    }

    @ReactMethod
    public void setForegroundScanPeriod(int period) {
        beaconManager.setForegroundScanPeriod((long) period);
    }

    @ReactMethod
    public void setForegroundBetweenScanPeriod(int period) {
        beaconManager.setForegroundBetweenScanPeriod((long) period);
    }


    @Override
    public Context getApplicationContext() {
        return context.getApplicationContext();
    }

    @Override
    public void unbindService(ServiceConnection serviceConnection) {
        context.getApplicationContext().unbindService(serviceConnection);
    }

    //I want to return false.
    @Override
    public boolean bindService(Intent intent, ServiceConnection serviceConnection, int i) {
        return context.getApplicationContext().bindService(intent, serviceConnection, i);
    }

    @Override
    public void didRangeBeaconsInRegion(Collection<Beacon> collection, Region region) {
        WritableMap payload = Arguments.createMap();
        WritableArray beacons = Arguments.createArray();

        payload.putString("regionId", region.getUniqueId().toString());
        Log.d("BEACONS", collection.toString());
        for (Beacon beacon : collection) {
            if (beacon.getServiceUuid() == 0xfeaa && beacon.getBeaconTypeCode() == 0x00) {
                // This is a Eddystone-UID frame
                Identifier namespaceId = beacon.getId1();
                Identifier instanceId = beacon.getId2();
                Log.i(TAG, "I see a beacon transmitting namespace id: " + namespaceId +
                        " and instance id: " + instanceId +
                        " approximately " + beacon.getDistance() + " meters away.");
                WritableMap params = Arguments.createMap();
                params.putString("nid", namespaceId.toString());
                params.putString("bid", instanceId.toString());
                params.putString("rssi", String.valueOf(beacon.getRssi()));
                params.putString("distance", String.valueOf(beacon.getDistance()));
                params.putString("txPower", String.valueOf(beacon.getTxPower()));

                beacons.pushMap(params);


                // Do we have telemetry data?
                if (beacon.getExtraDataFields().size() > 0) {
                    long telemetryVersion = beacon.getExtraDataFields().get(0);
                    long batteryMilliVolts = beacon.getExtraDataFields().get(1);
                    long pduCount = beacon.getExtraDataFields().get(3);
                    long uptime = beacon.getExtraDataFields().get(4);

                    Log.d(TAG, "The above beacon is sending telemetry version " + telemetryVersion +
                            ", has been up for : " + uptime + " seconds" +
                            ", has a battery level of " + batteryMilliVolts + " mV" +
                            ", and has transmitted " + pduCount + " advertisements.");

                }
            }

        }
        payload.putArray("beacons", beacons);
        sendEvent(context, BEACON_ENTERED_REGION, payload);
    }


    @Override
    public void didEnterRegion(Region region) {

    }

    @Override
    public void didExitRegion(Region region) {

    }

    @Override
    public void didDetermineStateForRegion(int i, Region region) {

    }
}
