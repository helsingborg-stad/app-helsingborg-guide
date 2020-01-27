#!/bin/sh
set -x

function usage {
    cat << EOF

This script will copy all of the changed files in the template directory into the city directory

Run this from the top level app-helsingborg-guide directory.

Usage: sh update_city.sh <app name>
Example: sh update_city.sh Helsingborg

EOF
    exit 1
}

if [[ $# -ne 1 ]]; then
    usage
fi

ROOT_DIRECTORY=$PWD
APP_NAME=$1

PLACEHOLDER_NAME=GuideApp
TEMPLATE_DIRECTORY=$ROOT_DIRECTORY/template
BUILD_DIRECTORY=$ROOT_DIRECTORY/cities
APP_DIRECTORY=$BUILD_DIRECTORY/$APP_NAME

DATA_DIRECTORY=$ROOT_DIRECTORY/data/$APP_NAME

ASSETS_DIRECTORY=$ROOT_DIRECTORY/assets/$APP_NAME
ASSETS_DIRECTORY_IOS=$ASSETS_DIRECTORY/ios
ASSETS_DIRECTORY_ANDROID=$ASSETS_DIRECTORY/android

# Save some variables to be reset later
PREVIOUS_LANG=$LANG
PREVIOUS_LC_CTYPE=$LC_CTYPE

# Copy any changes to code in the template to our city project
cp -av $TEMPLATE_DIRECTORY/src $APP_DIRECTORY/

# Copy assets and data changes to our city project
cp -av $ASSETS_DIRECTORY/assets $APP_DIRECTORY/
cp -av $DATA_DIRECTORY/data $APP_DIRECTORY/

# Copy iOS icons and launch screens
cp -av $ASSETS_DIRECTORY_IOS/* $APP_DIRECTORY/ios/$APP_NAME

# Copy android icons
cp -av $ASSETS_DIRECTORY_ANDROID/* $APP_DIRECTORY/android/app/main/src/res

# Rename any files and directories with the placeholder in their name
find $APP_DIRECTORY -depth -name "*$PLACEHOLDER_NAME*" | while read f; do mv -vf "$f" "${f//$PLACEHOLDER_NAME/$APP_NAME}"; done
# Try again as sometimes subdirectories get missed when their parent is moved
find $APP_DIRECTORY -depth -name "*$PLACEHOLDER_NAME*" | while read f; do mv -vf "$f" "${f//$PLACEHOLDER_NAME/$APP_NAME}"; done

# Set the encoding (sed doesn't like utf-8, for some reason)
LC_CTYPE=C
LANG=C
# Replace all references to the placeholder name with the new app name (this is required as we've renamed the files above)
find $APP_DIRECTORY -depth -type f -exec sed -i "" -e "s/$PLACEHOLDER_NAME/$APP_NAME/" {} +
# Do it twice for similar reasons to above
find $APP_DIRECTORY -depth -type f -exec sed -i "" -e "s/$PLACEHOLDER_NAME/$APP_NAME/" {} +

# Install all of our npm modules
cd $APP_DIRECTORY
rm -rf node_modules
npm install

# Add any new assets to the build
npx react-native link

# Install Pods and update the workspace
cd $APP_DIRECTORY/ios
rm -rf build
rm -rf Pods
rm Podfile.lock
# Set the encoding to UTF-8 for cocoapods
LANG=en_US.UTF-8 pod install

# Reset previously saved variables
LANG=$PREVIOUS_LANG
LC_CTYPE=$PREVIOUS_LC_CTYPE

