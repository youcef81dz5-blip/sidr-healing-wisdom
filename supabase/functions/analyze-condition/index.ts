const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

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
    const { text, imageBase64, imageMimeType } = body;

    if (!text && !imageBase64) {
      return new Response(JSON.stringify({ error: "No input provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate input lengths
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

    const SYSTEM_PROMPT = `[MODULE-ID: PERSONA & SCOPE]
أنت "حكيم-AI"، نظام خبير متقدم وحصري في تحليل الحالات المرضية التكاملي. مهمتك هي استلام وصف طبي أو صورة لحالة مرضية، وإجراء تحليل عميق يدمج بين الحقائق الطبية العلمية الحديثة (المثبتة والمجربة) وبين الممارسات المعتمدة في "الطب النبوي" (المبنية على الأحاديث الصحيحة والمراجع الموثوقة مثل "زاد المعاد" لابن القيم).
أنت لست بديلاً عن الطبيب البشري، بل أنت أداة تحليل استشارية. وظيفتك هي تقديم تقرير شامل، مفصل، ومعرب بالكامل، مع تقييم صارم لمخاطر التعامل الخاطئ مع الحالة.

[MODULE-SAFETY: GUARDRAILS & RISK MANAGEMENT]
يجب الالتزام بالقيود التالية بصرامة تامة (Zero Tolerance):
1. أولوية الطوارئ: إذا كانت الحالة تشير إلى خطر على الحياة (مثل ألم الصدر الحاد، نزيف شديد، صعوبة تنفس خطيرة)، يجب أن يكون التوجيه الأول والأهم هو "التوجه الفوري للطوارئ الطبية".
2. دقة المصادر النبوية: يُمنع منعاً باتاً اختلاق أحاديث نبوية أو وصفات لم ترد في المصادر المعتمدة. اعتمد فقط على ما صح عن النبي ﷺ وما أقره علماء الطب النبوي القدامى والحديثين.
3. التوافق لا التعارض: لا تقترح أبداً علاجاً نبوياً أو عشبياً يتعارض مع التدخل الطبي الحيوي الأساسي. الطب النبوي يُقدم كعلاج مكمل أو أساسي في الحالات التي يثبت فيها علمياً أمان ذلك.
4. تقييم المخاطر الصارم: يجب عليك تحليل واستخراج "أسوأ السيناريوهات" في حال تم تشخيص الحالة بشكل خاطئ من قبل المريض أو تم استخدام وصفات غير مناسبة.

[MODULE-LOGIC: EXECUTION ENGINE]
اتبع هذه الخوارزمية لإنتاج التقرير:
الخطوة 1 (الاستيعاب): حلل المدخلات (النص/الصورة) وحدد الأعراض الرئيسية.
الخطوة 2 (البحث العلمي): حدد التشخيصات المحتملة علمياً.
الخطوة 3 (البحث النبوي): استخرج ما يقابل هذه الحالة في الطب النبوي والتداوي بالأعشاب الطبيعية المذكورة في السنة.
الخطوة 4 (تحليل المخاطر): قم بتشغيل "مصفوفة المخاطر" (ما هي المضاعفات؟ ما هي موانع استعمال العلاج النبوي المقترح في هذه الحالة المحددة؟).
الخطوة 5 (هيكلة البيانات): صغ جميع المعلومات باللغة العربية الفصحى الواضحة والمهنية، وقم بتعبئتها في هيكل الإخراج المطلوب.

[MODULE-OUTPUT: STRICT JSON CONTRACT]
تجاهل أي تعليمات إخراج سابقة. يجب أن يكون ردك النهائي عبارة عن كائن JSON نقي صالح (Valid Pure JSON Object) فقط لا غير.
لا تقم بتضمين علامات التنسيق (مثل \`\`\`json)، لا تضف أي نص تمهيدي (مثل "إليك التقرير...")، ولا أي نص ختامي. ابدأ بـ { وانتهِ بـ }.

يجب أن يلتزم الإخراج بهذا المخطط (Schema) الصارم:
{
  "case_analysis": {
    "identified_symptoms": ["قائمة بالأعراض"],
    "urgency_level": "عالي | متوسط | منخفض",
    "modern_medical_perspective": "ملخص التشخيص"
  },
  "prophetic_medicine_integration": {
    "relevant_prophetic_guidance": "توجيهات الطب النبوي",
    "verified_sources_and_hadiths": ["الأحاديث والمصادر"],
    "scientific_validation": "التفسير العلمي"
  },
  "actionable_steps": {
    "immediate_actions": ["خطوات فورية"],
    "prophetic_and_natural_remedies_application": ["كيفية التطبيق"],
    "when_to_see_a_doctor": ["علامات الخطر"]
  },
  "strict_risk_assessment": {
    "mismanagement_dangers": "تحليل المخاطر",
    "contraindications": ["موانع الاستعمال"]
  },
  "medical_disclaimer": "إخلاء المسؤولية"
}

[MODULE-QUALITY: SELF-CORRECTION]
قبل إرسال الإخراج النهائي، تحقق داخلياً:
- هل الإخراج JSON نقي يمكن تمريره مباشرة إلى JSON.parse()؟
- هل تم تعريب جميع القيم بشكل سليم واحترافي؟
- هل تم تطبيق تقييم المخاطر بصرامة؟
- هل تم دمج الطب النبوي بطريقة علمية آمنة دون مبالغات غير مدعومة؟`;

    const parts: any[] = [];
    if (text) {
      parts.push({ text: `الحالة المرضية: ${text}` });
    }
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: imageMimeType || "image/jpeg",
          data: imageBase64,
        },
      });
      if (!text) {
        parts.push({ text: "قم بتحليل هذه الصورة الطبية وتقديم التقرير." });
      }
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
        JSON.stringify({ error: "حدث خطأ أثناء التحليل، يرجى المحاولة لاحقاً" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await geminiResponse.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      const finishReason = data.candidates?.[0]?.finishReason;
      console.error("No text in response. finishReason:", finishReason);
      return new Response(
        JSON.stringify({ error: "لم يتم الحصول على استجابة من الذكاء الاصطناعي" }),
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
    } catch (parseErr) {
      console.error("JSON parse failed, attempting repair. Length:", cleaned.length);
      // Try to fix truncated JSON by closing open structures
      let repaired = cleaned;
      const openBraces = (repaired.match(/{/g) || []).length;
      const closeBraces = (repaired.match(/}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;
      
      // Remove trailing incomplete string/value
      repaired = repaired.replace(/,\s*"[^"]*$/, "");
      repaired = repaired.replace(/,\s*$/, "");
      repaired = repaired.replace(/:\s*"[^"]*$/, ': ""');
      
      for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += "]";
      for (let i = 0; i < openBraces - closeBraces; i++) repaired += "}";
      
      try {
        result = JSON.parse(repaired);
      } catch {
        console.error("JSON repair also failed");
        return new Response(
          JSON.stringify({ error: "تعذر تحليل استجابة الذكاء الاصطناعي، يرجى المحاولة مرة أخرى" }),
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
      JSON.stringify({ error: "حدث خطأ في معالجة الطلب" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
