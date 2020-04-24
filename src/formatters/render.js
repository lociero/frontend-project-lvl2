import renderJsonLike from './jsonLike.js';
import renderPlain from './plain.js';

export default {
  json: (ast) => renderJsonLike(ast),
  plain: (ast) => renderPlain(ast),
};
