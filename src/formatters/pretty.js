import _ from 'lodash';

const stringifyValue = (value, indent) => {
  if (_.isObject(value)) {
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
  added(key, value, indent) {
    return `${' '.repeat(indent + 2)}+ ${key}: ${stringifyValue(value, indent + 2)}`;
  },
  deleted(key, value, indent) {
    return `${' '.repeat(indent + 2)}- ${key}: ${stringifyValue(value, indent + 2)}`;
  },
  unchanged(key, value, indent) {
    return `${' '.repeat(indent + 2)}  ${key}: ${stringifyValue(value, indent + 2)}`;
  },
  changed(key, value, indent, addedValue, deletedValue) {
    const added = this.added(key, addedValue, indent);
    const deleted = this.deleted(key, deletedValue, indent);
    return [added, deleted].join('\n');
  },
  changedObj(key, value, indent) {
    return `${' '.repeat(indent + 2)}  ${key}: {\n${value}\n${' '.repeat(indent + 4)}}`;
  },
};

export default (ast) => {
  const iter = (tree, indent = 0) => tree.map((node) => {
    const {
      key, type, value, deletedValue, addedValue, children, state,
    } = node;
    if (type === 'object') {
      return templates.changedObj(key, iter(children, indent + 4), indent);
    }

    return templates[state](key, value, indent, addedValue, deletedValue);
  }).join('\n');

  return `{\n${iter(ast)}\n}`;
};
