import renderPretty from './pretty.js';
import renderPlain from './plain.js';

export default {
  pretty: (ast) => renderPretty(ast),
  plain: (ast) => renderPlain(ast),
  json: (ast) => JSON.stringify(ast, null, 2),
};
