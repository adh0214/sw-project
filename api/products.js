const { getProducts } = require('../serverless/kca');

module.exports = async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const items = await getProducts(request.query.q || '');
    response.status(200).json({ source: '한국소비자원 참가격 OpenAPI', items });
  } catch (error) {
    response.status(error.status || 502).json({ error: error.message });
  }
};
