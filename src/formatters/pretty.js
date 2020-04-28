import isObject from '../utils.js';

const operations = {
  unchanged: ' ',
  deleted: '-',
  added: '+',
};

const stringifyObj = (obj, indent) => JSON.stringify(obj, null, '\n')
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
  .join('\n');

export default (ast) => {
  const iter = (tree, indent = 0) => tree
    .reduce((acc, {
      key, value, children, state,
    }) => {
      const operation = operations[state];
      const formattedValue = isObject(value) ? stringifyObj(value, indent + 2) : value;
      const formattedChildren = children ? iter(children, indent + 4).trimEnd() : '';
      const result = `${' '.repeat(indent + 2)}${operation} ${key}: ${
        !children ? formattedValue : `{\n${formattedChildren}\n${' '.repeat(indent + 4)}}`
      }\n`;
      return `${acc}${result}`;
    }, '')
    .replace(/"/g, '');
  // const renderedTree = iter(ast);
  return `{\n${iter(ast)}}`;
};
