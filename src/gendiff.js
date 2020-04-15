import fs from 'fs';
import _ from 'lodash';

const readFiles = (path1, path2) => {
  const file1 = fs.readFileSync(path1, 'utf-8');
  const file2 = fs.readFileSync(path2, 'utf-8');
  const normalized1 = JSON.parse(file1);
  const normalized2 = JSON.parse(file2);
  return { file1: normalized1, file2: normalized2 };
};

export default (path1, path2) => {
  const { file1: before, file2: after } = readFiles(path1, path2);
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
