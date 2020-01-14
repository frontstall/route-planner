install:
	npm install

develop:
	npm start

build:
	rm -rf build
	npm run build

test:
	npm test -- --coverage --watchAll=false --coverageReporters=text-lcov

.PHONY: test