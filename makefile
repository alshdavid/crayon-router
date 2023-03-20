DIR_CORE := packages/router

CORE := cd $(DIR_CORE) && pnpm run


default: clean build test

clean:
	$(CORE) clean

build:
	pnpm i
	make clean
	$(CORE) build

test:
	$(CORE) test

upgrade:
	cd $(DIR_CORE) && ncu -u
