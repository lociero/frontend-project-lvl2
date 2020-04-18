import yaml from 'js-yaml';

const parsers = {
  '.json': (file) => JSON.parse(file),
  '.yml': (file) => yaml.safeLoad(file),
};

export default parsers;
