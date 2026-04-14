import { useState, useRef } from "react";
import { Camera, Upload, Send, Loader2, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeCondition, AnalysisResult } from "@/lib/gemini";
import AnalysisResults from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      toast({ title: "يرجى وصف الأعراض أو إرفاق صورة", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeCondition(text, image);
      setResult(res);
    } catch (err: any) {
      toast({ title: "حدث خطأ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-2 px-4 py-3">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="font-heading text-2xl font-bold text-gradient-primary">سِدر</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 pb-32 space-y-6">
        {/* Hero */}
        {!result && !loading && (
          <div className="text-center space-y-2 py-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 glow-primary">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">حكيمك الطبيعي</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              صِف أعراضك أو أرفق صورة، وسنقدم لك تحليلاً طبياً متكاملاً يجمع بين الطب الحديث والطب النبوي
            </p>
          </div>
        )}

        {/* Results */}
        {result && <AnalysisResults result={result} />}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">جارٍ التحليل...</p>
          </div>
        )}
      </main>

      {/* Input Bar */}
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
    </div>
  );
}
