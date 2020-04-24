import renderJsonLike from './jsonLike.js';
import renderPlain from './plain.js';

export default {
  jsonLike: (ast) => renderJsonLike(ast),
  plain: (ast) => renderPlain(ast),
  json: (ast) => JSON.stringify(ast, null, 2),
};
