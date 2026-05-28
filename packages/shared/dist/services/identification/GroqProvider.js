const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export class GroqProvider {
    name;
    apiKey;
    model;
    _available;
    constructor(config) {
        this.name = config.name || 'groq';
        this.apiKey = config.apiKey || '';
        this.model = config.model || 'llama-3.2-11b-vision-preview';
        this._available = !!this.apiKey;
    }
    isAvailable() {
        return this._available;
    }
    async identify(imageBase64) {
        if (!this._available)
            return null;
        const prompt = `Eres un experto ornitólogo y sabio ancestral. Analiza esta imagen de un ave y devuelve ÚNICAMENTE un objeto JSON (sin markdown, sin explicaciones) con esta estructura exacta:
{
  "nombre_cientifico": "string",
  "nombre_espanol": "string",
  "nombre_nativo": "string (opcional, en lengua indígena colombiana si aplica)",
  "lengua": "string (opcional, ej: Wayuu, Nasa Yuwe, etc)",
  "significado_ancestral": "string (significado cultural/espiritual)",
  "rol_cosmovision": "string (rol en la cosmovisión indígena)",
  "comportamientos": "string (comportamiento del ave)",
  "habitat": "string",
  "zona_geografica": "string (región de Colombia donde habita)",
  "es_migratoria": boolean,
  "periodo_migracion": "string (opcional)",
  "historias_ancestrales": ["string"],
  "refranes": ["string"],
  "ecosistema_riesgo": "bajo" | "medio" | "alto",
  "confidence": number (0-1),
  "ecosystem_risk": "bajo" | "medio" | "alto"
}`;
        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                {
                                    type: 'image_url',
                                    image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
                                },
                            ],
                        },
                    ],
                    temperature: 0.3,
                    max_completion_tokens: 2048,
                    top_p: 1,
                    stream: false,
                }),
            });
            if (!response.ok) {
                const errText = await response.text().catch(() => '');
                console.warn(`[GroqProvider] API error ${response.status}: ${errText}`);
                return null;
            }
            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content)
                return null;
            const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
            const parsed = JSON.parse(cleaned);
            return {
                bird: {
                    id: '',
                    nombre_cientifico: parsed.nombre_cientifico || '',
                    nombre_espanol: parsed.nombre_espanol,
                    nombre_nativo: parsed.nombre_nativo,
                    lengua: parsed.lengua,
                    significado_ancestral: parsed.significado_ancestral,
                    rol_cosmovision: parsed.rol_cosmovision,
                    comportamientos: parsed.comportamientos,
                    habitat: parsed.habitat,
                    zona_geografica: parsed.zona_geografica,
                    es_migratoria: parsed.es_migratoria || false,
                    periodo_migracion: parsed.periodo_migracion,
                    historias_ancestrales: parsed.historias_ancestrales || [],
                    refranes: parsed.refranes || [],
                    ecosistema_riesgo: parsed.ecosistema_riesgo || 'bajo',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                confidence: parsed.confidence || 0.5,
                ecosystem_risk: parsed.ecosistema_riesgo || 'bajo',
            };
        }
        catch (err) {
            console.warn(`[GroqProvider] Error:`, err);
            return null;
        }
    }
}
