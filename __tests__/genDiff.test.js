import fs from 'fs';
import genDiff from '../dist/genDiff';

test('should be equal', () => {
  const beforePath = `${__dirname}/../fixtures/before.json`;
  const afterPath = `${__dirname}/../fixtures/after.json`;
  const result = fs.readFileSync(
    `${__dirname}/../fixtures/afterBeforeCopmared.txt`,
    'utf-8',
  );
  expect(genDiff(beforePath, afterPath)).toEqual(result);
});
