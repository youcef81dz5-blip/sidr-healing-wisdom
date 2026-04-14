import { Leaf, Shield, Heart, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onAccept: () => void;
}

export default function WelcomeScreen({ onAccept }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-10">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center glow-primary">
          <Leaf className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-heading text-4xl font-bold text-gradient-primary">سِدر</h1>
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          حكيمك الطبيعي — يجمع بين حكمة الطب النبوي ودقة الطب الحديث
        </p>
      </div>

      {/* Features */}
      <div className="w-full max-w-sm space-y-3 mb-8">
        {[
          { icon: Heart, text: "تحليل ذكي للأعراض بالنص أو الصورة", color: "text-primary" },
          { icon: BookOpen, text: "علاجات مبنية على السنة النبوية الصحيحة", color: "text-primary" },
          { icon: Shield, text: "تقييم مخاطر صارم وتحذيرات واضحة", color: "text-primary" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 card-elevated p-3">
            <f.icon className={`h-5 w-5 ${f.color} shrink-0`} />
            <span className="text-sm text-foreground">{f.text}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="w-full max-w-sm rounded-xl border-2 border-warning/40 bg-warning/5 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-warning shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-heading text-sm font-bold text-foreground">تنبيه مهم</h3>
            <p className="text-xs leading-relaxed text-foreground/80">
              هذا التطبيق يقدم <strong>معلومات أولية استرشادية فقط</strong> ولا يُقدّم تشخيصًا طبيًا نهائيًا. 
              لا يُغني استخدامه عن مراجعة الطبيب المختص. المعلومات المقدّمة مبنية على مصادر موثوقة لكنها 
              قد لا تناسب حالتك الخاصة.
            </p>
            <p className="text-xs leading-relaxed text-foreground/80">
              في حالات الطوارئ (ألم صدر حاد، صعوبة تنفس، نزيف شديد)، توجّه فورًا لأقرب مستشفى.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onAccept} className="w-full max-w-sm h-12 text-base font-bold">
        فهمتُ وأوافق على الشروط
      </Button>

      <p className="text-[10px] text-muted-foreground text-center mt-3 max-w-xs">
        بالضغط على "فهمتُ وأوافق"، أنت تقرّ بأنك قرأت وفهمت أن هذا التطبيق أداة مساعدة وليس بديلاً عن الاستشارة الطبية المتخصصة.
      </p>
    </div>
  );
}
