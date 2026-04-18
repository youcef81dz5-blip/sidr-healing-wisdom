import { supabase } from "@/integrations/supabase/client";

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
  image?: File | null,
  language: string = "ar"
): Promise<AnalysisResult> {
  const payload: { text?: string; imageBase64?: string; imageMimeType?: string; language?: string } = {
    language,
  };

  if (text) payload.text = text;

  if (image) {
    payload.imageBase64 = await fileToBase64(image);
    payload.imageMimeType = image.type;
  }

  const { data, error } = await supabase.functions.invoke("analyze-condition", { body: payload });

  if (error) {
    throw new Error("Analysis failed, please try again");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as AnalysisResult;
}
