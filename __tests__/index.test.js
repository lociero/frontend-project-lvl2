import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

const pathResolve = (fileName) => path.resolve(`${__dirname}/../fixtures/`, fileName);

const resultPretty = fs.readFileSync(pathResolve('diffResultPretty.txt'), 'utf-8');
const resultPlain = fs.readFileSync(pathResolve('diffResultPlain.txt'), 'utf-8');
const resultJson = fs.readFileSync(pathResolve('diffResultJson.txt'), 'utf-8');

test('should be equal [.json] (Pretty format)', () => {
  expect(genDiff(pathResolve('before.json'), pathResolve('after.json'))).toEqual(resultPretty);
});

test('should be equal [.yml] (Pretty format)', () => {
  expect(genDiff(pathResolve('before.yml'), pathResolve('after.yml'))).toEqual(resultPretty);
});

test('should be equal [.ini] (Pretty format)', () => {
  expect(genDiff(pathResolve('before.ini'), pathResolve('after.ini'))).toEqual(resultPretty);
});

test('should be equal [.json] (plain format)', () => {
  expect(genDiff(pathResolve('before.json'), pathResolve('after.json'), 'plain')).toEqual(resultPlain);
});

test('should be equal [.yml] (plain format)', () => {
  expect(genDiff(pathResolve('before.yml'), pathResolve('after.yml'), 'plain')).toEqual(resultPlain);
});

test('should be equal [.ini] (plain format)', () => {
  expect(genDiff(pathResolve('before.ini'), pathResolve('after.ini'), 'plain')).toEqual(resultPlain);
});

test('should be equal [.json] (JSON format)', () => {
  expect(genDiff(pathResolve('before.json'), pathResolve('after.json'), 'json')).toEqual(resultJson);
});
