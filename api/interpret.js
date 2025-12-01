// Vercel Edge Function for Fortune Interpretation

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
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({
        interpretation: getFallbackInterpretation(fortune, question, lang)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = lang === 'zh' 
      ? `你是「里長伯」，一位結合傳統智慧與現代科技的神諭解讀者。你說話風格帶有科幻感但不失親切，像是一位來自未來的智慧長者。
         解籤時：
         1. 用現代語言解釋籤詩的字面意思
         2. 分析其中的深層寓意
         3. 如果有提問，給予具體建議
         4. 最後給予祝福
         回答控制在150字以內，使用繁體中文。適當使用科技感詞彙如「數據顯示」「系統分析」等。`
      : `You are "PM Mayors", an oracle interpreter blending ancient wisdom with futuristic technology. Your style is slightly sci-fi but warm, like a wise elder from the future.
         When interpreting:
         1. Explain the poem's literal meaning in modern terms
         2. Analyze deeper symbolism
         3. If there's a question, give specific guidance
         4. End with a blessing
         Keep response under 100 words. Use occasional tech-themed phrases like "data indicates" or "system analysis".`;
    
    const userPrompt = lang === 'zh'
      ? `信眾求得第${fortune.number}籤（${fortune.level}）
         籤詩：${fortune.poem}
         ${question ? `提問：${question}` : '未提出具體問題'}
         請解籤。`
      : `Devotee drew Fortune #${fortune.number} (${fortune.levelEn})
         Poem: ${fortune.poemEn}
         ${question ? `Question: ${question}` : 'No specific question'}
         Please interpret.`;

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
        messages: [{ role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }]
      }),
    });

    if (!response.ok) throw new Error('API failed');

    const data = await response.json();
    return new Response(JSON.stringify({ interpretation: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      interpretation: '神諭系統暫時離線，請稍後再試... / Oracle system temporarily offline...'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function getFallbackInterpretation(fortune, question, lang) {
  if (lang === 'zh') {
    const advice = {
      '上上籤': '系統分析：此籤為最高等級吉兆，所有指標均呈現正向趨勢。',
      '上籤': '系統分析：此籤顯示良好運勢，建議把握當前機會。',
      '中籤': '系統分析：此籤顯示平穩狀態，穩紮穩打為上策。',
      '下籤': '系統分析：此籤提示需謹慎行事，靜待時機轉變。',
    };
    return `${advice[fortune.level] || '系統分析中...'}\n\n籤詩核心訊息：「${fortune.interpretation}」。${question ? '針對您的提問，' : ''}建議您${fortune.number % 2 === 0 ? '保持耐心，等待最佳時機' : '積極行動，把握眼前機會'}。\n\n願光明指引您的道路！🔮`;
  } else {
    const advice = {
      'Supreme Fortune': 'System analysis: Maximum auspicious reading. All indicators positive.',
      'Great Fortune': 'System analysis: Favorable conditions detected. Seize opportunities.',
      'Moderate Fortune': 'System analysis: Stable state detected. Steady progress advised.',
      'Lesser Fortune': 'System analysis: Caution recommended. Await better timing.',
    };
    return `${advice[fortune.levelEn] || 'Analyzing...'}\n\nCore message: "${fortune.interpretationEn}". ${question ? 'Regarding your query, ' : ''}The oracle suggests ${fortune.number % 2 === 0 ? 'patience while awaiting optimal timing' : 'taking action and seizing current opportunities'}.\n\nMay light guide your path! 🔮`;
  }
}
