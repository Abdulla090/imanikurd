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
    <div className="fixed inset-0 bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 flex flex-col pt-16 sm:pt-20 pb-4 px-2 sm:px-4 max-w-5xl mx-auto w-full h-full overflow-hidden">
        {/* Header - Compact */}
        <div className="shrink-0 text-center py-2 sm:py-4 flex flex-col items-center justify-center relative z-10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-arabic text-xl shadow-lg">
              ☪
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-naskh text-foreground">
              یاریدەدەری ئیسلامی
            </h1>
          </div>

          {/* Language Toggle - Absolute on desktop, relative on mobile */}
          <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 mt-2 sm:mt-0 flex bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setLanguage("ku")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${language === "ku"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              کوردی
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${language === "en"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Chat Area - Flex Grow to take remaining space */}
        <div className="flex-1 min-h-0 glass-card rounded-2xl border border-border/50 shadow-xl flex flex-col overflow-hidden relative">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="w-12 h-12 text-primary/50 mb-4 animate-pulse" />
                <h2 className="font-naskh text-2xl mb-2 text-foreground">
                  سڵاو لەسەرتان و ڕەحمەتی خوا 👋
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  من یاریدەدەرێکی ئیسلامیم. دەتوانیت هەر پرسیارێک دەربارەی ئیسلام، قورئان و حەدیس هەبێت لێم بپرسیت.
                </p>

                {/* Suggested Questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(question);
                        // Optional: auto-send
                      }}
                      className="px-4 py-3 bg-card hover:bg-primary/5 border border-border/50 hover:border-primary/30 rounded-xl text-sm transition-all text-right flex items-center justify-between group"
                    >
                      <span>{question}</span>
                      <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-sm ${msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border border-border/50 rounded-tl-none"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <div
                      className="text-sm leading-relaxed prose prose-sm max-w-none break-words dark:prose-invert [&_strong]:text-primary"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-end animate-fade-in">
                <div className="bg-card border border-border/50 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">نووسین...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-border/50 bg-background/80 backdrop-blur-lg">
            <div className="flex gap-2 relative max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="پرسیارەکەت بنووسە..."
                className="flex-1 px-4 py-3 sm:py-4 pr-12 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-base"
                dir="auto"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-9 w-9 rounded-lg shrink-0"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:-scale-x-100" />}
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-70">
              ئەمە ژیری دەستکردە، بۆ فەتوا پرس بە مامۆستای ئایینی بکە.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
