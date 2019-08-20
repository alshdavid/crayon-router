TARGET_PATH=$1

if [ ! -z "$NPM_TOKEN" ]; then
    echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > dist/.npmrc
fi
if ! [ -x "$(command -v alshx)" ]; then
  sh <(curl -sSL https://alshdavid.github.io/alshx/bin/alshx) --install
fi

make
cd $TARGET_PATH
yarn test:cover
alshx npm-version-bouncer ./package.json
if [ $? = "0" ]; then
  yarn clean
  yarn build:prod
  npm publish
else
  echo Skipped Publish
fi