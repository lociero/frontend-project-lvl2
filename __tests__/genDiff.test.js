import fs from 'fs';
import genDiff from '../src/genDifference.js';

const result = fs.readFileSync(
  `${__dirname}/../fixtures/afterBeforeCopmared.txt`,
  'utf-8',
);

test('should be equal [.json]', () => {
  const beforePath = `${__dirname}/../fixtures/before.json`;
  const afterPath = `${__dirname}/../fixtures/after.json`;

  expect(genDiff(beforePath, afterPath)).toEqual(result);
});

test('should be equal [.yml]', () => {
  const beforePath = `${__dirname}/../fixtures/before.yml`;
  const afterPath = `${__dirname}/../fixtures/after.yml`;

  expect(genDiff(beforePath, afterPath)).toEqual(result);
});
