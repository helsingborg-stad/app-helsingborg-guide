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
TEMPLATE_DIRECTORY=$ROOT_DIRECTORY/template
BUILD_DIRECTORY=$ROOT_DIRECTORY/cities
APP_DIRECTORY=$BUILD_DIRECTORY/$APP_NAME
ASSETS_DIRECTORY=$ROOT_DIRECTORY/assets/$APP_NAME
DATA_DIRECTORY=$ROOT_DIRECTORY/data/$APP_NAME


# Copy any changes to code in the template to our city project
cp -av $TEMPLATE_DIRECTORY/src $APP_DIRECTORY/

# Copy assets and data changes to our city project
cp -av $ASSETS_DIRECTORY/assets $APP_DIRECTORY/
cp -av $DATA_DIRECTORY/data $APP_DIRECTORY/

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

