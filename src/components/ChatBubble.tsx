import { useState, useRef, useEffect, useCallback } from "react";
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

// Streaming API call - uses server proxy in production, direct in local dev
const callGeminiAPIStream = async (
  messages: Message[],
  language: "ku" | "en",
  onChunk: (text: string) => void,
) => {
  // Check if there's a locally stored dev key (from SecretKeyPage)
  const localKey = localStorage.getItem("IMAN_K_DEV_GEMINI_KEY");
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;

  // If running locally with a dev key, call Gemini directly (dev only)
  if (localKey || envKey) {
    return callGeminiDirectStream(messages, language, onChunk, localKey || envKey || "");
  }

  // In production: call the secure server-side proxy
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, language, stream: true }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  return processSSEStream(reader, onChunk);
};

// Direct Gemini call (only for local development with personal API key)
const callGeminiDirectStream = async (
  messages: Message[],
  language: "ku" | "en",
  onChunk: (text: string) => void,
  apiKey: string,
) => {
  const MODELS = [
    localStorage.getItem("IMAN_K_DEV_GEMINI_MODEL") || "gemini-3.1-flash-lite-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ];

  const systemPrompt = language === 'en'
    ? `You are a knowledgeable, warm, and helpful Islamic assistant. You help users with questions about Islam, Quran, Hadith, and Islamic practices.
IMPORTANT RESPONSE GUIDELINES:
1. Give DETAILED and COMPREHENSIVE answers. Use **bold** for important terms.
2. Use ## for section titles. Use bullet points (-) for lists.
3. Start with "Assalamu Alaikum". End with "May Allah guide you".
4. Always cite sources when available.`
    : `تۆ یاریدەدەرێکی ئیسلامی گەرم و یاریدەدەرت. وەڵامی تەواو و وردبینانە بدە.
هەمیشە بە "السلام عليكم ورحمة الله وبركاته" دەست پێ بکە. تەواوی وەڵامەکەت بە کوردی سۆرانی بنووسە.
**سەوزی تاریک** بەکاربهێنە بۆ زاراوە گرنگەکان. ## بەکاربهێنە بۆ سەردێڕ.`;

  const requestBody = JSON.stringify({
    contents: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ],
    generationConfig: { temperature: 0.8, maxOutputTokens: 4096 }
  });

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: requestBody,
  };

  // Try each model in order until one works
  let response: Response | null = null;
  for (const model of MODELS) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
      requestOptions
    );
    if (response.ok) {
      console.log(`🤖 Using model: ${model}`);
      break;
    }
    console.warn(`Model ${model} failed (${response.status}), trying next...`);
  }

  if (!response || !response.ok) throw new Error('All models failed');

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  return processSSEStream(reader, onChunk);
};

// Shared SSE stream processor
const processSSEStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (text: string) => void,
) => {
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          // Log which model the server is using (sent as first SSE event)
          if (parsed?.modelUsed) {
            console.log(`🤖 Iman AI using model: ${parsed.modelUsed}`);
            continue;
          }
          const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunk) {
            fullText += chunk;
            onChunk(fullText);
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }

  return fullText || 'Sorry, I could not generate a response.';
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

  // Listen for programmatic open events (from nav links, etc.)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chat-bubble', handleOpen);
    return () => window.removeEventListener('open-chat-bubble', handleOpen);
  }, []);

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

  // Stream a message to the AI and progressively render the response
  const streamMessage = useCallback(async (text: string, currentMessages: Message[]) => {
    const userMessage: Message = { role: "user", content: text };
    const allMessages = [...currentMessages, userMessage];

    // Add user message + empty assistant placeholder
    setMessages([...allMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      await callGeminiAPIStream(
        allMessages,
        language,
        (streamedText) => {
          // Update the last message (assistant) with the streamed content
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: streamedText };
            return updated;
          });
        },
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: language === "ku"
            ? "ببورە، هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵبدەوە."
            : "Sorry, an error occurred. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [language, messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    await streamMessage(input, messages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestionsKu = [
    "چۆن نوێژ بکەم؟",
    "ڕۆژوو چییە؟",
    "حەج چییە؟",
    "زەکات چۆن دەدرێت؟",
    "سورەتی الفاتحە باسبکە",
    "چۆن دوعا بکەم؟",
  ];

  const suggestedQuestionsEn = [
    "How do I pray?",
    "What is Ramadan?",
    "Tell me about Hajj",
    "How to calculate Zakat?",
    "Explain Surah Al-Fatiha",
    "How to make Dua?",
  ];

  const suggestedQuestions = language === "ku" ? suggestedQuestionsKu : suggestedQuestionsEn;

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



              {/* Language Toggle - Clickable */}
              <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-center gap-2 text-sm">
                <button
                  onClick={() => setLanguage("ku")}
                  className={`px-3 py-1 rounded-full transition-colors ${language === "ku" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  کوردی ☀️
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-full transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  English 🇬🇧
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-naskh text-xl mb-2 text-foreground">
                      {language === "ku" ? "سڵاو لەسەرتان! 👋" : "Hello there! 👋"}
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                      {language === "ku" ? "من ئیمانم، یاریدەدەری زیرەکی تۆ" : "I'm Iman, your intelligent Islamic assistant"}
                    </p>
                  </div>
                )}

                {/* Show suggestion chips when only the initial welcome message exists */}
                {messages.length <= 1 && !isLoading && (
                  <div className="py-2">
                    <p className="text-center text-xs text-muted-foreground mb-3">
                      {language === "ku" ? "پرسیارێک هەڵبژێرە:" : "Choose a question:"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={`${language}-${index}`}
                          onClick={() => streamMessage(question, messages)}
                          className="px-3 py-2 bg-muted hover:bg-primary/20 rounded-xl text-xs transition-all border border-border hover:border-primary/30 hover:shadow-sm active:scale-95"
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

                {isLoading && messages[messages.length - 1]?.content === "" && (
                  <div className="flex justify-end animate-fade-in" style={{ animationDuration: "0.1s" }}>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-2 border border-border">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">{language === "ku" ? "چاوەڕوان بە..." : "Thinking..."}</span>
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
