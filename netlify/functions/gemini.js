// 교사 AI 호출 (Netlify 서버 함수). API 키는 서버 환경 변수에만 있고 브라우저로 나가지 않습니다.
// 환경 변수: GEMINI_API_KEY, TEACHER_PIN, (선택) GEMINI_MODEL

const json = (code, obj) => ({
  statusCode: code,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(obj)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST 요청만 받을 수 있어요.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return json(400, { error: '요청 형식이 잘못됐어요.' }); }

  const pinExpected = process.env.TEACHER_PIN;
  if (!pinExpected) return json(500, { error: '서버에 TEACHER_PIN이 설정되어 있지 않아요.' });
  if (String(body.pin || '') !== pinExpected) return json(401, { error: 'PIN이 맞지 않아요.' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return json(500, { error: '서버에 GEMINI_API_KEY가 설정되어 있지 않아요.' });

  const prompt = String(body.prompt || '').slice(0, 20000);
  if (!prompt) return json(400, { error: '내용이 비어 있어요.' });

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return json(502, { error: (data.error && data.error.message) || ('Gemini 오류 ' + r.status) });
    const parts = ((data.candidates || [])[0] || {}).content;
    const text = ((parts && parts.parts) || []).map(p => p.text || '').join('').trim();
    return json(200, { text });
  } catch (e) {
    return json(502, { error: 'Gemini 서버에 연결하지 못했어요: ' + e.message });
  }
};
