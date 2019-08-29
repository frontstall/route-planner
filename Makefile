install:
	npm install

develop:
	npm start

build:
	rm -rf dist
	npm run build

test:
	npm test

.PHONY: test