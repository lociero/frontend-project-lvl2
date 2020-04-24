import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parsers from './parsers/parsers.js';
import isObject from './utils.js';
import render from './formatters/render.js';

const readFiles = (path1, path2) => {
  const file1 = fs.readFileSync(path1, 'utf-8');
  const file2 = fs.readFileSync(path2, 'utf-8');
  const fileType1 = path.extname(path1);
  const fileType2 = path.extname(path2);
  const parsed1 = parsers[fileType1](file1);
  const parsed2 = parsers[fileType2](file2);
  return { file1: parsed1, file2: parsed2 };
};

const parseAst = (before, after) => {
  const iter = (segmentBefore, segmentAfter, acc = []) => {
    const parsedFirstPart = _.reduce(
      segmentBefore,
      (result, value, key) => {
        // Обрабатываем глубоко вложенные объекты и рекурсивно проходим по ключам
        if (isObject(value) && isObject(segmentAfter[key])) {
          const node = {
            key,
            state: 'unchanged',
            children: iter(value, segmentAfter[key]),
          };
          return [...result, node];
        }
        // Обрабатываем удаленные свойства
        // Если свойства - объекты, нет смысла проходить глубже, они уже обработаны выше
        if (!_.has(segmentAfter, key)) {
          const node = {
            key,
            value,
            state: 'deleted',
          };
          return [...result, node];
        }
        // Обрабатываем неизмененные свойства
        if (value === segmentAfter[key]) {
          const node = {
            key,
            value,
            state: 'unchanged',
          };
          return [...result, node];
        }
        // Обрабатываем измененные свойства
        // if (value !== segmentAfter[key]) {
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
        // }
      },
      acc,
    );

    const parsedSecondPart = _.reduce(
      segmentAfter,
      (result, value, key) => {
        // Обрабатываем добавленные свойства
        if (!_.has(segmentBefore, key)) {
          const node = {
            key,
            value,
            state: 'added',
          };
          return [...result, node];
        }
        return result;
      },
      acc,
    );
    return [...parsedFirstPart, ...parsedSecondPart];
  };
  return iter(before, after);
};

export default (fileToPath1, fileToPath2, formatType = 'jsonLike') => {
  const { file1: before, file2: after } = readFiles(fileToPath1, fileToPath2);
  const parsedAst = parseAst(before, after);
  const renderedDiff = render[formatType](parsedAst);
  return renderedDiff;
};
