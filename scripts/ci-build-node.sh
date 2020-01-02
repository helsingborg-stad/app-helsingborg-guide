#!/bin/sh
set -e -u

build_city() {
    CITY_PATH=$1
    PREVIOUS_PATH=$PWD

    cd $CITY_PATH

    # ensure we don't run out of file watchers
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

    # build
    npm install
    sh $CITY_PATH/scripts/ci-build-node.sh

    # return to the previous path
    cd $PREVIOUS_PATH
}

build_city $PWD/cities/Helsingborg
build_city $PWD/cities/Lund
