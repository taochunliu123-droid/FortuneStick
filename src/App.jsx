import { useState, useRef, useCallback } from 'react';
import { fortunePoems, translations } from './data/fortunes';

// Lantern Component
function Lantern({ className = "" }) {
  return (
    <div className={`lantern ${className}`}></div>
  );
}

// Stick Container Component
function StickContainer({ isShaking, onShake, stickPositions }) {
  return (
    <div 
      className={`stick-container ${isShaking ? 'shaking' : ''}`}
      onClick={onShake}
    >
      {stickPositions.map((stick) => (
        <div
          key={stick.id}
          className="fortune-stick"
          style={{
            left: `calc(50% + ${stick.xOffset}px)`,
            top: '20px',
            transform: `rotate(${stick.rotation}deg)`,
            height: `${stick.height}px`
          }}
        />
      ))}
    </div>
  );
}

// Oracle Avatar Component
function OracleAvatar() {
  return (
    <div className="oracle-avatar flex-shrink-0">
      👴
    </div>
  );
}

// Fortune Scroll Component
function FortuneScroll({ fortune, question, oracleResponse, isOracleTyping, lang, t }) {
  return (
    <div className="fortune-scroll rounded-lg p-8 pt-12 pb-12">
      {/* Fortune number and level */}
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1 bg-red-800 text-yellow-400 rounded-full text-sm font-bold mb-2">
          {lang === 'zh' ? fortune.level : fortune.levelEn}
        </span>
        <h2 className="text-3xl font-bold text-red-800">
          {t.fortuneNumber.replace('{number}', fortune.number)}
        </h2>
      </div>
      
      {/* Question if provided */}
      {question && (
        <div className="mb-4 p-3 bg-yellow-100 rounded-lg border border-yellow-600">
          <span className="text-yellow-800 font-bold">{t.yourQuestion}：</span>
          <span className="text-yellow-900">{question}</span>
        </div>
      )}
      
      {/* Poem */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-700 mb-2 border-b border-red-300 pb-1">
          📜 {t.poem}
        </h3>
        <p className="text-xl text-gray-800 leading-relaxed whitespace-pre-line">
          {lang === 'zh' ? fortune.poem : fortune.poemEn}
        </p>
      </div>
      
      {/* Oracle interpretation */}
      <div>
        <h3 className="text-lg font-bold text-red-700 mb-2 border-b border-red-300 pb-1">
          🔮 {t.interpretation}
        </h3>
        <div className="flex items-start gap-4">
          <OracleAvatar />
          <div className="flex-1">
            {oracleResponse ? (
              <p className={`text-gray-800 leading-relaxed ${isOracleTyping ? 'typing-cursor' : ''}`}>
                {oracleResponse}
              </p>
            ) : (
              <p className="text-gray-500 italic animate-pulse">
                {t.oracleThinking}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [lang, setLang] = useState('zh');
  const [question, setQuestion] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [drawnFortune, setDrawnFortune] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [oracleResponse, setOracleResponse] = useState('');
  const [isOracleTyping, setIsOracleTyping] = useState(false);
  
  const t = translations[lang];
  
  // Generate random stick positions
  const stickPositions = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      rotation: Math.random() * 20 - 10,
      xOffset: Math.random() * 60 - 30,
      height: 220 + Math.random() * 30
    }))
  );
  
  // Generate AI Oracle response
  const generateOracleResponse = useCallback(async (fortune) => {
    setIsOracleTyping(true);
    setOracleResponse('');
    
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fortune,
          question,
          lang
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      const text = data.interpretation;
      
      // Typing effect
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setOracleResponse(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsOracleTyping(false);
        }
      }, 30);
      
    } catch (error) {
      console.error('Error:', error);
      // Fallback to basic interpretation if API fails
      const fallbackText = lang === 'zh' 
        ? `這支籤為「${fortune.level}」。${fortune.interpretation}。籤詩意境深遠，提醒您${fortune.number <= 20 ? '把握當下機遇，勇於前進' : fortune.number <= 40 ? '穩紮穩打，循序漸進' : '靜待時機，厚積薄發'}。善信若能心存善念，行事謹慎，自然能化險為夷，心想事成。祝您平安順遂！🙏`
        : `This fortune is "${fortune.levelEn}". ${fortune.interpretationEn}. The poem carries deep meaning, reminding you to ${fortune.number <= 20 ? 'seize current opportunities and move forward bravely' : fortune.number <= 40 ? 'proceed steadily, step by step' : 'wait for the right moment while building strength'}. If you maintain good intentions and act carefully, you can overcome obstacles and achieve your goals. May peace be with you! 🙏`;
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < fallbackText.length) {
          setOracleResponse(fallbackText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsOracleTyping(false);
        }
      }, 30);
    }
  }, [question, lang]);
  
  // Shake the container
  const handleShake = useCallback(() => {
    if (isShaking || showResult) return;
    
    setIsShaking(true);
    
    // Simulate shaking for 2 seconds
    setTimeout(() => {
      // Draw a random fortune
      const randomIndex = Math.floor(Math.random() * fortunePoems.length);
      const fortune = fortunePoems[randomIndex];
      setDrawnFortune(fortune);
      setIsShaking(false);
      
      // Show result after a brief pause
      setTimeout(() => {
        setShowResult(true);
        // Start AI interpretation
        generateOracleResponse(fortune);
      }, 500);
    }, 2000);
  }, [isShaking, showResult, generateOracleResponse]);
  
  // Reset for new fortune
  const handleReset = () => {
    setDrawnFortune(null);
    setShowResult(false);
    setOracleResponse('');
    setQuestion('');
  };
  
  // Toggle language
  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };
  
  // Share fortune
  const handleShare = async () => {
    if (!drawnFortune) return;
    
    const shareText = lang === 'zh' 
      ? `🎋 我在「PM里長伯解籤大師」抽到了第${drawnFortune.number}籤（${drawnFortune.level}）\n\n📜 ${drawnFortune.poem}\n\n🔮 ${drawnFortune.interpretation}\n\n來試試你的運勢吧！`
      : `🎋 I drew Fortune #${drawnFortune.number} (${drawnFortune.levelEn}) at PM Mayors Fortune Oracle\n\n📜 ${drawnFortune.poemEn}\n\n🔮 ${drawnFortune.interpretationEn}\n\nTry your fortune!`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      alert(t.copySuccess);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background smoke effect */}
      <div className="smoke-bg"></div>
      
      {/* Decorative lanterns */}
      <div className="fixed top-4 left-4 z-20">
        <Lantern />
      </div>
      <div className="fixed top-4 right-24 z-20 hidden md:block">
        <Lantern />
      </div>
      
      {/* Header */}
      <header className="relative z-10 pt-6 px-4">
        <div className="flex justify-between items-start max-w-4xl mx-auto">
          <div>
            <h1 className={`text-2xl md:text-4xl font-bold text-yellow-400 glow-gold ${lang === 'en' ? 'english-font' : ''}`}>
              {t.title}
            </h1>
            <p className="text-yellow-600 mt-1 text-sm md:text-base">{t.subtitle}</p>
          </div>
          <button 
            onClick={toggleLanguage}
            className="bg-red-900/50 border border-yellow-600 text-yellow-400 px-3 py-2 rounded-lg hover:bg-red-800/50 transition-all text-sm md:text-base"
          >
            {t.langSwitch}
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center px-4 py-8">
        {!showResult ? (
          <>
            {/* Question input */}
            <div className="w-full max-w-md mb-8">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full px-4 py-3 bg-black/40 border-2 border-yellow-700 rounded-lg text-yellow-100 placeholder-yellow-700 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>
            
            {/* Stick container */}
            <StickContainer 
              isShaking={isShaking}
              onShake={handleShake}
              stickPositions={stickPositions.current}
            />
            
            {/* Instructions */}
            <p className="mt-6 text-yellow-500 text-lg animate-pulse">
              {isShaking ? t.shaking : t.instructions}
            </p>
            
            {/* Shake button for mobile */}
            <button
              onClick={handleShake}
              disabled={isShaking}
              className="temple-button mt-6"
            >
              {isShaking ? t.shaking : t.shakeButton}
            </button>
          </>
        ) : (
          /* Result display */
          <div className="w-full max-w-2xl animate-fadeIn">
            <FortuneScroll 
              fortune={drawnFortune}
              question={question}
              oracleResponse={oracleResponse}
              isOracleTyping={isOracleTyping}
              lang={lang}
              t={t}
            />
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={handleReset}
                className="temple-button"
              >
                🎋 {t.drawAgain}
              </button>
              <button
                onClick={handleShare}
                className="temple-button"
              >
                📤 {t.shareText}
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-yellow-700">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
