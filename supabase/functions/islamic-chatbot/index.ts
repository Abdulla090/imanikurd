import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const systemPrompt = language === 'en'
      ? `You are a knowledgeable Islamic assistant. You help users with questions about Islam, Quran, Hadith, and Islamic practices.

IMPORTANT FORMATTING RULES:
- Use **bold** for important Islamic terms, names of Allah, prophets, and key concepts
- When quoting Quran verses, format as: **[Surah Name:Verse]** "verse text"
- When quoting Hadith, format as: **Hadith:** "hadith text" - **Narrator/Source**
- Use bullet points for lists
- Keep responses respectful and educational
- Always cite sources when possible
- Be respectful and use Islamic greetings like "Assalamu Alaikum"`
      : `تۆ یاریدەدەرێکی ئیسلامیت کە زانیاریی تەواو دەربارەی ئیسلام، قورئان، حەدیس و کردارە ئیسلامییەکان دەدەیت.

ڕێسای گرنگی فۆرمات:
- **ڕەش** بەکاربهێنە بۆ زاراوە گرنگەکانی ئیسلامی، ناوی خوا، پێغەمبەران و بیرۆکە سەرەکییەکان
- کاتێک ئایەتی قورئان دەهێنیتەوە، بەم شێوەیە بنووسە: **[ناوی سورە:ئایەت]** "دەقی ئایەت"
- کاتێک حەدیس دەهێنیتەوە، بەم شێوەیە بنووسە: **حەدیس:** "دەقی حەدیس" - **ڕاوی/سەرچاوە**
- خاڵی بوللێت بەکاربهێنە بۆ لیستەکان
- وەڵامەکان ڕێزلێنانەوە و فێرکارانە بن
- هەمیشە سەرچاوەکان بخەرەوە
- بە ڕێزەوە بە و سڵاوی ئیسلامی بەکاربهێنە وەک "سڵاو لەسەرتان"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
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
            ...messages.map((msg: { role: string; content: string }) => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            }))
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data));

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in islamic-chatbot function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
