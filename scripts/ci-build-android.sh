#!/bin/sh
set -e -u

FLAVOR="store"

(
  set -x
  cd android/

  ./gradlew ":app:lint${FLAVOR}Debug"
  ./gradlew ":app:lint${FLAVOR}Release"
  ./gradlew ":app:assemble${FLAVOR}Debug"
  ./gradlew ":app:assemble${FLAVOR}Release" -Punsigned
)
