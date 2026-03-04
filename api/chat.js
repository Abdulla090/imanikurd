// Vercel Serverless Function - Proxies Gemini API calls
// This keeps the API key on the server side, never exposed to the client

const DEFAULT_MODEL = "gemini-3.1-flash-lite-preview";
const FALLBACK_MODEL = "gemini-3-flash-preview";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
    }

    const { messages, language, stream } = req.body;

    if (!messages || !language) {
        return res.status(400).json({ error: "Missing messages or language" });
    }

    const systemPrompt = language === "en"
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

    const requestBody = {
        contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...messages.map((msg) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }],
            })),
        ],
        generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
        },
    };

    const model = DEFAULT_MODEL;

    // If streaming is requested
    if (stream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        try {
            let response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                }
            );

            // Fallback model if primary fails
            if (!response.ok) {
                response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${FALLBACK_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(requestBody),
                    }
                );
            }

            if (!response.ok) {
                res.write(`data: ${JSON.stringify({ error: "API error" })}\n\n`);
                return res.end();
            }

            // Pipe the SSE stream from Gemini directly to the client
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                res.write(chunk);
            }

            return res.end();
        } catch (error) {
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            return res.end();
        }
    }

    // Non-streaming fallback
    try {
        let response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${FALLBACK_MODEL}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                }
            );
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: "Gemini API error" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
