ARTIFACT_KIT="./src/kit/dist/index.js"
ARTIFACT_CRAYON="./src/crayon/dist/index.js"

default: clean install build-prod

clean-hard:
	git clean -d -f
	git clean -d -f -X

clean:
	concurrently \
		"cd src/kit && yarn clean" \
		"cd src/animate && yarn clean" \
		"cd src/preact && yarn clean" \
		"cd src/react && yarn clean" \
		"cd src/crayon && yarn clean" \
		"cd src/svelte && yarn clean" \
		"cd src/transition && yarn clean" \
		"cd src/vue && yarn clean" \
		"cd src && find . -name dist -exec rm -r -f '{}' +" \
		"cd examples && find . -name dist -exec rm -r -f '{}' +" \
		"cd examples && find . -name build -exec rm -r -f '{}' +" 

install:
	yarn install

build:
	make clean
	cd src/kit && yarn build
	cd src/crayon && yarn build
	concurrently \
		"cd src/animate && yarn build" \
		"cd src/preact && yarn build" \
		"cd src/react && yarn build" \
		"cd src/svelte && yarn build" \
		"cd src/transition && yarn build" \
		"cd src/vue && yarn build"

build-prod:
	make clean
	cd src/kit && yarn build:prod
	cd src/crayon && yarn build:prod
	concurrently \
		"cd src/animate && yarn build:prod" \
		"cd src/preact && yarn build:prod" \
		"cd src/react && yarn build:prod" \
		"cd src/svelte && yarn build:prod" \
		"cd src/transition && yarn build:prod" \
		"cd src/vue && yarn build:prod"

dev:
	make clean
	concurrently \
		"cd src/kit && yarn build:watch" \
		"wait-on ${ARTIFACT_KIT} && cd src/crayon && yarn build:watch" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/animate && yarn build:watch" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/preact && yarn build:watch" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/react && yarn build:watch" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/svelte && yarn build:watch" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/transition && yarn build:watch" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/vue && yarn build:watch"

dev-prod:
	make clean
	concurrently \
		"cd src/kit && yarn build:watch:prod" \
		"wait-on ${ARTIFACT_KIT} && cd src/crayon && yarn build:watch:prod" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/animate && yarn build:watch:prod" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/preact && yarn build:watch:prod" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/react && yarn build:watch:prod" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/svelte && yarn build:watch:prod" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/transition && yarn build:watch:prod" \
		"wait-on ${ARTIFACT_CRAYON} && cd src/vue && yarn build:watch:prod"

test:
	cd src/kit && yarn test
	cd src/crayon && yarn test
	cd src/animate && yarn test
	cd src/preact && yarn test
	cd src/react && yarn test
	cd src/svelte && yarn test
	cd src/transition && yarn test
	cd src/vue && yarn test