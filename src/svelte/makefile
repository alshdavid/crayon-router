default: clean build

clean:
	rm -r -f dist && rm -r -f coverage

build:
	npx webpack --prod

build-dev:
	npx webpack

build-watch:
	npx webpack --watch

build-watch-prod:
	npx webpack --watch --prod

test:
	npx jest --passWithNoTests

test-cover:
	npx jest --coverage --passWithNoTests

test-watch:
	npx jest --watch --passWithNoTests