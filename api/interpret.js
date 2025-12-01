// Vercel Serverless Function for Fortune Interpretation
// Uses Anthropic Claude API

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { fortune, question, lang } = await req.json();

    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Return fallback interpretation if no API key
      return new Response(JSON.stringify({
        interpretation: getFallbackInterpretation(fortune, question, lang)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = lang === 'zh' 
      ? `你是一位智慧的廟公，名叫「里長伯」，專門為信眾解讀籤詩。你說話風格親切、智慧，帶有傳統廟宇的神秘感，但也很接地氣。
         解籤時請：
         1. 先解釋籤詩的字面意思
         2. 再深入分析其中的寓意
         3. 如果信眾有提問，針對問題給予具體建議
         4. 最後給予祝福
         回答請控制在150字以內，使用繁體中文。`
      : `You are a wise Temple Oracle named "PM Mayors". You interpret fortune sticks for devotees with wisdom and warmth. Your style blends mystical insight with practical advice.
         When interpreting:
         1. Explain the literal meaning of the poem
         2. Analyze the deeper symbolism
         3. If the person has a question, give specific guidance
         4. End with a blessing
         Keep your response under 100 words.`;
    
    const userPrompt = lang === 'zh'
      ? `信眾求得第${fortune.number}籤（${fortune.level}）
         籤詩：${fortune.poem}
         ${question ? `信眾的問題：${question}` : '信眾未說明具體問題'}
         請為信眾解籤。`
      : `The devotee has drawn Fortune #${fortune.number} (${fortune.levelEn})
         Poem: ${fortune.poemEn}
         ${question ? `Their question: ${question}` : 'No specific question was asked'}
         Please interpret this fortune.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      throw new Error('Anthropic API request failed');
    }

    const data = await response.json();
    const interpretation = data.content[0].text;

    return new Response(JSON.stringify({ interpretation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Return fallback
    return new Response(JSON.stringify({ 
      interpretation: '廟公正在冥想中，請稍後再試... / The Oracle is meditating, please try again...'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Fallback interpretation when API is not available
function getFallbackInterpretation(fortune, question, lang) {
  if (lang === 'zh') {
    const levelAdvice = {
      '上上籤': '這是最吉利的籤，諸事皆順，前途光明。',
      '上籤': '這是吉籤，運勢正旺，宜把握機會。',
      '中籤': '這是平穩之籤，穩紮穩打方為上策。',
      '下籤': '這是提醒之籤，宜謹慎行事，靜待時機。',
    };
    
    const advice = levelAdvice[fortune.level] || '請細細品味籤詩中的智慧。';
    
    return `善信您好！您求得第${fortune.number}籤，為「${fortune.level}」。${advice}

籤詩曰：「${fortune.interpretation}」。${question ? `關於您所問之事，` : ''}籤詩提醒您要${fortune.number % 2 === 0 ? '保持耐心，順應天時' : '把握當下，勇於行動'}。

心誠則靈，祝您平安順遂！🙏`;
  } else {
    const levelAdvice = {
      'Supreme Fortune': 'This is the most auspicious fortune - all matters proceed smoothly.',
      'Great Fortune': 'This is a fortunate sign - seize the opportunities before you.',
      'Moderate Fortune': 'This is a balanced fortune - steady progress is the way.',
      'Lesser Fortune': 'This is a cautionary sign - patience and prudence are advised.',
    };
    
    const advice = levelAdvice[fortune.levelEn] || 'Reflect deeply on the wisdom within.';
    
    return `Greetings, devotee! You have drawn Fortune #${fortune.number}, "${fortune.levelEn}". ${advice}

The verse speaks of: "${fortune.interpretationEn}". ${question ? 'Regarding your question, ' : ''}The oracle advises you to ${fortune.number % 2 === 0 ? 'remain patient and follow heaven\'s timing' : 'seize the moment and act with courage'}.

With sincere heart, blessings follow. May peace be with you! 🙏`;
  }
}
