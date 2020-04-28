import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

const pathResolve = (fileName) => path.resolve(`${__dirname}/../fixtures/`, fileName);

describe.each(['plain', 'json', 'pretty'])('%s type', (diffType) => {
  const result = fs.readFileSync(pathResolve(`${diffType}Result.txt`), 'utf-8');

  test.each(['json', 'yml', 'ini'])('should be equal [.%s]', (extname) => {
    const beforePath = pathResolve(`before.${extname}`);
    const afterPath = pathResolve(`after.${extname}`);
    expect(genDiff(beforePath, afterPath, diffType)).toEqual(result);
  });
});
