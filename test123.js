const _ = require('lodash');

const isObject = (value) => typeof value === 'object' && !Array.isArray(value);

const beforeParsed = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting6: {
      key: 'value',
    },
  },
  group1: {
    baz: 'bas',
    foo: 'bar',
    nest: {
      key: 'value',
    },
  },
  group2: {
    abc: 12345,
  },
};

const afterParsed = {
  common: {
    follow: false,
    setting1: 'Value 1',
    setting3: {
      key: 'value',
    },
    setting4: 'blah blah',
    setting5: {
      key5: 'value5',
    },
    setting6: {
      key: 'value',
      ops: 'vops',
    },
  },

  group1: {
    foo: 'bar',
    baz: 'bars',
    nest: 'str',
  },

  group3: {
    fee: 100500,
  },
};

const parseAst = (before, after) => {
  const iter = (segmentBefore, segmentAfter, acc = []) => {
    // const segmentBeforeKeys = Object.keys(segmentBefore);
    const newAcc = _.reduce(
      segmentBefore,
      (result, value, key) => {
        // console.log(result);
        // Обрабатываем глубоко вложенные объекты и рекурсивно проходим по ключам
        if (isObject(value) && isObject(segmentAfter[key])) {
          const newKey = {
            key,
            state: 'unchanged',
            children: iter(value, segmentAfter[key]),
          };
          return [...result, newKey];
        }

        // Обрабатываем удаленные свойства
        // Если свойства - объекты, нет смысла проходить глубже, они уже обработаны выше
        if (!_.has(segmentAfter, key)) {
          const newKey = {
            key,
            value,
            state: 'deleted',
          };
          return [...result, newKey];
        }

        // Обрабатываем неизмененные свойства
        if (value === segmentAfter[key]) {
          const newKey = {
            key,
            value,
            state: 'unchanged',
          };
          return [...result, newKey];
        }

        // Обрабатываем измененные свойства
        if (value !== segmentAfter[key]) {
          const nodes = [
            {
              key,
              value: segmentAfter[key],
              state: 'added',
            },
            {
              key,
              value,
              state: 'deleted',
            },
          ];
          return [...result, ...nodes];
        }
        return result;
      },
      acc,
    );

    const newAccAfter = _.reduce(
      segmentAfter,
      (result, value, key) => {
        // Обрабатываем добавленные свойства
        if (!_.has(segmentBefore, key)) {
          const newKey = {
            key,
            value,
            state: 'added',
          };
          return [...result, newKey];
        }
        return result;
      },
      acc,
    );
    return [...newAcc, ...newAccAfter];
    // return newAcc;
  };
  return iter(before, after);
};

const parsedAst = parseAst(beforeParsed, afterParsed);
console.log(JSON.stringify(parsedAst, null, 2).length);
console.log(JSON.stringify(parsedAst, null, 2));

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

const render = (ast, indent = 0) => ast.reduce((acc, node) => {
  const { key, value, children } = node;
  // const formattedValue = value;
  const operation = operations[node.state];
  const formattedValue = isObject(value) ? stringifyObj(value, indent + 2) : value;
  const formattedChildren = children ? render(children, indent + 4).trimEnd() : '';
  const result = `${' '.repeat(indent + 2)}${operation} ${key}: ${
    !children ? formattedValue : `{\n${formattedChildren}\n${' '.repeat(indent + 4)}}`
  }\n`;
  return `${acc}${result}`;
}, '');

const rendered = render(parsedAst);
console.log(`{\n${rendered.replace(/"/g, '')}}`);
