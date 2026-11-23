const { getPrices } = require('../serverless/kca');

module.exports = async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const goodId = request.query.goodId;
  if (!goodId) return response.status(400).json({ error: 'goodId가 필요합니다.' });
  try {
    response.status(200).json(await getPrices(goodId));
  } catch (error) {
    response.status(error.status || 502).json({ error: error.message });
  }
};
