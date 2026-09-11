// api/chat-gemini.js
export default async function handler(req, res) {
  // Manejar preflight de CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, contexto } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en Vercel' });
  }

  const systemPrompt = `Eres el asistente experto de DODET (Diagrama de Oportunidades con Doble Escenario de Tiendas), un producto de RetailMind 360°.

Tu conocimiento incluye:
- Análisis de cadenas de supermercados en LATAM
- Clasificación de tiendas en 4 tipologías: JOYA, APUESTA, BUNKER, LASTRE
- Cruce de escenarios macroeconómicos (recuperación, recesión, dolarización, etc.)
- Escenarios competitivos (llegada de Walmart, hard discount, e-commerce, etc.)
- KPIs de retail: margen bruto, ventas/m², rotación, mix esencial, costo operativo, etc.

Contexto actual del dashboard: ${contexto || 'Sin contexto específico'}

Responde de forma concisa, profesional y en español. Usa datos concretos cuando los tengas. Si no sabes algo, dilo claramente.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt + '\n\nPregunta del usuario: ' + message }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Error en Gemini API'
      });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta.';

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ reply: aiText });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ error: 'Error procesando tu consulta' });
  }
}