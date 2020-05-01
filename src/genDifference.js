import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers/index.js';
import isObject from './utils.js';
import render from './formatters/index.js';

const readFile = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf-8');
  const dataType = path.extname(pathToFile).slice(1);
  const parsed = parse(dataType, data);
  return parsed;
};

const buildTree = (segmentBefore, segmentAfter) => {
  const beforeKeys = Object.keys(segmentBefore);
  const afterKeys = Object.keys(segmentAfter);
  const unionKeys = _.union(beforeKeys, afterKeys); // or [...new Set()]
  const tree = unionKeys.flatMap((key) => {
    const segmentsHaveValues = _.has(segmentBefore, key) && _.has(segmentAfter, key);
    const valuesAreObjects = isObject(segmentBefore[key]) && isObject(segmentAfter[key]);

    if (segmentsHaveValues && valuesAreObjects) {
      const node = {
        key,
        state: 'unchanged',
        children: buildTree(segmentBefore[key], segmentAfter[key]),
      };
      return node;
    }

    if (!_.has(segmentAfter, key)) {
      const node = {
        key,
        value: segmentBefore[key],
        state: 'deleted',
      };
      return node;
    }

    if (!_.has(segmentBefore, key)) {
      const node = {
        key,
        value: segmentAfter[key],
        state: 'added',
      };
      return node;
    }

    if (segmentBefore[key] === segmentAfter[key]) {
      const node = {
        key,
        value: segmentBefore[key],
        state: 'unchanged',
      };
      return node;
    }

    const nodes = [
      {
        key,
        value: segmentAfter[key],
        state: 'added',
      },
      {
        key,
        value: segmentBefore[key],
        state: 'deleted',
      },
    ];
    return nodes;
  });

  return tree;
};

export default (pathToFile1, pathToFile2, formatType) => {
  const before = readFile(pathToFile1);
  const after = readFile(pathToFile2);
  const diffAst = buildTree(before, after);
  const renderedDiff = render(formatType, diffAst);
  return renderedDiff;
};
