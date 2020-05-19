import _ from 'lodash';
import parse from './parsers/index.js';
import { readFile, getDataType } from './utils.js';
import render from './formatters/index.js';

const buildTree = (segmentBefore, segmentAfter) => {
  const beforeKeys = Object.keys(segmentBefore);
  const afterKeys = Object.keys(segmentAfter);
  const unionKeys = _.union(beforeKeys, afterKeys);
  const tree = unionKeys.map((key) => {
    if (!_.has(segmentAfter, key)) {
      return { key, value: segmentBefore[key], type: 'deleted' };
    }

    if (!_.has(segmentBefore, key)) {
      return { key, value: segmentAfter[key], type: 'added' };
    }

    if (_.isObject(segmentBefore[key]) && _.isObject(segmentAfter[key])) {
      return { key, type: 'nested', children: buildTree(segmentBefore[key], segmentAfter[key]) };
    }

    if (segmentBefore[key] === segmentAfter[key]) {
      return { key, value: segmentBefore[key], type: 'unchanged' };
    }

    return {
      key, deletedValue: segmentBefore[key], addedValue: segmentAfter[key], type: 'changed',
    };
  });

  return tree;
};

export default (pathToFile1, pathToFile2, formatType) => {
  const before = readFile(pathToFile1);
  const after = readFile(pathToFile2);

  const beforeDataType = getDataType(pathToFile1);
  const beforeParsed = parse(before, beforeDataType);

  const afterDataType = getDataType(pathToFile2);
  const afterParsed = parse(after, afterDataType);

  const diffAst = buildTree(beforeParsed, afterParsed);
  const renderedDiff = render(diffAst, formatType);

  return renderedDiff;
};
