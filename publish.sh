continueIfSuccessful() {
    rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
}

# Run tests
npx jest
continueIfSuccessful

# Build package
rm -rf dist
npx tsc
continueIfSuccessful

# Publish to NPM
cp -r docs ./dist
cp readme.md ./dist
cp package.json ./dist
cd dist
npm publish
cd ..
rm -rf dist