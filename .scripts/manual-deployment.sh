DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
ROOT_DIR=$DIR/../

cd $ROOT_DIR

make clean
make build-prod
make test

function deploy() {
  cd $ROOT_DIR/src/$1
  npm publish
}

deploy kit
deploy crayon
deploy preact
deploy react
deploy svelte
deploy animate
deploy transition
deploy vue


