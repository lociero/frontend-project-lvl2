import _ from 'lodash';
import { isObject } from '../utils.js';

const stringifyValue = (value, indent) => {
  if (isObject(value)) {
    return JSON.stringify(value, null, '\n')
      .split('\n')
      .filter(Boolean)
      .map((str, i, arr) => {
        if (i === 0) {
          return str;
        }
        if (i === arr.length - 1) {
          return `${' '.repeat(indent + 2)}${str}`;
        }
        return `${' '.repeat(indent + 6)}${str}`;
      })
      .join('\n')
      .replace(/"/g, '');
  }
  return value;
};

const templates = {
  added: (key, value, indent) => `${' '.repeat(indent + 2)}+ ${key}: ${stringifyValue(value, indent + 2)}`,
  deleted: (key, value, indent) => `${' '.repeat(indent + 2)}- ${key}: ${stringifyValue(value, indent + 2)}`,
  unchanged: (key, value, indent) => `${' '.repeat(indent + 2)}  ${key}: ${stringifyValue(value, indent + 2)}`,
  withChildren: (key, value, indent) => `${' '.repeat(indent + 2)}  ${key}: {\n${value}\n${' '.repeat(indent + 4)}}`,
};

export default (ast) => {
  const iter = (tree, indent = 0) => tree.flatMap((node) => {
    const {
      key, value, deletedValue, addedValue, children, state,
    } = node;
    if (_.has(node, 'children')) {
      return templates.withChildren(key, iter(children, indent + 4), indent);
    }

    if (['added', 'deleted', 'unchanged'].includes(state)) {
      return templates[state](key, value, indent);
    }

    const added = templates.added(key, addedValue, indent);
    const deleted = templates.deleted(key, deletedValue, indent);

    return [added, deleted];
  }).join('\n');

  return `{\n${iter(ast)}\n}`;
};
