default: clean build

clean:
	rm -r -f dist && rm -r -f coverage

build:
	npx webpack --mode production

build-dev:
	npx webpack

build-watch:
	npx webpack --watch

build-watch-prod:
	npx webpack --watch --mode production

test:
	npx jest --passWithNoTests

test-cover:
	npx jest --coverage --passWithNoTests

test-watch:
	npx jest --watch --passWithNoTests