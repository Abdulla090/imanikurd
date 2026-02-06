import { useState, useRef, useEffect } from "react";
import { Send, Globe, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const formatMessage = (text: string) => {
  let formatted = text;

  // Format bold text with green color
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold">$1</strong>');

  // Format Quran verse references [Surah:Verse]
  formatted = formatted.replace(/\[([^\]]+)\]/g, '<span class="bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">[$1]</span>');

  // Format quotes with italic and accent color
  formatted = formatted.replace(/"([^"]+)"/g, '<q class="block my-2 pr-4 border-r-4 border-primary bg-primary/10 p-3 rounded-lg italic text-foreground">"$1"</q>');

  // Format bullet points
  formatted = formatted.replace(/^[•\-]\s*(.+)$/gm, '<li class="mr-6 mb-1">$1</li>');

  // Wrap consecutive li elements in ul
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\s*)+/g, '<ul class="list-disc my-3 space-y-1">$&</ul>');

  // Format numbered lists
  formatted = formatted.replace(/^\d+\.\s*(.+)$/gm, '<li class="mr-6 mb-1">$1</li>');

  // Format line breaks
  formatted = formatted.replace(/\n\n/g, '</p><p class="mb-3">');
  formatted = formatted.replace(/\n/g, '<br/>');

  return `<p class="mb-3">${formatted}</p>`;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"ku" | "en">("ku");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Hardcoded fallback API key for Gemini 3 Flash Preview
    const FALLBACK_API_KEY = "AIzaSyAaWoKBOsns7Yb_BArgwoQQ5tip5KIeMG0";
    const DEFAULT_MODEL = "gemini-3-flash-preview";

    try {
      const localKey = localStorage.getItem("IMAN_K_DEV_GEMINI_KEY");
      const localModel = localStorage.getItem("IMAN_K_DEV_GEMINI_MODEL") || DEFAULT_MODEL;
      const envKey = import.meta.env.VITE_GEMINI_API_KEY;

      // Priority: localStorage > env > fallback
      const apiKey = localKey || envKey || FALLBACK_API_KEY;
      const model = localModel || DEFAULT_MODEL;

      const systemPrompt = language === 'en'
        ? `You are a knowledgeable Islamic assistant. Always start with "Assalamu Alaikum wa Rahmatullahi wa Barakatuh" in Arabic.`
        : `تۆ یاریدەدەرێکی ئیسلامیت کە زانیاریی تەواو دەربارەی ئیسلام، قورئان، حەدیس و کردارە ئیسلامییەکان دەدەیت. زۆر گرنگ: هەمیشە وەڵامەکانت بە عەرەبی "السلام عليكم ورحمة الله وبركاته" دەست پێ بکە، بەڵام تەواوی وەڵامەکەت بە کوردی سۆرانی بنووسە!`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt }] },
              ...messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
              })),
              { role: 'user', parts: [{ text: input }] }
            ],
          }),
        }
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "ببورە، هەڵەیەک ڕوویدا. تکایە دڵنیابەرەوە کە کلیلەکەت ڕاستە و دووبارە هەوڵبدەوە.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "چۆن نوێژ بکەم؟",
    "ڕۆژوو چییە؟",
    "حەج چییە؟",
    "زەکات چۆن دەدرێت؟",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 sm:pt-24 pb-6 sm:pb-8 px-2 sm:px-4 h-screen flex flex-col">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-arabic text-3xl shadow-lg">
                ☪
              </div>
            </div>
            <h1 className="text-3xl font-bold font-naskh text-foreground mb-2">
              یاریدەدەری ئیسلامی
            </h1>
            <p className="text-muted-foreground">
              پرسیارەکانت دەربارەی ئیسلام، قورئان، حەدیس و کردارە ئیسلامییەکان بپرسە
            </p>

            {/* Language Toggle */}
            <div className="mt-4 inline-flex items-center gap-2 bg-muted rounded-xl p-1">
              <button
                onClick={() => setLanguage("ku")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${language === "ku"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span className="text-yellow-500">☀️</span> کوردی
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${language === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                English 🇬🇧
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-naskh text-2xl mb-4 text-foreground">
                    سڵاو لەسەرتان و ڕەحمەتی خوا 👋
                  </p>
                  <p className="text-muted-foreground mb-8">
                    من یاریدەدەرێکی ئیسلامیم، پرسیارەکانت بپرسە
                  </p>

                  {/* Suggested Questions */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(question)}
                        className="px-4 py-2 bg-muted hover:bg-primary/20 rounded-xl text-sm transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} animate-fade-in`}
                  style={{ animationDuration: "0.15s" }}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl overflow-hidden ${msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                      }`}
                  >
                    {msg.role === "assistant" ? (
                      <div
                        className="text-sm leading-relaxed prose prose-sm max-w-none break-words [&_ul]:pr-4 [&_li]:break-words [&_p]:break-words"
                        style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                      />
                    ) : (
                      <p className="text-sm break-words">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-end animate-fade-in" style={{ animationDuration: "0.15s" }}>
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">چاوەڕوان بە...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="پرسیارت بنووسە..."
                  className="flex-1 px-6 py-4 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary outline-none text-base"
                  dir="rtl"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="lg"
                  className="px-8 rounded-xl"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
