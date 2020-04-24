import _ from 'lodash';
import isObject from '../utils.js';

const stringifyValue = (value) => (isObject(value) ? '[complex value]' : value);

const renderPlain = (ast) => {
  const acc = {};
  const iter = (tree, path = '') => {
    tree.forEach(({
      key, value, state, children,
    }) => {
      const newPath = path ? `${path}.${key}` : `${key}`;
      const templates = {
        deleted: `Property '${newPath}' was deleted`,
        added: `Property '${newPath}' was added with value: ${
          isObject(value) ? '[complex value]' : value
        }`,
        changed: (pastValue, newValue) => (
          `Property ${newPath} was changed from ${pastValue} to ${newValue}`
        ),
      };
      if (children) {
        iter(children, newPath);
        return;
      }
      // state unchanged в plain формате нам не нужен
      if (['deleted', 'added'].includes(state)) {
        if (!acc[newPath]) {
          acc[newPath] = {
            value,
            state,
            string: templates[state],
          };
        } else {
          const pastValue = acc[newPath].state === 'deleted'
            ? stringifyValue(acc[newPath].value)
            : stringifyValue(value);
          const newValue = acc[newPath].state === 'added'
            ? stringifyValue(acc[newPath].value)
            : stringifyValue(value);
          acc[newPath] = {
            string: templates.changed(pastValue, newValue),
          };
        }
      }

      // return [newPath, isObject(value) ? '[complex value]' : `${value}`, string];
    });
    return _.reduce(acc, (result, value) => `${result}\n${value.string}`, '').trim();
  };
  return iter(ast);
};

export default renderPlain;
