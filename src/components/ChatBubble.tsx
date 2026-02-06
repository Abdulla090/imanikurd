import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Sparkles, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Format markdown to styled HTML
const formatMessage = (text: string): string => {
  let formatted = text;

  // Format headers (## Title) - green and bold
  formatted = formatted.replace(/^###\s*(.+)$/gm, '<h4 class="chat-heading">$1</h4>');
  formatted = formatted.replace(/^##\s*(.+)$/gm, '<h3 class="chat-heading">$1</h3>');
  formatted = formatted.replace(/^#\s*(.+)$/gm, '<h2 class="chat-heading">$1</h2>');

  // Format bold text **text** - green and bold
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="chat-bold">$1</strong>');

  // Format italic text *text*
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Format Quran verse references [Surah:Verse] - styled badge
  formatted = formatted.replace(/\[([^\]]+)\]/g, '<span class="chat-verse">[$1]</span>');

  // Format bullet points
  formatted = formatted.replace(/^[-•]\s*(.+)$/gm, '<li>$1</li>');

  // Wrap consecutive li elements in ul
  formatted = formatted.replace(/(<li>.*?<\/li>\s*)+/gs, '<ul class="chat-list">$&</ul>');

  // Format numbered lists
  formatted = formatted.replace(/^\d+[.)]\s*(.+)$/gm, '<li>$1</li>');

  // Format double line breaks as paragraphs
  formatted = formatted.replace(/\n\n+/g, '</p><p class="chat-paragraph">');

  // Format single line breaks
  formatted = formatted.replace(/\n/g, '<br/>');

  return `<div class="chat-content"><p class="chat-paragraph">${formatted}</p></div>`;
};

// Hardcoded fallback API key for Gemini 3 Flash Preview
const FALLBACK_API_KEY = "AIzaSyAaWoKBOsns7Yb_BArgwoQQ5tip5KIeMG0";
const DEFAULT_MODEL = "gemini-3-flash-preview";

// Secure API call - priority to localStorage, then env, then fallback
const callGeminiAPI = async (messages: Message[], language: "ku" | "en") => {
  const localKey = localStorage.getItem("IMAN_K_DEV_GEMINI_KEY");
  const localModel = localStorage.getItem("IMAN_K_DEV_GEMINI_MODEL") || DEFAULT_MODEL;
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Priority: localStorage > env > fallback
  const apiKey = localKey || envKey || FALLBACK_API_KEY;
  const model = localModel || DEFAULT_MODEL;

  const systemPrompt = language === 'en'
    ? `You are a knowledgeable, warm, and helpful Islamic assistant. You help users with questions about Islam, Quran, Hadith, and Islamic practices.

IMPORTANT RESPONSE GUIDELINES:
1. Give DETAILED and COMPREHENSIVE answers - not too short! Explain thoroughly.
2. Use **bold** for important terms like Allah, Prophet names, key Islamic concepts
3. Use ## for section titles/headers when organizing longer answers
4. When quoting Quran, use: **[Surah Name:Verse Number]** "the verse text"
5. When quoting Hadith, use: **Hadith:** "hadith text" - **Source**
6. Use bullet points (-) for lists
7. Start with a warm Islamic greeting like "Assalamu Alaikum"
8. End with a kind closing like "May Allah guide you" or "Insha'Allah"
9. Always cite sources when available
10. Be educational, respectful, and encouraging

EXAMPLE FORMAT:
## Title Here
**Important Term** is explained like this...
- Point one
- Point two
**[Al-Baqarah:255]** "Allah - there is no deity except Him..."`

    : `تۆ یاریدەدەرێکی ئیسلامی گەرم و یاریدەدەرت. یارمەتی بەکارهێنەران دەدەیت لە پرسیارەکان دەربارەی ئیسلام، قورئان، حەدیس و کردارە ئیسلامییەکان.

زۆر گرنگ: هەمیشە وەڵامەکانت بە عەرەبی "السلام عليكم ورحمة الله وبركاته" دەست پێ بکە، بەڵام تەواوی وەڵامەکەت بە کوردی سۆرانی بنووسە!

ڕێنمایی گرنگی وەڵامدانەوە:
1. وەڵامی تەواو و وردبینانە بدە - نەک کورت! باش ڕوونی بکەرەوە
2. **سەوزی تاریک ** بەکاربهێنە بۆ زاراوە گرنگەکان وەک خوا، ناوی پێغەمبەران، چەمکە ئیسلامییە سەرەکییەکان
3. ## بەکاربهێنە بۆ سەردێڕ و ناونیشانی بەشەکان کاتێک وەڵامێکی درێژ دەدەیت
4. کاتێک ئایەتی قورئان دەهێنیتەوە: **[ناوی سورە:ژمارەی ئایەت]** "دەقی ئایەت"
5. کاتێک حەدیس دەهێنیتەوە: **حەدیس:** "دەقی حەدیس" - **سەرچاوە**
6. خاڵی (-) بەکاربهێنە بۆ لیستەکان
7. کۆتایی بە کوردی بهێنە وەک "خوا ڕێنمایت بکات" یان "ئینشاءاللە"
8. هەمیشە سەرچاوەکان بخەرەوە
9. فێرکارانە، ڕێزلێنانەوە و هاندەرانە بە

نموونەی فۆرمات:
السلام عليكم ورحمة الله وبركاته

## سەردێڕ لێرە
**زاراوەی گرنگ** بەم شێوەیە ڕوون دەکرێتەوە...
- خاڵی یەکەم
- خاڵی دووەم
**[البقرە:٢٥٥]** "اللە - هیچ خوایەک نییە جگە لە ئەو..."

خوا ڕێنمایت بکات`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...messages.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }))
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4096,
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
};

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "بەخێربێیت بۆ ئیمان، من یارمەتیدەری ئیسلامیم، دەتوانم وەڵامی پرسیارەکانت بدەمەوە لەسەر بابەتە ئاینییەکان، چۆن دەتوانم یارمەتیت بدەم؟"
    }
  ]);
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

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await callGeminiAPI([...messages, userMessage], language);

      const assistantMessage: Message = {
        role: "assistant",
        content: responseText,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: language === "ku"
          ? "ببورە، هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵبدەوە."
          : "Sorry, an error occurred. Please try again.",
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
    <>
      {/* Floating Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-2xl flex items-center justify-center group"
            style={{
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4), 0 0 0 4px rgba(16, 185, 129, 0.1)",
            }}
          >
            <MessageCircle className="w-7 h-7" />
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-2 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
              یاریدەدەری ئیمان ☪️
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Overlay */}
      <AnimatePresence mode="sync">
        {isOpen && (
          <>
            {/* Backdrop - no blur for performance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "linear" }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
              style={{ willChange: "opacity" }}
            />

            {/* Chat Container - GPU optimized */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{
                type: "tween",
                duration: 0.2,
                ease: [0.32, 0.72, 0, 1]
              }}
              className="fixed z-50 bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col
                         /* Mobile: Full screen with safe area */
                         inset-4
                         /* Desktop: Large centered modal */
                         sm:inset-[5%] sm:max-w-[1000px] sm:max-h-[850px] sm:m-auto"
              style={{
                willChange: "transform, opacity",
                transform: "translateZ(0)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-l from-primary via-emerald-600 to-accent text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                    ☪️
                  </div>
                  <div className="text-right">
                    <h3 className="font-naskh text-lg font-bold">ئیمان</h3>
                    <p className="text-sm opacity-80">پرسیارەکانت بپرسە</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language Toggle */}
                  <button
                    onClick={() => setLanguage(language === "ku" ? "en" : "ku")}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title={language === "ku" ? "Switch to English" : "گۆڕین بۆ کوردی"}
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(language === "ku" ? "تەواوی نامەکان دەسڕیتەوە؟" : "Clear all messages?")) {
                        setMessages([]);
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-red-500/40 flex items-center justify-center transition-colors"
                    title={language === "ku" ? "سڕینەوەی نامەکان" : "Clear Chat"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Using Gemini 3 Flash Preview indicator */}
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 text-[10px] text-center border-b border-emerald-500/20 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {language === "ku" ? "ئیمان - زیرەکی دەستکرد" : "Iman AI - Islamic Assistant"}
              </div>

              {/* Language Indicator */}
              <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-center gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full transition-colors ${language === "ku" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  کوردی ☀️
                </span>
                <span className={`px-3 py-1 rounded-full transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  English 🇬🇧
                </span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-naskh text-xl mb-2 text-foreground">
                      سڵاو لەسەرتان! 👋
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                      من ئیمانم، یاریدەدەری زیرەکی تۆ
                    </p>

                    {/* Suggested Questions */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(question)}
                          className="px-3 py-2 bg-muted hover:bg-primary/20 rounded-xl text-xs transition-colors border border-border hover:border-primary/30"
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
                    style={{ animationDuration: "0.1s" }}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl overflow-hidden ${msg.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none border border-border"
                        }`}
                    >
                      {msg.role === "assistant" ? (
                        <div
                          className="text-sm leading-relaxed prose prose-sm max-w-none break-words overflow-wrap-anywhere [&_ul]:pr-4 [&_li]:break-words [&_p]:break-words"
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
                  <div className="flex justify-end animate-fade-in" style={{ animationDuration: "0.1s" }}>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-2 border border-border">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">چاوەڕوان بە...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="پرسیارت بنووسە..."
                    className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm transition-all"
                    dir="rtl"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="h-12 w-12 rounded-xl shrink-0 bg-gradient-to-br from-primary to-accent hover:opacity-90"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence >
    </>
  );
}
