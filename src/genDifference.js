import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parse from './parsers/index.js';
import isObject from './utils.js';
import render from './formatters/index.js';

const readFile = (pathToFile) => {
  const file = fs.readFileSync(pathToFile, 'utf-8');
  const fileType = path.extname(pathToFile).slice(1);
  const parsed = parse(fileType, file);
  return parsed;
};

const buildTree = (segmentBefore, segmentAfter) => {
  const beforeKeys = Object.keys(segmentBefore);
  const afterKeys = Object.keys(segmentAfter);
  const unionKeys = _.union(beforeKeys, afterKeys); // or [...new Set()]
  const tree = unionKeys.reduce((acc, key) => {
    if (isObject(segmentBefore[key]) && isObject(segmentAfter[key])) {
      const node = {
        key,
        state: 'unchanged',
        children: buildTree(segmentBefore[key], segmentAfter[key]),
      };
      return [...acc, node];
    }

    if (!_.has(segmentAfter, key)) {
      const node = {
        key,
        value: segmentBefore[key],
        state: 'deleted',
      };
      return [...acc, node];
    }

    if (!_.has(segmentBefore, key)) {
      const node = {
        key,
        value: segmentAfter[key],
        state: 'added',
      };
      return [...acc, node];
    }

    if (segmentBefore[key] === segmentAfter[key]) {
      const node = {
        key,
        value: segmentBefore[key],
        state: 'unchanged',
      };
      return [...acc, node];
    }

    // if (segmentBefore[key] !== segmentAfter[key]) {
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
    return [...acc, ...nodes];
    // }
  }, []);

  return tree;
};

export default (pathToFile1, pathToFile2, formatType = 'pretty') => {
  const before = readFile(pathToFile1);
  const after = readFile(pathToFile2);
  const diffAst = buildTree(before, after);
  const renderedDiff = render[formatType](diffAst);
  return renderedDiff;
};
