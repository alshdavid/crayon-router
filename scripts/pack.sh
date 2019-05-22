START_DIR=$(pwd)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd $DIR/..

continueIfSuccessful() {
    rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi
}

npx tsc
continueIfSuccessful
cp package.json ./dist
cd dist
npm pack


cd $START_DIR