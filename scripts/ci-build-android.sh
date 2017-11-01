#!/bin/sh
set -e -u

(
  set -x
  cd android/

  ./gradlew ":app:lintDebug"
  ./gradlew ":app:lintRelease"
  ./gradlew ":app:assembleDebug"
  ./gradlew ":app:assembleRelease" -Punsigned
)
