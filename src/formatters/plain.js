import _ from 'lodash';

const stringifyValue = (value) => (_.isObject(value) ? '[complex value]' : value);

// Прошел часть курса Полиморфизм, знаю, что аргументы должны быть одинаковыми,
// но по-другому не придумал =)
const templates = {
  deleted: (path) => `Property '${path}' was deleted`,
  added: (path, value) => (
    `Property '${path}' was added with value: ${stringifyValue(value)}`
  ),
  changed: (path, value, deletedValue, addedValue) => (
    `Property ${path} was changed from ${stringifyValue(deletedValue)} to ${stringifyValue(addedValue)}`
  ),
  unchanged: () => null,
};

export default (ast) => {
  const iter = (tree, path = '') => tree.flatMap((node) => {
    const {
      key, value, deletedValue, addedValue, children, state,
    } = node;
    const newPath = path ? `${path}.${key}` : `${key}`;
    if (_.has(node, 'children')) {
      return iter(children, newPath);
    }

    return templates[state](newPath, value, deletedValue, addedValue);
  });

  return iter(ast).filter(Boolean).join('\n');
};
