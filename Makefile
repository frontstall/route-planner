install:
	npm install

develop:
	npm start

build:
	rm -rf build
	npm run build

test:
	npm test

.PHONY: test