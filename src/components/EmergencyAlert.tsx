import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onDismiss: () => void;
}

const EMERGENCY_SYMPTOMS = [
  "ألم شديد في الصدر أو ضيق مفاجئ",
  "صعوبة حادة في التنفس",
  "نزيف شديد لا يتوقف",
  "فقدان الوعي أو التشنجات",
  "ألم رأس مفاجئ وشديد غير معتاد",
  "شلل مفاجئ أو صعوبة في الكلام",
];

export default function EmergencyAlert({ onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-[100] bg-destructive/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="mx-auto h-20 w-20 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="h-10 w-10 text-white" />
        </div>

        <h1 className="font-heading text-3xl font-bold text-white">
          ⚠ حالة طوارئ محتملة
        </h1>

        <p className="text-white/90 text-sm leading-relaxed">
          بناءً على الأعراض التي أدخلتها، قد تكون حالتك تستدعي تدخلاً طبيًا عاجلاً.
          <strong> لا تعتمد على هذا التطبيق في حالات الطوارئ.</strong>
        </p>

        <div className="bg-white/15 rounded-xl p-4 text-right space-y-2">
          <h3 className="text-white font-bold text-sm">أعراض تستدعي الطوارئ:</h3>
          <ul className="space-y-1.5">
            {EMERGENCY_SYMPTOMS.map((s, i) => (
              <li key={i} className="text-white/85 text-xs flex gap-2 items-start">
                <span className="text-white mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <a href="tel:911" className="block">
            <Button className="w-full h-14 text-lg bg-white text-destructive hover:bg-white/90 font-bold">
              <Phone className="h-5 w-5 ml-2" />
              اتصل بالطوارئ الآن
            </Button>
          </a>
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
            onClick={onDismiss}
          >
            الأعراض ليست طارئة — متابعة التحليل
          </Button>
        </div>
      </div>
    </div>
  );
}
