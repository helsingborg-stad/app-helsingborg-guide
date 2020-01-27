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

yarn flow

echo "TODO: enable eslint"
# yarn eslint

yarn test

}

echo Finised all tests.
