import yaml from 'js-yaml';
import iniParse from './ini.js';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: iniParse,
};

export default (type, data) => parsers[type](data);
