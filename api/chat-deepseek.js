// api/chat-deepseek.js
export default async function handler(req, res) {
  // Solo permitimos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, contexto } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Lee la clave desde las variables de entorno de Vercel
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // System prompt especializado para DODET
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
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('DeepSeek API error:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'Error en DeepSeek API' 
      });
    }

    if (data.choices && data.choices[0]) {
      return res.status(200).json({ 
        reply: data.choices[0].message.content,
        usage: data.usage
      });
    } else {
      return res.status(500).json({ error: 'Respuesta vacía de DeepSeek' });
    }
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return res.status(500).json({ error: 'Error procesando tu consulta' });
  }
}