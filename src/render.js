import isObject from './utils.js';

const operations = {
  unchanged: ' ',
  deleted: '-',
  added: '+',
};

const stringifyObj = (obj, indent = 0) => JSON.stringify(obj, null, '\n')
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

const render = (tree) => {
  const renderRecursive = (ast, indent = 0) => ast
    .reduce((acc, node) => {
      const { key, value, children } = node;
      // const formattedValue = value;
      const operation = operations[node.state];
      const formattedValue = isObject(value) ? stringifyObj(value, indent + 2) : value;
      const formattedChildren = children ? renderRecursive(children, indent + 4).trimEnd() : '';
      const result = `${' '.repeat(indent + 2)}${operation} ${key}: ${
        !children ? formattedValue : `{\n${formattedChildren}\n${' '.repeat(indent + 4)}}`
      }\n`;
      return `${acc}${result}`;
    }, '')
    .replace(/"/g, '');
  const renderedTree = renderRecursive(tree);
  return `{\n${renderedTree}}`;
};

export default render;
