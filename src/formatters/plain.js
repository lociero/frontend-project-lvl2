import _ from 'lodash';
import isObject from '../utils.js';

const stringifyValue = (value) => (isObject(value) ? '[complex value]' : value);

// Прошел часть курса Полиморфизм, знаю, что аргументы должны быть одинаковыми,
// но по-другому не придумал =)
const templates = {
  deleted: (path) => `Property '${path}' was deleted`,
  added: (path, value) => `Property '${path}' was added with value: ${stringifyValue(value)}`,
  changed: (path, pastValue, newValue) => `Property ${path} was changed from ${pastValue} to ${newValue}`,
};

const renderPlain = (ast) => {
  const iter = (tree, path = '', acc = {}) => tree.reduce((result, node) => {
    const {
      key, value, state, children,
    } = node;
    const newPath = path ? `${path}.${key}` : `${key}`;
    if (_.has(node, 'children')) {
      return iter(children, newPath, result);
    }

    if (['deleted', 'added'].includes(state)) {
      // _.has() не подходит из-за особенности структуры аккумулятора (ключи - пути)
      // Напрямую .hasOwnProperty() eslint не пропускает
      if (!Object.prototype.hasOwnProperty.call(result, newPath)) {
        const newAcc = {
          ...result,
          [newPath]: {
            value,
            state,
            string: templates[state](newPath, value),
          },
        };

        return newAcc;
      }
      const pastValue = result[newPath].state === 'deleted'
        ? stringifyValue(result[newPath].value)
        : stringifyValue(value);
      const newValue = result[newPath].state === 'added'
        ? stringifyValue(result[newPath].value)
        : stringifyValue(value);
      const newAcc = {
        ...result,
        [newPath]: {
          string: templates.changed(newPath, pastValue, newValue),
        },
      };

      return newAcc;
    }

    return result;
  }, acc);

  const data = iter(ast);
  return _.map(data, (value) => value.string).join('\n');
};

export default renderPlain;
