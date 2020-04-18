import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

const pathResolve = (fileName) => path.resolve(`${__dirname}/../fixtures/`, fileName);

const result = fs.readFileSync(pathResolve('afterBeforeCopmared.txt'), 'utf-8');

test('should be equal [.json]', () => {
  expect(genDiff(pathResolve('before.json'), pathResolve('after.json'))).toEqual(result);
});

test('should be equal [.yml]', () => {
  expect(genDiff(pathResolve('before.yml'), pathResolve('after.yml'))).toEqual(result);
});

test('should be equal [.ini]', () => {
  expect(genDiff(pathResolve('before.ini'), pathResolve('after.ini'))).toEqual(result);
});
