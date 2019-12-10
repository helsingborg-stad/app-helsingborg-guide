#!/bin/sh
set -x

function usage {
    cat << EOF

This script will copy all of the asset and data files in the ./template directory into a new directory under ./assets/<city name>.

Run this from the top level app-helsingborg-guide directory.

Note:
    1) App name must match the one used when creating the city project in "add_city.sh"
    2) New assets in the template directory will be copied across
    3) Only assets that are newer in template will be copied (and then they'll overwrite the ones in the asset directory)

Usage: sh add_city_assets.sh <app name>
Example: sh scripts/add_city_assets.sh Helsingborg

EOF
    exit 1
}

if [[ $# -ne 1 ]]; then
    usage
fi

ROOT_DIRECTORY=$PWD
APP_NAME=$1

TEMPLATE_DIRECTORY=$ROOT_DIRECTORY/template

DATA_DIRECTORY=$ROOT_DIRECTORY/data/$APP_NAME

ASSETS_DIRECTORY=$ROOT_DIRECTORY/assets/$APP_NAME
ASSETS_DIRECTORY_IOS=$ASSETS_DIRECTORY/ios
ASSETS_DIRECTORY_ANDROID=$ASSETS_DIRECTORY/android

mkdir -p $DATA_DIRECTORY

mkdir -p $ASSETS_DIRECTORY
mkdir -p $ASSETS_DIRECTORY_IOS
mkdir -p $ASSETS_DIRECTORY_ANDROID

# Copy files from the template that will be used later to override
rsync -ahP --update --inplace $TEMPLATE_DIRECTORY/assets $ASSETS_DIRECTORY/
rsync -ahP --update --inplace $TEMPLATE_DIRECTORY/data $DATA_DIRECTORY/

# Copy iOS icons and launch screens
rsync -ahP --update --inplace $TEMPLATE_DIRECTORY/ios/GuideApp/Images.xcassets $ASSETS_DIRECTORY_IOS
rsync -ahP --update --inplace $TEMPLATE_DIRECTORY/ios/GuideApp/Base.lproj $ASSETS_DIRECTORY_IOS

# Copy android icons
rsync -ahP --update --inplace $TEMPLATE_DIRECTORY/android/app/src/main/res/drawable-* $ASSETS_DIRECTORY_ANDROID
rsync -ahP --update --inplace $TEMPLATE_DIRECTORY/android/app/src/main/res/mipmap-* $ASSETS_DIRECTORY_ANDROID

