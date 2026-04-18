import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import sidrLogo from "@/assets/logo.png";
import { Camera, Send, Loader2, Leaf, X, BookOpen, HelpCircle, Shield, Info, Heart, Menu, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeCondition, AnalysisResult } from "@/lib/gemini";
import AnalysisResults from "@/components/AnalysisResults";
import WelcomeScreen from "@/components/WelcomeScreen";
import FollowUpQuestions, { PatientContext } from "@/components/FollowUpQuestions";
import EmergencyAlert from "@/components/EmergencyAlert";
import ShareResults from "@/components/ShareResults";
import { ThemeToggle, LanguageToggle } from "@/components/SettingsToggles";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getConditions } from "@/lib/content";

const EMERGENCY_KEYWORDS_BY_LANG: Record<string, string[]> = {
  ar: [
    "ألم صدر", "ألم في الصدر", "ضيق تنفس", "صعوبة تنفس", "نزيف شديد",
    "فقدان وعي", "تشنجات", "إغماء", "سكتة", "جلطة", "لا أستطيع التنفس",
    "نزيف لا يتوقف", "ألم شديد في الصدر",
  ],
  en: [
    "chest pain", "severe chest", "shortness of breath", "can't breathe", "cannot breathe",
    "heavy bleeding", "uncontrolled bleeding", "loss of consciousness", "unconscious",
    "seizure", "stroke", "heart attack",
  ],
  fr: [
    "douleur thoracique", "douleur à la poitrine", "essoufflement", "je ne peux pas respirer",
    "saignement abondant", "perte de conscience", "convulsions", "évanouissement", "AVC", "crise cardiaque",
  ],
};

export default function Index() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "ar").split("-")[0];
  const [accepted, setAccepted] = useState(() => localStorage.getItem("sidr_accepted") === "true");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("sidr_accepted", "true");
    setAccepted(true);
  };

  if (!accepted) {
    return <WelcomeScreen onAccept={handleAccept} />;
  }

  const handleImage = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const checkEmergency = (inputText: string): boolean => {
    const lower = inputText.trim().toLowerCase();
    const keywords = EMERGENCY_KEYWORDS_BY_LANG[lang] || EMERGENCY_KEYWORDS_BY_LANG.ar;
    return keywords.some((kw) => lower.includes(kw.toLowerCase()));
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) {
      toast({ title: t("home.needSymptoms"), variant: "destructive" });
      return;
    }
    if (text.trim() && checkEmergency(text)) {
      setShowEmergency(true);
      return;
    }
    setShowFollowUp(true);
  };

  const runAnalysis = async (patientContext?: PatientContext) => {
    setShowFollowUp(false);
    setLoading(true);
    setResult(null);

    let enrichedText = text;
    if (patientContext) {
      const parts: string[] = [];
      const labelMap: Record<string, Record<string, string>> = {
        ar: { gender: "الجنس", age: "العمر", loc: "موقع الألم", duration: "المدة", severity: "الشدة", chronic: "أمراض مزمنة", meds: "أدوية حالية", pregnant: "حامل أو مرضع", header: "معلومات إضافية عن المريض" },
        en: { gender: "Gender", age: "Age", loc: "Pain location", duration: "Duration", severity: "Severity", chronic: "Chronic diseases", meds: "Current medications", pregnant: "Pregnant or breastfeeding", header: "Additional patient info" },
        fr: { gender: "Sexe", age: "Âge", loc: "Localisation de la douleur", duration: "Durée", severity: "Sévérité", chronic: "Maladies chroniques", meds: "Médicaments actuels", pregnant: "Enceinte ou allaitante", header: "Informations supplémentaires sur le patient" },
      };
      const L = labelMap[lang] || labelMap.ar;
      if (patientContext.gender) parts.push(`${L.gender}: ${patientContext.gender}`);
      if (patientContext.ageGroup) parts.push(`${L.age}: ${patientContext.ageGroup}`);
      if (patientContext.painLocation) parts.push(`${L.loc}: ${patientContext.painLocation}`);
      if (patientContext.duration) parts.push(`${L.duration}: ${patientContext.duration}`);
      if (patientContext.severity) parts.push(`${L.severity}: ${patientContext.severity}`);
      if (patientContext.chronicDiseases.length > 0)
        parts.push(`${L.chronic}: ${patientContext.chronicDiseases.join(", ")}`);
      if (patientContext.currentMedications) parts.push(`${L.meds}: ${patientContext.currentMedications}`);
      if (patientContext.isPregnant) parts.push(L.pregnant);

      if (parts.length > 0) {
        enrichedText = `${text}\n\n--- ${L.header} ---\n${parts.join("\n")}`;
      }
    }

    try {
      const res = await analyzeCondition(enrichedText, image, lang);
      setResult(res);
    } catch (err: any) {
      toast({ title: t("common.error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setText("");
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setShowFollowUp(false);
  };

  const menuItems = [
    { icon: BookOpen, label: t("nav.herbs"), path: "/herbs" },
    { icon: Library, label: t("nav.books"), path: "/books" },
    { icon: Heart, label: t("nav.conditions"), path: "/conditions" },
    { icon: HelpCircle, label: t("nav.faq"), path: "/faq" },
    { icon: Info, label: t("nav.about"), path: "/about" },
    { icon: Shield, label: t("nav.privacy"), path: "/privacy" },
  ];

  const conditions = getConditions();

  return (
    <div className="min-h-screen bg-background">
      {showEmergency && (
        <EmergencyAlert onDismiss={() => {
          setShowEmergency(false);
          setShowFollowUp(true);
        }} />
      )}

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={sidrLogo} alt={t("app.name")} className="h-8 w-8 rounded-lg object-contain" />
            <h1 className="font-heading text-2xl font-bold text-gradient-primary">{t("app.name")}</h1>
          </div>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
                <Menu className="h-5 w-5" />
              </Button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute end-0 top-full mt-1 z-50 w-52 card-elevated p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {menuItems.map((item) => (
                      <button
                        key={item.path}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground rounded-md hover:bg-muted transition-colors text-start"
                        onClick={() => { setShowMenu(false); navigate(item.path); }}
                      >
                        <item.icon className="h-4 w-4 text-primary" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 pb-32 space-y-6">
        {!result && !loading && !showFollowUp && (
          <>
            <div className="text-center space-y-2 py-4">
              <div className="mx-auto h-24 w-24 glow-primary">
                <img src={sidrLogo} alt={t("app.name")} className="h-full w-full object-contain" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">{t("home.heroTitle")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {t("home.heroSubtitle")}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-sm font-bold text-foreground">{t("home.commonConditions")}</h3>
              <div className="grid grid-cols-3 gap-2">
                {conditions.slice(0, 6).map((c) => (
                  <button
                    key={c.id}
                    className="card-elevated p-3 text-center hover:border-primary/30 transition-colors"
                    onClick={() => navigate(`/conditions/${c.id}`)}
                  >
                    <span className="text-xl block mb-1">{c.emoji}</span>
                    <span className="text-[10px] text-foreground font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links — herbs, books, faq */}
            <div className="grid grid-cols-3 gap-2">
              <button className="card-elevated p-3 flex flex-col items-center gap-1.5 hover:border-primary/30 transition-colors" onClick={() => navigate("/herbs")}>
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-medium text-center leading-tight">{t("nav.herbs")}</span>
              </button>
              <button className="card-elevated p-3 flex flex-col items-center gap-1.5 hover:border-primary/30 transition-colors" onClick={() => navigate("/books")}>
                <Library className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-medium text-center leading-tight">{t("nav.books")}</span>
              </button>
              <button className="card-elevated p-3 flex flex-col items-center gap-1.5 hover:border-primary/30 transition-colors" onClick={() => navigate("/faq")}>
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-medium text-center leading-tight">{t("nav.faq")}</span>
              </button>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-[10px] text-muted-foreground leading-relaxed">{t("home.imageNotice")}</p>
            </div>
          </>
        )}

        {showFollowUp && (
          <FollowUpQuestions
            onComplete={(ctx) => runAnalysis(ctx)}
            onSkip={() => runAnalysis()}
          />
        )}

        {result && (
          <>
            <AnalysisResults result={result} />
            <ShareResults result={result} />
            <div className="text-center">
              <Button variant="outline" onClick={resetAll} className="gap-2">
                <Leaf className="h-4 w-4" />
                {t("home.newAnalysis")}
              </Button>
            </div>
          </>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">{t("home.analyzing")}</p>
            <p className="text-[10px] text-muted-foreground">{t("home.analyzingSub")}</p>
          </div>
        )}
      </main>

      {!showFollowUp && (
        <div className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-lg px-4 py-3 space-y-2">
            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} alt="preview" className="h-16 w-16 rounded-lg object-cover border" />
                <button onClick={removeImage} className="absolute -top-1.5 -end-1.5 rounded-full bg-destructive p-0.5">
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("home.inputPlaceholder")}
                className="min-h-[44px] max-h-[120px] resize-none bg-muted/50 border-0 text-sm font-body"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
              />
              <Button size="icon" variant="ghost" onClick={() => fileRef.current?.click()} disabled={loading}>
                <Camera className="h-5 w-5" />
              </Button>
              <Button size="icon" onClick={handleSubmit} disabled={loading || (!text.trim() && !image)}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
