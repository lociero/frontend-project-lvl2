import renderPretty from './pretty.js';
import renderPlain from './plain.js';

const formatters = {
  pretty: renderPretty,
  plain: renderPlain,
  json: JSON.stringify,
};

export default (type, ast) => formatters[type](ast);
