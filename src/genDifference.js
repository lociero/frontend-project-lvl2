import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers/index.js';
import isObject from './utils.js';
import render from './formatters/index.js';

const readFile = (pathToFile) => fs.readFileSync(pathToFile, 'utf-8');

const buildTree = (segmentBefore, segmentAfter) => {
  const beforeKeys = Object.keys(segmentBefore);
  const afterKeys = Object.keys(segmentAfter);
  const unionKeys = _.union(beforeKeys, afterKeys);
  const tree = unionKeys.map((key) => {
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

    return {
      key,
      deletedValue: segmentBefore[key],
      addedValue: segmentAfter[key],
      state: 'changed',
    };
  });

  return tree;
};

export default (pathToFile1, pathToFile2, formatType) => {
  const before = readFile(pathToFile1);
  const after = readFile(pathToFile2);

  const beforeDataType = path.extname(pathToFile1).slice(1);
  const beforeParsed = parse(before, beforeDataType);

  const afterDataType = path.extname(pathToFile2).slice(1);
  const afterParsed = parse(after, afterDataType);

  const diffAst = buildTree(beforeParsed, afterParsed);
  const renderedDiff = render(diffAst, formatType);

  return renderedDiff;
};
