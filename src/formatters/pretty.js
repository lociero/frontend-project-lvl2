import _ from 'lodash';

const stringifyValue = (value, indent) => {
  if (!_.isObject(value)) {
    return value;
  }
  return Object
    .entries(value)
    .map(([key, val]) => (
      `{\n${' '.repeat(indent + 6)}${key}: ${val}\n${' '.repeat(indent + 2)}}`
    )).join('\n');
};

const templates = {
  added({ key, value, indent }) {
    return `${' '.repeat(indent + 2)}+ ${key}: ${stringifyValue(value, indent + 2)}`;
  },
  deleted({ key, value, indent }) {
    return `${' '.repeat(indent + 2)}- ${key}: ${stringifyValue(value, indent + 2)}`;
  },
  unchanged({ key, value, indent }) {
    return `${' '.repeat(indent + 2)}  ${key}: ${stringifyValue(value, indent + 2)}`;
  },
  changed({
    key, indent, addedValue, deletedValue,
  }) {
    const added = this.added({ key, value: addedValue, indent });
    const deleted = this.deleted({ key, value: deletedValue, indent });
    return [added, deleted].join('\n');
  },
  nested({
    key, indent, children, formatter,
  }) {
    return `${' '.repeat(indent + 2)}  ${key}: {\n${formatter(children, indent + 4)}\n${' '.repeat(indent + 4)}}`;
  },
};


const renderPretty = (ast, indent = 0) => ast.map(({ type, ...node }) => {
  const options = {
    ...node,
    indent,
    formatter: renderPretty,
  };
  return templates[type](options);
}).join('\n');


export default (ast) => `{\n${renderPretty(ast)}\n}`;
