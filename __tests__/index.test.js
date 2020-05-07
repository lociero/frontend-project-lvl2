/* eslint-disable no-underscore-dangle */
import { describe, test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const getFixturePath = (fileName) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(`${__dirname}/__fixtures__/`, fileName);
};

describe.each(['plain', 'json', 'pretty'])('%s format', (diffType) => {
  const result = fs.readFileSync(getFixturePath(`${diffType}Result.txt`), 'utf-8');

  test.each(['json', 'yml', 'ini'])('should be equal [.%s]', (extname) => {
    const beforePath = getFixturePath(`before.${extname}`);
    const afterPath = getFixturePath(`after.${extname}`);
    expect(genDiff(beforePath, afterPath, diffType)).toEqual(result);
  });
});

// Оверинжиниринг? =)
describe('default format [pretty]', () => {
  const result = fs.readFileSync(getFixturePath('prettyResult.txt'), 'utf-8');
  test.each(['json', 'yml', 'ini'])('should be equal [.%s]', (extname) => {
    const beforePath = getFixturePath(`before.${extname}`);
    const afterPath = getFixturePath(`after.${extname}`);
    expect(genDiff(beforePath, afterPath)).toEqual(result);
  });
});
