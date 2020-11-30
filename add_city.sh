#!/bin/sh
set -x

function usage {
    cat << EOF

This script will copy all of the files in the ./template directory into a new directory under ./cities.
Any references to the placeholder name and bundle identifiers will be replaced with the ones provided.

Run this from the top level app-helsingborg-guide directory.

Usage: sh add_city.sh <app name> <ios bundle id> <android bundle id>
Example: sh scripts/add_city.sh Helsingborg org.hbg.GuideHbg com.guidehbg

EOF
    exit 1
}

if [[ $# -ne 3 ]]; then
    usage
fi

ROOT_DIRECTORY=$PWD
APP_NAME=$1
APP_BUNDLE_ID_IOS=$2
APP_BUNDLE_ID_ANDROID=$3

TEMPLATE_DIRECTORY=$ROOT_DIRECTORY/template
BUILD_DIRECTORY=$ROOT_DIRECTORY/cities
APP_DIRECTORY=$BUILD_DIRECTORY/$APP_NAME

PLACEHOLDER_NAME=GuideApp
PLACEHOLDER_NAME_LOWERCASE="$(echo $PLACEHOLDER_NAME | tr "[:upper:]" "[:lower:]")"
PLACEHOLDER_BUNDLE_ID_IOS=com.guideapp.GuideApp
PLACEHOLDER_BUNDLE_ID_ANDROID=com.guideapp
ANDROID_SRC_FOLDER="$(echo $APP_BUNDLE_ID_ANDROID | tr -d "com.")"

# Save some variables to be reset later
PREVIOUS_LANG=$LANG
PREVIOUS_LC_CTYPE=$LC_CTYPE

mkdir -p $APP_DIRECTORY

# Copy all our files to a new project directory
# -a = recursive, include symlinks, include permissions, include timestamps, include group, include owner, include devices
# -h = human readable numbers
# --inplace = don't use temporary files
# --update = don't overwrite files if newer ones exist in destination
# --exclude = should be obvious
rsync -ah --inplace \
    --exclude=".gradle" \
    --exclude=".idea" \
    --exclude="android/build" \
    --exclude="android/app/build" \
    --exclude="android/app/src/main/assets" \
    --exclude="ios/Frameworks" \
    --exclude="ios/Pods" \
    --exclude="ios/Podfile.lock" \
    --exclude="node_modules" \
    --update $TEMPLATE_DIRECTORY/ $APP_DIRECTORY/
# Would be nice to use filtering based on the .gitignore file instead (--filter=':- .gitignore') but it doesn't seem to work

# Copy the Frameworks directory, taking care to recreate the symlinks in place (rsync copies the absolute path which is no good)
cp -an $TEMPLATE_DIRECTORY/ios/Frameworks/ $APP_DIRECTORY/ios/Frameworks/

# Set the encoding (sed doesn't like utf-8, for some reason)
LC_CTYPE=C
LANG=C

# Replace all instances of the ios bundle id
find $APP_DIRECTORY/ios -type f -exec sed -i "" -e "s/$PLACEHOLDER_BUNDLE_ID_IOS/$APP_BUNDLE_ID_IOS/" {} +

# Replace all instances of the android bundle id
cd $APP_DIRECTORY/android ./gradlew clean
cd $ROOT_DIRECTORY
find $APP_DIRECTORY/android -type f -exec sed -i "" -e "s/$PLACEHOLDER_BUNDLE_ID_ANDROID/$APP_BUNDLE_ID_ANDROID/" {} +
find $APP_DIRECTORY/android -type f -exec sed -i "" -e "s/$PLACEHOLDER_NAME_LOWERCASE/$ANDROID_SRC_FOLDER/" {} +
find $APP_DIRECTORY/android -depth -name "*$PLACEHOLDER_NAME_LOWERCASE*" | while read f; do mv -vf "$f" "${f//$PLACEHOLDER_NAME_LOWERCASE/$ANDROID_SRC_FOLDER}"; done

# Rename any files and directories with the placeholder in their name
find $APP_DIRECTORY -depth -name "*$PLACEHOLDER_NAME*" | while read f; do mv -vf "$f" "${f//$PLACEHOLDER_NAME/$APP_NAME}"; done
# Try again as sometimes subdirectories get missed when their parent is moved
find $APP_DIRECTORY -depth -name "*$PLACEHOLDER_NAME*" | while read f; do mv -vf "$f" "${f//$PLACEHOLDER_NAME/$APP_NAME}"; done

# Replace all references to the placeholder name with the new app name (this is required as we've renamed the files above)
find $APP_DIRECTORY -depth -type f -exec sed -i "" -e "s/$PLACEHOLDER_NAME/$APP_NAME/" {} +
# Do it twice for similar reasons to above
find $APP_DIRECTORY -depth -type f -exec sed -i "" -e "s/$PLACEHOLDER_NAME/$APP_NAME/" {} +

# Install all of our node modules
cd $APP_DIRECTORY
yarn

# Add assets to the build (e.g. react-native-vector-icons)
npx react-native link

# Install Pods and update the workspace
cd $APP_DIRECTORY/ios
# Set the encoding to UTF-8 for cocoapods
LANG=en_US.UTF-8 pod install


# Reset previously saved variables
LANG=$PREVIOUS_LANG
LC_CTYPE=$PREVIOUS_LC_CTYPE
