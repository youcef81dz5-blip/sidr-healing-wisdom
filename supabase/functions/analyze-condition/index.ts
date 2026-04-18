const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const LANG_INSTRUCTIONS: Record<string, { name: string; urgency: string; disclaimerHint: string }> = {
  ar: { name: "Arabic (العربية الفصحى)", urgency: "use one of: عالي | متوسط | منخفض", disclaimerHint: "اكتب إخلاء المسؤولية بالعربية" },
  en: { name: "English", urgency: "use one of: High | Medium | Low", disclaimerHint: "Write the medical disclaimer in English" },
  fr: { name: "French (Français)", urgency: "utilisez l'un de: Élevé | Moyen | Faible", disclaimerHint: "Rédigez la clause de non-responsabilité médicale en français" },
};

function buildSystemPrompt(language: string): string {
  const cfg = LANG_INSTRUCTIONS[language] || LANG_INSTRUCTIONS.ar;
  return `[MODULE-ID: PERSONA & SCOPE]
You are "Hakim-AI", an advanced expert system specialized in integrative analysis of medical cases. Your task is to receive a medical description or image and produce a deep analysis combining modern evidence-based medicine with authentic Prophetic Medicine practices (based on sahih hadiths and trusted references such as Ibn al-Qayyim's "Zad al-Ma'ad").
You are NOT a substitute for a human physician — you are a consultative analysis tool. Your job is to provide a comprehensive, structured report with strict risk assessment.

[MODULE-LANGUAGE: OUTPUT LANGUAGE]
ALL output text MUST be in ${cfg.name}. ${cfg.disclaimerHint}.
For Quranic verses or hadith original Arabic text, you MAY keep the Arabic original and follow with a translation in ${cfg.name} between parentheses.

[MODULE-SAFETY: GUARDRAILS & RISK MANAGEMENT]
Strictly enforce (Zero Tolerance):
1. Emergency priority: if symptoms suggest a life-threatening condition (severe chest pain, heavy bleeding, severe dyspnea), the FIRST and most important guidance must be "seek immediate emergency medical care".
2. Source accuracy: never fabricate hadiths or remedies. Use only what is authenticated in classical and modern Prophetic Medicine references.
3. Compatibility not conflict: never suggest a prophetic/herbal remedy that conflicts with vital conventional medical treatment. Prophetic medicine is presented as complementary, or primary only when scientifically safe.
4. Strict risk assessment: analyze worst-case scenarios for misdiagnosis or misuse of remedies.

[MODULE-LOGIC: EXECUTION ENGINE]
Step 1: Parse inputs (text/image), identify primary symptoms.
Step 2: Determine plausible scientific differential diagnoses.
Step 3: Identify corresponding Prophetic Medicine remedies and authentic herbal natural treatments.
Step 4: Run risk matrix (complications, contraindications of suggested prophetic remedy in this specific case).
Step 5: Structure all information professionally in ${cfg.name} into the required output schema.

[MODULE-OUTPUT: STRICT JSON CONTRACT]
Ignore any prior output instructions. Final response MUST be a single valid pure JSON object — nothing else. No code fences, no preamble, no trailing text. Start with { and end with }.

Schema:
{
  "case_analysis": {
    "identified_symptoms": ["list of symptoms"],
    "urgency_level": "${cfg.urgency}",
    "modern_medical_perspective": "diagnostic summary"
  },
  "prophetic_medicine_integration": {
    "relevant_prophetic_guidance": "prophetic medicine guidance",
    "verified_sources_and_hadiths": ["hadith and sources"],
    "scientific_validation": "scientific explanation"
  },
  "actionable_steps": {
    "immediate_actions": ["immediate steps"],
    "prophetic_and_natural_remedies_application": ["how to apply"],
    "when_to_see_a_doctor": ["red flags"]
  },
  "strict_risk_assessment": {
    "mismanagement_dangers": "risk analysis",
    "contraindications": ["contraindications"]
  },
  "medical_disclaimer": "disclaimer"
}

[MODULE-QUALITY: SELF-CORRECTION]
Before final output, internally verify:
- Output is pure JSON parseable by JSON.parse().
- All values are written in ${cfg.name} (except hadith original Arabic which may remain Arabic with translation).
- Risk assessment was strictly applied.
- Prophetic medicine integrated safely with no unsupported exaggerations.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { text, imageBase64, imageMimeType, language } = body;
    const lang = (typeof language === "string" && ["ar", "en", "fr"].includes(language)) ? language : "ar";

    if (!text && !imageBase64) {
      return new Response(JSON.stringify({ error: "No input provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (text && typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Invalid text input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (text && text.length > 10000) {
      return new Response(JSON.stringify({ error: "Text too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (imageBase64 && imageBase64.length > 20_000_000) {
      return new Response(JSON.stringify({ error: "Image too large" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SYSTEM_PROMPT = buildSystemPrompt(lang);
    const caseLabels: Record<string, string> = {
      ar: "الحالة المرضية",
      en: "Medical case",
      fr: "Cas médical",
    };
    const imageLabels: Record<string, string> = {
      ar: "قم بتحليل هذه الصورة الطبية وتقديم التقرير.",
      en: "Analyze this medical image and produce the report.",
      fr: "Analysez cette image médicale et fournissez le rapport.",
    };

    const parts: any[] = [];
    if (text) parts.push({ text: `${caseLabels[lang]}: ${text}` });
    if (imageBase64) {
      parts.push({
        inline_data: { mime_type: imageMimeType || "image/jpeg", data: imageBase64 },
      });
      if (!text) parts.push({ text: imageLabels[lang] });
    }

    const geminiResponse = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errBody);
      return new Response(
        JSON.stringify({ error: "Analysis failed, please try again" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await geminiResponse.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      const finishReason = data.candidates?.[0]?.finishReason;
      console.error("No text in response. finishReason:", finishReason);
      return new Response(
        JSON.stringify({ error: "AI returned no response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```json?\s*/, "").replace(/```\s*$/, "");
    }

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed, attempting repair. Length:", cleaned.length);
      let repaired = cleaned;
      const openBraces = (repaired.match(/{/g) || []).length;
      const closeBraces = (repaired.match(/}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;
      repaired = repaired.replace(/,\s*"[^"]*$/, "");
      repaired = repaired.replace(/,\s*$/, "");
      repaired = repaired.replace(/:\s*"[^"]*$/, ': ""');
      for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += "]";
      for (let i = 0; i < openBraces - closeBraces; i++) repaired += "}";
      try {
        result = JSON.parse(repaired);
      } catch {
        return new Response(
          JSON.stringify({ error: "Could not parse AI response, please retry" }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Request processing error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
