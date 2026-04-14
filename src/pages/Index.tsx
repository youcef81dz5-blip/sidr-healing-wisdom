import { useState, useRef, useEffect } from "react";
import { Camera, Upload, Send, Loader2, Leaf, X, BookOpen, HelpCircle, Shield, Info, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeCondition, AnalysisResult } from "@/lib/gemini";
import AnalysisResults from "@/components/AnalysisResults";
import WelcomeScreen from "@/components/WelcomeScreen";
import FollowUpQuestions, { PatientContext } from "@/components/FollowUpQuestions";
import EmergencyAlert from "@/components/EmergencyAlert";
import ShareResults from "@/components/ShareResults";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { commonConditions } from "@/data/commonConditions";

const EMERGENCY_KEYWORDS = [
  "ألم صدر", "ألم في الصدر", "ضيق تنفس", "صعوبة تنفس", "نزيف شديد",
  "فقدان وعي", "تشنجات", "إغماء", "سكتة", "جلطة", "لا أستطيع التنفس",
  "نزيف لا يتوقف", "ألم شديد في الصدر",
];

export default function Index() {
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
    const lower = inputText.trim();
    return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) {
      toast({ title: "يرجى وصف الأعراض أو إرفاق صورة", variant: "destructive" });
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
      if (patientContext.gender) parts.push(`الجنس: ${patientContext.gender}`);
      if (patientContext.ageGroup) parts.push(`العمر: ${patientContext.ageGroup}`);
      if (patientContext.painLocation) parts.push(`موقع الألم: ${patientContext.painLocation}`);
      if (patientContext.duration) parts.push(`المدة: ${patientContext.duration}`);
      if (patientContext.severity) parts.push(`الشدة: ${patientContext.severity}`);
      if (patientContext.chronicDiseases.length > 0 && !patientContext.chronicDiseases.includes("لا يوجد"))
        parts.push(`أمراض مزمنة: ${patientContext.chronicDiseases.join("، ")}`);
      if (patientContext.currentMedications) parts.push(`أدوية حالية: ${patientContext.currentMedications}`);
      if (patientContext.isPregnant) parts.push("حامل أو مرضع");

      if (parts.length > 0) {
        enrichedText = `${text}\n\n--- معلومات إضافية عن المريض ---\n${parts.join("\n")}`;
      }
    }

    try {
      const res = await analyzeCondition(enrichedText, image);
      setResult(res);
    } catch (err: any) {
      toast({ title: "حدث خطأ", description: err.message, variant: "destructive" });
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
    { icon: BookOpen, label: "موسوعة الأعشاب", path: "/herbs" },
    { icon: Heart, label: "حالات شائعة", path: "/conditions" },
    { icon: HelpCircle, label: "أسئلة شائعة", path: "/faq" },
    { icon: Info, label: "من نحن", path: "/about" },
    { icon: Shield, label: "سياسة الخصوصية", path: "/privacy" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency overlay */}
      {showEmergency && (
        <EmergencyAlert onDismiss={() => {
          setShowEmergency(false);
          setShowFollowUp(true);
        }} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-gradient-primary">سِدر</h1>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
              <Menu className="h-5 w-5" />
            </Button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute left-0 top-full mt-1 z-50 w-48 card-elevated p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground rounded-md hover:bg-muted transition-colors"
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
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 pb-32 space-y-6">
        {/* Hero - only show when no result/loading/followup */}
        {!result && !loading && !showFollowUp && (
          <>
            <div className="text-center space-y-2 py-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 glow-primary">
                <Leaf className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">حكيمك الطبيعي</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                صِف أعراضك أو أرفق صورة، وسنقدم لك تحليلاً طبياً متكاملاً يجمع بين الطب الحديث والطب النبوي
              </p>
            </div>

            {/* Quick Access - Common Conditions */}
            <div className="space-y-2">
              <h3 className="font-heading text-sm font-bold text-foreground">حالات شائعة</h3>
              <div className="grid grid-cols-3 gap-2">
                {commonConditions.slice(0, 6).map((c) => (
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

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2">
              <button className="card-elevated p-3 flex items-center gap-2 hover:border-primary/30 transition-colors" onClick={() => navigate("/herbs")}>
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">موسوعة الأعشاب</span>
              </button>
              <button className="card-elevated p-3 flex items-center gap-2 hover:border-primary/30 transition-colors" onClick={() => navigate("/faq")}>
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">أسئلة شائعة</span>
              </button>
            </div>

            {/* Image upload notice */}
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                📸 تحليل الصور يركز على الحالات الجلدية السطحية (طفح، بقع، حب شباب، فطريات). النتيجة تقريبية وليست تشخيصًا.
              </p>
            </div>
          </>
        )}

        {/* Follow-up Questions */}
        {showFollowUp && (
          <FollowUpQuestions
            onComplete={(ctx) => runAnalysis(ctx)}
            onSkip={() => runAnalysis()}
          />
        )}

        {/* Results */}
        {result && (
          <>
            <AnalysisResults result={result} />
            <ShareResults result={result} />
            <div className="text-center">
              <Button variant="outline" onClick={resetAll} className="gap-2">
                <Leaf className="h-4 w-4" />
                تحليل جديد
              </Button>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">جارٍ التحليل الشامل...</p>
            <p className="text-[10px] text-muted-foreground">يتم الجمع بين الطب الحديث والطب النبوي</p>
          </div>
        )}
      </main>

      {/* Input Bar - hide during follow-up */}
      {!showFollowUp && (
        <div className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-lg px-4 py-3 space-y-2">
            {imagePreview && (
              <div className="relative inline-block">
                <img src={imagePreview} alt="معاينة" className="h-16 w-16 rounded-lg object-cover border" />
                <button onClick={removeImage} className="absolute -top-1.5 -left-1.5 rounded-full bg-destructive p-0.5">
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="صِف الأعراض أو المرض..."
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
