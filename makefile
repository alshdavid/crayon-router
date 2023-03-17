CONCURRENTLY := npx concurrently --kill-others
WAIT_ON := npx wait-on

ARTIFACT_KIT="./src/kit/dist/index.js"
ARTIFACT_CRAYON="./src/crayon/dist/lib/index.js"

KIT := cd src/kit && make
CRAYON := cd src/crayon && make
ANIMATE := cd src/animate && make
PREACT := cd src/preact && make
REACT := cd src/react && make
SVELTE := cd src/svelte && make
VUE := cd src/vue && make
TRANSITION := cd src/transition && make

DIR_KIT := cd src/kit
DIR_CRAYON := cd src/crayon
DIR_ANIMATE := cd src/animate
DIR_PREACT := cd src/preact
DIR_REACT := cd src/react
DIR_SVELTE := cd src/svelte
DIR_VUE := cd src/vue
DIR_TRANSITION := cd src/transition

default: clean install build test

clean-hard:
	git clean -d -f
	git clean -d -f -X

upgrade:
	$(DIR_KIT) && ncu -u
	$(DIR_ANIMATE) && ncu -u
	$(DIR_PREACT) && ncu -u
	$(DIR_REACT) && ncu -u
	$(DIR_CRAYON) && ncu -u
	$(DIR_SVELTE) && ncu -u
	$(DIR_TRANSITION) && ncu -u
	$(DIR_VUE) && ncu -u

clean:
	$(KIT) clean
	$(ANIMATE) clean
	$(PREACT) clean
	$(REACT) clean
	$(CRAYON) clean
	$(SVELTE) clean
	$(TRANSITION) clean
	$(VUE) clean
	cd src && find . -name dist -exec rm -r -f '{}' +
	cd examples && find . -name dist -exec rm -r -f '{}' +
	cd examples && find . -name build -exec rm -r -f '{}' +

install:
	yarn install

build:
	make clean
	$(KIT) build
	$(CRAYON) build
	$(ANIMATE) build
	$(PREACT) build
	$(REACT) build
	$(SVELTE) build
	$(TRANSITION) build
	$(VUE) build

dev:
	make clean
	$(CONCURRENTLY) \
		"$(KIT) build-watch" \
		"$(WAIT_ON) ${ARTIFACT_KIT} && $(CRAYON) build-watch" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(ANIMATE) build-watch" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(PREACT) build-watch" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(REACT) build-watch" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(SVELTE) build-watch" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(TRANSITION) build-watch" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(VUE) build-watch"

dev-prod:
	make clean
	$(CONCURRENTLY) \
		"$(KIT) build:watch:prod" \
		"$(WAIT_ON) ${ARTIFACT_KIT} && $(CRAYON) build-watch-prod" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(ANIMATE) build-watch-prod" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(PREACT) build-watch-prod" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(REACT) build-watch-prod" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(SVELTE) build-watch-prod" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(TRANSITION) build-watch-prod" \
		"$(WAIT_ON) ${ARTIFACT_CRAYON} && $(VUE) build-watch-prod"

test:
	$(KIT) test
	$(CRAYON) test
	$(ANIMATE) test
	$(PREACT) test
	$(REACT) test
	$(SVELTE) test
	$(TRANSITION) test
	$(VUE) test