import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers/index.js';
import isObject from './utils.js';
import render from './formatters/index.js';

const readFile = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf-8');
  const dataType = path.extname(pathToFile).slice(1);
  const parsed = parse(data, dataType);
  return parsed;
};

const buildTree = (segmentBefore, segmentAfter) => {
  const beforeKeys = Object.keys(segmentBefore);
  const afterKeys = Object.keys(segmentAfter);
  const unionKeys = _.union(beforeKeys, afterKeys);
  const tree = unionKeys.flatMap((key) => {
    if (!_.has(segmentAfter, key)) {
      return { key, value: segmentBefore[key], state: 'deleted' };
    }

    if (!_.has(segmentBefore, key)) {
      return { key, value: segmentAfter[key], state: 'added' };
    }

    if (isObject(segmentBefore[key]) && isObject(segmentAfter[key])) {
      return { key, state: 'unchanged', children: buildTree(segmentBefore[key], segmentAfter[key]) };
    }

    if (segmentBefore[key] === segmentAfter[key]) {
      return { key, value: segmentBefore[key], state: 'unchanged' };
    }

    return [
      { key, value: segmentAfter[key], state: 'added' },
      { key, value: segmentBefore[key], state: 'deleted' },
    ];
  });

  return tree;
};

export default (pathToFile1, pathToFile2, formatType) => {
  const before = readFile(pathToFile1);
  const after = readFile(pathToFile2);
  const diffAst = buildTree(before, after);
  const renderedDiff = render(diffAst, formatType);
  return renderedDiff;
};
