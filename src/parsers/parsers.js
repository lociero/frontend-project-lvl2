import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.json': (file) => JSON.parse(file),
  '.yml': (file) => yaml.safeLoad(file),
  '.ini': (file) => ini.parse(file),
};

export default parsers;
