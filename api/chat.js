export default async function handler(req, res) {
  // Manejar solicitudes CORS y método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { prompt, dashboardData } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'La clave GEMINI_API_KEY no está configurada en Vercel.' });
  }

  try {
    // CAMBIO AQUÍ: Se actualiza el nombre del modelo
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `Eres el Asistente Analítico Inteligente de RetailMind 360°, especializado en la metodología Retailding.
    Analiza las métricas y datos proporcionados del dashboard y responde las preguntas del usuario de forma ejecutiva, concisa y precisa.
    Datos actuales del Dashboard: ${JSON.stringify(dashboardData)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nPregunta del usuario: ${prompt}` }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error desde Gemini API:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Error en Gemini API' });
    }

    const respuestaTexto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se obtuvo respuesta del modelo.';

    return res.status(200).json({ respuesta: respuestaTexto });
  } catch (error) {
    console.error('Error interno en el servidor:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
