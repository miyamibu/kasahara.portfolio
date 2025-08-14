// Vercel Serverless Function: /api/fmp-quote
// 使い方: /api/fmp-quote?symbol=3350.T など
// 必要な環境変数: FMP_API_KEY
export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

    const { symbol } = req.query || {};
    if (!symbol) {
      return res.status(400).json({ error: 'symbol required' });
    }
    // 最低限のバリデーション（英数字・記号の一部のみ）
    const ok = /^[A-Z0-9:._-]{1,24}$/i.test(String(symbol));
    if (!ok) return res.status(400).json({ error: 'invalid symbol' });

    const apiKey = process.env.FMP_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'FMP_API_KEY not set' });

    const url = `https://financialmodelingprep.com/api/v3/quote/${encodeURIComponent(symbol)}?apikey=${apiKey}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: `FMP ${r.status}` });
    const data = await r.json();

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
