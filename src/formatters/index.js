import renderPretty from './pretty.js';
import renderPlain from './plain.js';

const formatters = {
  pretty: renderPretty,
  plain: renderPlain,
  json: JSON.stringify,
};

export default (ast, type = 'pretty') => formatters[type](ast);
