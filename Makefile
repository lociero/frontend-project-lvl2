install:
	npm install

run:
	src/bin/gendiff.js

test:
	npm test

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

publish:
	npm publish