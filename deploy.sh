#!/bin/sh

START_DIR="$( cd "$(dirname "$0")" ; pwd -P )"

# Path of target package
TARGET_PATH=$1

# Set npm token if the env variable is present
if [ ! -z "$NPM_TOKEN" ]; then
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > $TARGET_PATH/.npmrc
fi

# If alshx is not installed, install it
if ! [ -x "$(command -v alshx)" ]; then
  curl -s -f https://alshdavid.github.io/alshx/bin/alshx | sh /dev/stdin --install
fi

# This is done in the previous pipeline step
# Build all the things
# make

cp readme.md $TARGET_PATH

# Go to package directory
cd $TARGET_PATH

# This is done in the previous pipeline step
# Test the package
# yarn test:cover

# If the version in NPM is older than the version 
# in the package then deploy the package, otherwise
# skip publishing it.
alshx npm-version-bouncer ./package.json
if [ $? = "0" ]; then
  yarn clean
  yarn build:prod
  npm publish
else
  echo Skipped Publish
fi

cd $START_DIR