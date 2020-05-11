import fs from 'fs';
import path from 'path';

export const readFile = (pathToFile) => fs.readFileSync(pathToFile, 'utf-8');

export const getDataType = (pathToFile) => path.extname(pathToFile).slice(1);
