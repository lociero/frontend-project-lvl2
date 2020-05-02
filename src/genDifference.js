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

// Сомнения есть по поводу этого решения, но так сократился код.
const makeNode = (key, value, state, children = null) => {
  if (children) {
    return { key, state, children };
  }
  return { key, value, state };
};

const buildTree = (segmentBefore, segmentAfter) => {
  const beforeKeys = Object.keys(segmentBefore);
  const afterKeys = Object.keys(segmentAfter);
  const unionKeys = _.union(beforeKeys, afterKeys);
  const tree = unionKeys.flatMap((key) => {
    if (!_.has(segmentAfter, key)) {
      return makeNode(key, segmentBefore[key], 'deleted');
    }

    if (!_.has(segmentBefore, key)) {
      return makeNode(key, segmentAfter[key], 'added');
    }

    if (isObject(segmentBefore[key]) && isObject(segmentAfter[key])) {
      return makeNode(key, null, 'unchanged', buildTree(segmentBefore[key], segmentAfter[key]));
    }

    if (segmentBefore[key] === segmentAfter[key]) {
      return makeNode(key, segmentBefore[key], 'unchanged');
    }

    return [
      makeNode(key, segmentAfter[key], 'added'),
      makeNode(key, segmentBefore[key], 'deleted'),
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
