// api/chat.js (Vercel Serverless Function)
export default async function handler(req, res) {
  // Permitir solo peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt, dashboardData } = req.body;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const promptConContexto = `
    Eres el asistente analítico inteligente del portal RetailMind 360°.
    Responde a las preguntas del usuario utilizando ÚNICAMENTE los datos actuales del dashboard que se te proporcionan a continuación.
    Si la respuesta no se puede deducir de los datos, indícalo cortésmente.

    --- DATOS DEL DASHBOARD (KPIs / MESH) ---
    ${JSON.stringify(dashboardData, null, 2)}
    ----------------------------------------

    Pregunta del usuario: ${prompt}
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptConContexto }] }]
      })
    });

    const data = await response.json();
    const respuestaIA = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ respuesta: respuestaIA });
  } catch (error) {
    console.error("Error en Serverless Function:", error);
    return res.status(500).json({ error: "Error al procesar la consulta con la IA" });
  }
}
