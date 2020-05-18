import _ from 'lodash';

const stringifyValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const templates = {
  deleted: ({ path }) => `Property '${path}' was deleted`,
  added: ({ path, value }) => (
    `Property '${path}' was added with value: ${stringifyValue(value)}`
  ),
  changed: ({ path, deletedValue, addedValue }) => (
    `Property ${path} was changed from ${stringifyValue(deletedValue)} to ${stringifyValue(addedValue)}`
  ),
  nested: ({ path, children, formatter }) => (
    formatter(children, path)
  ),
  unchanged: () => null,
};


const plainFormatter = (ast, path = '') => ast.map(({ key, type, ...node }) => {
  const newPath = path ? `${path}.${key}` : `${key}`;
  const options = {
    path: newPath,
    ...node,
    formatter: plainFormatter,
  };
  return templates[type](options);
}).filter(Boolean).join('\n');


export default plainFormatter;
