import _ from 'lodash';

const indents = {
  depthIndent: 4,
  keyIndent: 2,
  bracketIndent: 4,
};

const getSpaces = (type, depth) => {
  const spaces = {
    key: ' '.repeat(depth * indents.depthIndent + indents.keyIndent),
    bracket: ' '.repeat(depth * indents.depthIndent + indents.bracketIndent),
  };
  return spaces[type];
};

const stringifyValue = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }
  return Object
    .entries(value)
    .map(([key, val]) => (
      `{\n${getSpaces('key', depth + 1)}  ${key}: ${stringifyValue(val, depth + 1)}\n${getSpaces('bracket', depth)}}`
    )).join('\n');
};

const templates = {
  added({ key, value, depth }) {
    return `${getSpaces('key', depth)}+ ${key}: ${stringifyValue(value, depth)}`;
  },
  deleted({ key, value, depth }) {
    return `${getSpaces('key', depth)}- ${key}: ${stringifyValue(value, depth)}`;
  },
  unchanged({ key, value, depth }) {
    return `${getSpaces('key', depth)}  ${key}: ${stringifyValue(value, depth)}`;
  },
  changed({
    key, depth, addedValue, deletedValue,
  }) {
    const added = this.added({ key, value: addedValue, depth });
    const deleted = this.deleted({ key, value: deletedValue, depth });
    return [added, deleted].join('\n');
  },
  nested({
    key, depth, children, formatter,
  }) {
    return `${getSpaces('key', depth)}  ${key}: {\n${formatter(children, depth + 1)}\n${getSpaces('bracket', depth)}}`;
  },
};


const renderPretty = (ast, depth = 0) => ast.map(({ type, ...node }) => {
  const options = {
    ...node,
    depth,
    formatter: renderPretty,
  };
  return templates[type](options);
}).join('\n');


export default (ast) => `{\n${renderPretty(ast)}\n}`;
