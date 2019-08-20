#!/bin/sh

yarn
yarn test:cover
yarn clean
yarn build
if [ ! -z "$NPM_TOKEN" ] 
then
    echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > dist/.npmrc
fi
npm publish
cd ..
