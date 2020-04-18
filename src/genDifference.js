import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parsers from './parsers/parsers.js';

const readFiles = (path1, path2) => {
  const file1 = fs.readFileSync(path1, 'utf-8');
  const file2 = fs.readFileSync(path2, 'utf-8');
  const fileType1 = path.extname(path1);
  const fileType2 = path.extname(path2);
  const parsed1 = parsers[fileType1](file1);
  const parsed2 = parsers[fileType2](file2);
  return { file1: parsed1, file2: parsed2 };
};

export default (fileToPath1, fileToPath2) => {
  const { file1: before, file2: after } = readFiles(fileToPath1, fileToPath2);
  const keysBefore = Object.keys(before);
  const keysAfter = Object.keys(after);
  const combinedKeys = [...new Set([...keysBefore, ...keysAfter])]; // or _.union

  const checkedKeys = combinedKeys.map((key) => {
    if (_.has(before, key) && _.has(after, key)) {
      if (before[key] === after[key]) {
        return `    ${key}: ${after[key]}`;
      }
      const added = `  + ${key}: ${after[key]}`;
      const removed = `  - ${key}: ${before[key]}`;
      return `${added}\n${removed}`;
    }
    if (_.has(before, key)) {
      return `  - ${key}: ${before[key]}`;
    }
    return `  + ${key}: ${after[key]}`;
  });

  const result = checkedKeys.join('\n');
  return `{\n${result}\n}`;
};
