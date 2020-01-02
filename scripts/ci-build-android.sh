#!/bin/sh

function build_city() {
    CITY_PATH=$1
    PREVIOUS_PATH=$PWD

    cd $CITY_PATH
    # extract encryption key
    openssl aes-256-cbc -K $encrypted_a533b106a22c_key -iv $encrypted_a533b106a22c_iv -in android/release.properties.enc -out android/release.properties -d

    # ensure we don't run out of file watchers

    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

    # build
    npm install
    sh $CITY_PATH/scripts/ci-build-android.sh

    # return to the previous path
    cd $PREVIOUS_PATH
}

build_city $PWD/cities/Helsingborg
build_city $PWD/cities/Lund
