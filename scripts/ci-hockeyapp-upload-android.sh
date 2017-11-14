#!/bin/sh

set -e -u

#TODO enable this once upload script has been verified
#if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
#  echo "Skipping HockeyApp upload for pull requests"
#  exit 0
#fi

#TODO remove these default values once upload has been verified
HOCKEYAPP_TOKEN="$HOCKEYAPP_TOKEN_ANDROID"
APK_FILE=android/app/build/outputs/apk/app-release-unsigned.apk

#TODO enable this once upload script has been verified
#case "${TRAVIS_BRANCH}" in
  #develop)
    #HOCKEYAPP_TOKEN="$HOCKEYAPP_TOKEN_ANDROID"
    #APK_FILE=android/app/build/outputs/apk/app-debug.apk
    #;;
  #master)
    #HOCKEYAPP_TOKEN="$HOCKEYAPP_TOKEN_ANDROID_RELEASE"
    #APK_FILE=android/app/build/outputs/apk/app-release.apk
    #;;
  #*)
    #echo "Skipping HockeyApp upload for branch ${TRAVIS_BRANCH}"
    #exit 0
    #;;
#esac

curl \
    -F "status=2" \
    -F "notify=0" \
    -F "notes=$TRAVIS_COMMIT_MESSAGE" \
    -F "notes_type=1" \
    -F "ipa=@$APK_FILE" \
    -H "X-HockeyAppToken: $HOCKEYAPP_TOKEN" \
    https://rink.hockeyapp.net/api/2/apps/upload
