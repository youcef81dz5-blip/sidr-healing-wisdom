const API_KEY = "AIzaSyAP6ve2RrdcLOglZRxMp04KD-d0gthYaGk";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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

export interface AnalysisResult {
  case_analysis: {
    identified_symptoms: string[];
    urgency_level: string;
    modern_medical_perspective: string;
  };
  prophetic_medicine_integration: {
    relevant_prophetic_guidance: string;
    verified_sources_and_hadiths: string[];
    scientific_validation: string;
  };
  actionable_steps: {
    immediate_actions: string[];
    prophetic_and_natural_remedies_application: string[];
    when_to_see_a_doctor: string[];
  };
  strict_risk_assessment: {
    mismanagement_dangers: string;
    contraindications: string[];
  };
  medical_disclaimer: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeCondition(
  text: string,
  image?: File | null
): Promise<AnalysisResult> {
  const parts: any[] = [];

  if (text) {
    parts.push({ text: `الحالة المرضية: ${text}` });
  }

  if (image) {
    const base64 = await fileToBase64(image);
    parts.push({
      inline_data: {
        mime_type: image.type,
        data: base64,
      },
    });
    if (!text) {
      parts.push({ text: "قم بتحليل هذه الصورة الطبية وتقديم التقرير." });
    }
  }

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`خطأ في الاتصال بالذكاء الاصطناعي: ${err}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("لم يتم الحصول على استجابة من الذكاء الاصطناعي");
  }

  // Clean potential markdown wrapping
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```json?\s*/, "").replace(/```\s*$/, "");
  }

  try {
    return JSON.parse(cleaned) as AnalysisResult;
  } catch {
    throw new Error("خطأ في تحليل استجابة الذكاء الاصطناعي");
  }
}
