import { ArrowRight, Shield, BookOpen, Heart, Users, Mail } from "lucide-react";
import sidrLogo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="font-heading text-lg font-bold">من نحن</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6 pb-8">
        {/* Logo & Intro */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-24 w-24 glow-primary">
            <img src={sidrLogo} alt="سِدر" className="h-full w-full object-contain" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gradient-primary">سِدر</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            منصة عربية إسلامية تجمع بين حكمة الطب النبوي ودقة الطب الحديث، بتقنيات الذكاء الاصطناعي المتقدمة.
          </p>
        </div>

        {/* Mission */}
        <div className="card-elevated p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-bold">رسالتنا</h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">
            نؤمن بأن الطب النبوي كنز عظيم يستحق أن يُقدَّم بأسلوب علمي معاصر وموثّق. 
            هدفنا تمكين المسلم من الاستفادة من هذا الإرث مع عدم إهمال الطب الحديث، 
            في منصة آمنة وسهلة الاستخدام.
          </p>
        </div>

        {/* Values */}
        <div className="space-y-3">
          {[
            { icon: BookOpen, title: "الموثوقية الشرعية", desc: "نعتمد فقط على الأحاديث الصحيحة والحسنة مع التخريج الكامل، ونفصل بوضوح بين ما ثبت في السنة وبين التجارب الشعبية." },
            { icon: Shield, title: "السلامة أولاً", desc: "نوضح الموانع والتداخلات الدوائية، ونحذر من الأعراض الخطيرة. لا نقدم تشخيصًا بل معلومات استرشادية." },
            { icon: Users, title: "فريق متعدد التخصصات", desc: "نسعى للتعاون مع متخصصين في العلوم الشرعية والطب الحديث والأعشاب لضمان جودة المحتوى ودقته." },
          ].map((v, i) => (
            <div key={i} className="card-elevated p-4 flex gap-3">
              <v.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">{v.title}</h4>
                <p className="text-xs text-foreground/75 leading-relaxed mt-1">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sources */}
        <div className="card-elevated p-5 space-y-3">
          <h3 className="font-heading font-bold text-sm">مصادرنا الأساسية</h3>
          <ul className="space-y-1.5 text-xs text-foreground/80">
            <li>📖 "زاد المعاد في هدي خير العباد" — الإمام ابن القيم الجوزية</li>
            <li>📖 "الطب النبوي" — الإمام ابن القيم</li>
            <li>📖 صحيح البخاري وصحيح مسلم (الأحاديث المتعلقة بالتداوي)</li>
            <li>🔬 الدراسات العلمية المحكّمة من PubMed وGoogle Scholar</li>
            <li>🏥 إرشادات منظمة الصحة العالمية حول الطب التقليدي والتكميلي</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="card-elevated p-5 space-y-3 text-center">
          <h3 className="font-heading font-bold text-sm">تواصل معنا</h3>
          <p className="text-xs text-muted-foreground">لديك اقتراح أو ملاحظة؟ نسعد بتواصلك</p>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              info@sidr-app.com
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            تطبيق سِدر أداة استرشادية فقط ولا يُقدّم تشخيصًا طبيًا. جميع المعلومات لأغراض تعليمية عامة ولا تغني عن مراجعة الطبيب المختص. الإصدار 1.0
          </p>
        </div>
      </main>
    </div>
  );
}
