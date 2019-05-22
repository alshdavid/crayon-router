START_DIR=$(pwd)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/..

continueIfSuccessful() {
    rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
}

ISDRY=$1
if [ -z $ISDRY ]; then
    ISDRY=false
fi;
if [ $ISDRY == "--dry" ]; then
    ISDRY=true
fi;
if [ $ISDRY == "-d" ]; then
    ISDRY=true
fi;

# Validate that this version is newer than what's on NPM
curl -s -f https://alshdavid.github.io/sh/scripts/npm-version-bouncer.sh | sh /dev/stdin ./package.json
continueIfSuccessful

# Cleanup
rm -rf coverage
rm readme.md
rm -rf dist

# Run tests
npx jest
continueIfSuccessful

# Generate Readme Badges
# COVERAGE=$(cat ./coverage/src/index.html| grep "class=\"strong\"")
# COVERAGE=$(node -e "console.log(\`${COVERAGE}\`.split('<span class=\"strong\">')[1].replace('% </span>', '').trim())")
VERSION=$(node -e "console.log(require('./package.json').version)")

cp docs/readme.src.md readme.md
sed -i '' -e "s/{{test-coverage}}/${COVERAGE}/g" readme.md
sed -i '' -e "s/{{version}}/${VERSION}/g" readme.md

# Build package
npx tsc
continueIfSuccessful

# Clean up if dry run
if [ $ISDRY == true ]; then
    rm -rf dist
    exit 0
fi;

# # Publish to NPM
cp -r docs ./dist
cp readme.md ./dist
cp package.json ./dist
cd dist
npm publish
cd ..

# Clean up
rm -rf dist

cd $START_DIR