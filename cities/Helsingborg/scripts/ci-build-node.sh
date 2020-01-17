#!/bin/sh
set -e -u

NPM_BIN="$(npm bin)"
ESLINT="$NPM_BIN/eslint"

if hash gfind 2>/dev/null; then
	FIND=gfind
else
	FIND=find
fi

{
set -x

mkdir -p build/

# Imitating node_modules/react-native/packager/react-native-xcode.sh
yarn react-native bundle --entry-file index.js --platform ios --dev false --reset-cache --bundle-output build/ios-release.jsbundle --assets-dest build/ios-assets-release

# Imitating node_modules/react-native/react.gradle
yarn react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output build/android-release.jsbundle --assets-dest build/android-assets-release

}

echo Finised all tests.
