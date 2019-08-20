#!/bin/sh

yarn test:cover
yarn clean
yarn build
if [ ! -z "$NPM_TOKEN" ] 
then
    echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
fi
npm publish
cd ..
