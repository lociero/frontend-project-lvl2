import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parsers from './parsers/parsers.js';
import isObject from './utils.js';
import render from './formatters/render.js';

const readFiles = (path1, path2) => {
  const file1 = fs.readFileSync(path1, 'utf-8');
  const file2 = fs.readFileSync(path2, 'utf-8');
  const fileType1 = path.extname(path1);
  const fileType2 = path.extname(path2);
  const parsed1 = parsers[fileType1](file1);
  const parsed2 = parsers[fileType2](file2);
  return { file1: parsed1, file2: parsed2 };
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
  const { file1: before, file2: after } = readFiles(pathToFile1, pathToFile2);
  const diffAst = buildTree(before, after);
  const renderedDiff = render[formatType](diffAst);
  return renderedDiff;
};
