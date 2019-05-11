rm -rf dist
npx tsc
cp -r docs ./dist
cp readme.md ./dist
cp package.json ./dist
cd dist
npm publish
cd ..
rm -rf dist