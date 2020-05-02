import yaml from 'js-yaml';
import iniParse from './ini.js';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: iniParse,
};

export default (data, type) => parsers[type](data);
