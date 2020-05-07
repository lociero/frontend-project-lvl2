import _ from 'lodash';
import fs from 'fs';
import path from 'path';

export const isObject = (value) => _.isObject(value) && !_.isArray(value);

export const readFile = (pathToFile) => fs.readFileSync(pathToFile, 'utf-8');

export const getDataType = (pathToFile) => path.extname(pathToFile).slice(1);
