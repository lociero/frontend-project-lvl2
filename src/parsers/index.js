import yaml from 'js-yaml';
import iniParse from './ini.js';

export default {
  '.json': (file) => JSON.parse(file),
  '.yml': (file) => yaml.safeLoad(file),
  '.ini': (file) => iniParse(file),
};
