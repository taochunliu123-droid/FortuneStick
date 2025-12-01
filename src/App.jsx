import { useState, useRef, useCallback, useEffect } from 'react';
import { fortunePoems, translations } from './data/fortunes';

// ============ HUD COMPONENTS ============

function HUDFrame() {
  return (
    <div className="hud-frame">
      <div className="hud-corner top-left"></div>
      <div className="hud-corner top-right"></div>
      <div className="hud-corner bottom-left"></div>
      <div className="hud-corner bottom-right"></div>
    </div>
  );
}

function ScanOverlay() {
  return (
    <div className="scan-overlay">
      <div className="scan-line"></div>
    </div>
  );
}

function DataStream() {
  const [data, setData] = useState('');
  
  useEffect(() => {
    const chars = '0123456789ABCDEF';
    const interval = setInterval(() => {
      let str = '';
      for (let i = 0; i < 200; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
        if (i % 20 === 19) str += '\n';
      }
      setData(str);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="data-stream fixed top-24 left-4 w-32 h-40 overflow-hidden opacity-50 hidden md:block no-print">
      <pre className="text-[8px]">{data}</pre>
    </div>
  );
}

function SystemTime() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="font-mono text-xs text-cyber-cyan/70">
      <div>{time.toLocaleDateString('zh-TW')}</div>
      <div className="text-lg glow-cyan">{time.toLocaleTimeString('zh-TW', { hour12: false })}</div>
    </div>
  );
}

function StatusIndicator({ active, label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <div className={`status-dot ${active ? 'active' : 'inactive'}`}></div>
      <span className={active ? 'text-cyber-cyan' : 'text-gray-500'}>{label}</span>
    </div>
  );
}

// Wooden Fortune Container
function FortuneContainer({ isShaking, onShake, stickPositions }) {
  return (
    <div className="fortune-container" onClick={onShake}>
      <div className={`fortune-tube ${isShaking ? 'shaking' : ''}`}>
        {/* Wooden barrel body */}
        <div className="fortune-tube-body"></div>
        {/* Bamboo bands */}
        <div className="fortune-tube-bands"></div>
        {/* Inner opening */}
        <div className="tube-inner"></div>
        {/* Fortune sticks */}
        {stickPositions.map((stick) => (
          <div
            key={stick.id}
            className="fortune-stick"
            style={{
              left: `calc(50% + ${stick.xOffset}px)`,
              top: '15px',
              transform: `rotate(${stick.rotation}deg)`,
              height: `${stick.height}px`
            }}
          />
        ))}
      </div>
      {/* Cyber glow rings */}
      <div className="absolute -inset-4 border border-cyber-cyan/20 rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute -inset-8 border border-cyber-cyan/10 rounded-full pointer-events-none"></div>
    </div>
  );
}

// Holographic result card
function HoloResultCard({ fortune, question, oracleResponse, isOracleTyping, lang, t, onPrint }) {
  return (
    <div className="holo-card rounded-lg p-6 max-w-2xl w-full mx-4 relative overflow-hidden">
      <div className="text-center mb-6 relative z-10">
        <div className="inline-block px-4 py-1 border border-cyber-cyan/50 rounded text-xs font-mono mb-2">
          <span className={`${fortune.level.includes('上上') || fortune.levelEn?.includes('Supreme') ? 'text-yellow-400 glow-gold' : fortune.level.includes('下') || fortune.levelEn?.includes('Lesser') ? 'text-purple-400' : 'text-cyber-cyan'}`}>
            {lang === 'zh' ? fortune.level : fortune.levelEn}
          </span>
        </div>
        <h2 className="text-2xl font-bold glow-cyan font-cyber">
          {t.fortuneNumber.replace('{number}', fortune.number)}
        </h2>
      </div>
      
      {question && (
        <div className="mb-4 p-3 border border-cyber-blue/30 rounded bg-cyber-blue/5 relative z-10">
          <span className="text-cyber-blue font-mono text-xs">[{t.yourQuestion}]</span>
          <p className="text-white/90 mt-1">{question}</p>
        </div>
      )}
      
      <div className="mb-6 relative z-10">
        <div className="flex items-center gap-2 mb-2 border-b border-cyber-cyan/30 pb-2">
          <span className="text-cyber-cyan">◈</span>
          <span className="font-mono text-xs text-cyber-cyan">{t.poem}</span>
        </div>
        <p className="text-lg text-white/90 leading-relaxed whitespace-pre-line">
          {lang === 'zh' ? fortune.poem : fortune.poemEn}
        </p>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 border-b border-cyber-purple/30 pb-2">
          <span className="text-cyber-purple">◈</span>
          <span className="font-mono text-xs text-cyber-purple">{t.interpretation}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-2xl flex-shrink-0 animate-pulse">
            🔮
          </div>
          <div className="flex-1 min-h-[80px]">
            {oracleResponse ? (
              <p className={`text-white/80 leading-relaxed ${isOracleTyping ? 'typing-cursor' : ''}`}>
                {oracleResponse}
              </p>
            ) : (
              <p className="text-cyber-cyan/50 animate-pulse font-mono text-sm">
                {t.oracleThinking}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center relative z-10">
        <button onClick={onPrint} className="cyber-button">
          📄 {t.print}
        </button>
      </div>
    </div>
  );
}

// Print area
function PrintArea({ fortune, question, oracleResponse, lang }) {
  if (!fortune) return null;
  
  const today = new Date().toLocaleDateString(lang === 'zh' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div id="print-area">
      <h1>🎋 PM里長伯 (PM Mayors) 解籤大師</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>{today}</p>
      
      <div className="fortune-number">
        第 {fortune.number} 籤
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <span className="fortune-level">
          {lang === 'zh' ? fortune.level : fortune.levelEn}
        </span>
      </div>
      
      {question && (
        <div style={{ margin: '20px 0', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
          <strong>您的問題：</strong> {question}
        </div>
      )}
      
      <div style={{ margin: '30px 0', padding: '20px', border: '2px solid #B8860B', borderRadius: '8px' }}>
        <h3 style={{ color: '#8B0000', marginBottom: '15px' }}>📜 籤詩</h3>
        <p className="poem-text" style={{ fontSize: '18px', lineHeight: '2' }}>
          {lang === 'zh' ? fortune.poem : fortune.poemEn}
        </p>
      </div>
      
      <div className="interpretation">
        <h3 style={{ color: '#8B0000', marginBottom: '15px' }}>🔮 解籤</h3>
        <p style={{ lineHeight: '1.8' }}>{oracleResponse}</p>
      </div>
      
      <div className="footer-print">
        <p>心誠則靈 • 善緣廣結</p>
        <p style={{ marginTop: '10px' }}>🏘️ PM里長伯 (PM Mayors) 解籤大師</p>
        <p style={{ marginTop: '5px', fontSize: '10px' }}>Provided by Tao Chun Liu | linkedin.com/in/taochunliu</p>
      </div>
    </div>
  );
}

// Floating Footer
function FloatingFooter() {
  return (
    <div className="floating-footer no-print">
      <a 
        href="https://www.linkedin.com/in/taochunliu/" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        🏘️ PM里長伯 (PM Mayors) 幫助您用AI玩轉敏捷 | Provided by Tao Chun Liu
      </a>
    </div>
  );
}

// ============ MAIN APP ============

export default function App() {
  const [lang, setLang] = useState('zh');
  const [question, setQuestion] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [drawnFortune, setDrawnFortune] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [oracleResponse, setOracleResponse] = useState('');
  const [isOracleTyping, setIsOracleTyping] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [gestureStatus, setGestureStatus] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const lastGestureTime = useRef(0);
  const streamRef = useRef(null);
  
  const t = translations[lang];
  
  // Generate stick positions
  const stickPositions = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      rotation: Math.random() * 16 - 8,
      xOffset: Math.random() * 40 - 20,
      height: 160 + Math.random() * 40
    }))
  );

  // Camera toggle - FIXED
  const toggleCamera = useCallback(async () => {
    if (cameraOn) {
      // Turn off camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setCameraOn(false);
      setHandDetected(false);
      setGestureStatus('');
    } else {
      // Turn on camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          } 
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().then(() => {
              setCameraOn(true);
              initHandTracking();
            }).catch(err => {
              console.error('Video play error:', err);
            });
          };
        }
      } catch (err) {
        console.error('Camera error:', err);
        alert(lang === 'zh' 
          ? '無法開啟相機，請確認已授予相機權限' 
          : 'Cannot access camera. Please grant camera permission.');
      }
    }
  }, [cameraOn, lang]);
  
  // Initialize hand tracking
  const initHandTracking = async () => {
    try {
      const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
      
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 2
      });
      
      detectHands();
    } catch (err) {
      console.error('Hand tracking init error:', err);
      setGestureStatus(lang === 'zh' ? '手勢追蹤載入失敗' : 'Hand tracking failed to load');
    }
  };
  
  // Hand detection loop
  const detectHands = useCallback(() => {
    if (!videoRef.current || !handLandmarkerRef.current || !canvasRef.current || !cameraOn) {
      if (cameraOn) {
        animationRef.current = requestAnimationFrame(detectHands);
      }
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (video.readyState >= 2) {
      try {
        const results = handLandmarkerRef.current.detectForVideo(video, performance.now());
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (results.landmarks && results.landmarks.length > 0) {
          setHandDetected(true);
          
          results.landmarks.forEach(landmarks => {
            // Draw connections
            const connections = [
              [0,1],[1,2],[2,3],[3,4],
              [0,5],[5,6],[6,7],[7,8],
              [0,9],[9,10],[10,11],[11,12],
              [0,13],[13,14],[14,15],[15,16],
              [0,17],[17,18],[18,19],[19,20],
              [5,9],[9,13],[13,17]
            ];
            
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00FFFF';
            ctx.shadowBlur = 10;
            
            connections.forEach(([start, end]) => {
              const startPoint = landmarks[start];
              const endPoint = landmarks[end];
              ctx.beginPath();
              ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
              ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
              ctx.stroke();
            });
            
            // Draw points
            landmarks.forEach(point => {
              ctx.beginPath();
              ctx.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, 2 * Math.PI);
              ctx.fillStyle = '#00FFFF';
              ctx.fill();
            });
            
            // Check palm open
            const palmOpen = landmarks[8].y < landmarks[6].y && 
                            landmarks[12].y < landmarks[10].y &&
                            landmarks[16].y < landmarks[14].y;
            
            if (palmOpen) {
              setGestureStatus(lang === 'zh' ? '✋ 偵測到手掌 - 揮動求籤' : '✋ Palm detected - Wave to draw');
              
              const wrist = landmarks[0];
              const now = Date.now();
              if (now - lastGestureTime.current > 2000 && !isShaking && !showResult) {
                if (wrist.x > 0.3 && wrist.x < 0.7 && wrist.y > 0.3 && wrist.y < 0.7) {
                  lastGestureTime.current = now;
                  handleShake();
                }
              }
            } else {
              setGestureStatus(lang === 'zh' ? '👊 請張開手掌' : '👊 Open your palm');
            }
          });
        } else {
          setHandDetected(false);
          setGestureStatus(lang === 'zh' ? t.gestureNone : t.gestureNone);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }
    
    animationRef.current = requestAnimationFrame(detectHands);
  }, [isShaking, showResult, lang, cameraOn]);
  
  // Restart detection when camera turns on
  useEffect(() => {
    if (cameraOn && handLandmarkerRef.current && !animationRef.current) {
      detectHands();
    }
  }, [cameraOn, detectHands]);
  
  // Generate AI response
  const generateOracleResponse = useCallback(async (fortune) => {
    setIsOracleTyping(true);
    setOracleResponse('');
    
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fortune, question, lang })
      });
      
      if (!response.ok) throw new Error('API failed');
      
      const data = await response.json();
      const text = data.interpretation;
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          setOracleResponse(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsOracleTyping(false);
        }
      }, 25);
      
    } catch (error) {
      const fallback = lang === 'zh' 
        ? `這支籤為「${fortune.level}」。${fortune.interpretation}。籤詩提醒您${fortune.number % 2 === 0 ? '保持耐心，順應天時' : '把握當下，勇於行動'}。心誠則靈，祝您平安順遂！🙏`
        : `This fortune is "${fortune.levelEn}". ${fortune.interpretationEn}. The oracle advises you to ${fortune.number % 2 === 0 ? 'remain patient and follow timing' : 'seize the moment and act bravely'}. May peace be with you! 🙏`;
      
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < fallback.length) {
          setOracleResponse(fallback.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsOracleTyping(false);
        }
      }, 25);
    }
  }, [question, lang]);
  
  // Shake handler
  const handleShake = useCallback(() => {
    if (isShaking || showResult) return;
    
    setIsShaking(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * fortunePoems.length);
      const fortune = fortunePoems[randomIndex];
      setDrawnFortune(fortune);
      setIsShaking(false);
      
      setTimeout(() => {
        setShowResult(true);
        generateOracleResponse(fortune);
      }, 500);
    }, 2000);
  }, [isShaking, showResult, generateOracleResponse]);
  
  // Reset
  const handleReset = () => {
    setDrawnFortune(null);
    setShowResult(false);
    setOracleResponse('');
    setQuestion('');
  };
  
  // Print
  const handlePrint = () => {
    window.print();
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Camera background */}
      <video
        ref={videoRef}
        className="camera-bg"
        playsInline
        muted
        autoPlay
        style={{ transform: 'scaleX(-1)', display: cameraOn ? 'block' : 'none' }}
      />
      
      {/* Fallback gradient */}
      {!cameraOn && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0a1020] to-[#0a0a0f] z-0"></div>
      )}
      
      <ScanOverlay />
      <HUDFrame />
      <canvas ref={canvasRef} className="hand-canvas" />
      <DataStream />
      
      {/* Header */}
      <header className="relative z-10 pt-4 px-4 no-print">
        <div className="flex justify-between items-start max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold glow-cyan font-cyber tracking-wider">
              {t.title}
            </h1>
            <p className="text-cyber-cyan/50 font-mono text-xs mt-1">{t.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <SystemTime />
            <button 
              onClick={() => setLang(prev => prev === 'zh' ? 'en' : 'zh')}
              className="cyber-button px-3 py-1 text-xs"
            >
              {t.langSwitch}
            </button>
          </div>
        </div>
      </header>
      
      {/* Left panel */}
      <div className="fixed left-4 top-1/3 z-10 hud-panel w-48 hidden md:block no-print">
        <div className="hud-panel-title">{t.systemStatus}</div>
        <div className="space-y-2">
          <StatusIndicator active={cameraOn} label={cameraOn ? 'CAM ONLINE' : 'CAM OFFLINE'} />
          <StatusIndicator active={handDetected} label={t.handTracking} />
          <div className="text-xs text-cyber-cyan/60 mt-3 font-mono min-h-[20px]">
            {gestureStatus || t.gestureNone}
          </div>
        </div>
        <button 
          onClick={toggleCamera}
          className="cyber-button w-full mt-4 text-xs py-2"
        >
          📷 {cameraOn ? t.cameraOff : t.cameraOn}
        </button>
      </div>
      
      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 pb-24">
        {!showResult ? (
          <>
            <div className="w-full max-w-md mb-8">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full px-4 py-3 bg-black/40 border border-cyber-cyan/30 rounded text-cyber-cyan placeholder-cyber-cyan/30 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/50 font-mono"
              />
            </div>
            
            <FortuneContainer 
              isShaking={isShaking}
              onShake={handleShake}
              stickPositions={stickPositions.current}
            />
            
            <p className="mt-6 text-cyber-cyan/70 text-sm font-mono animate-pulse">
              {isShaking ? t.shaking : t.instructions}
            </p>
            
            <button
              onClick={handleShake}
              disabled={isShaking}
              className="cyber-button mt-6"
            >
              {isShaking ? '⏳ ' + t.shaking : '🎋 ' + t.shakeButton}
            </button>
            
            {/* Mobile camera toggle */}
            <button 
              onClick={toggleCamera}
              className="cyber-button mt-4 md:hidden text-xs"
            >
              📷 {cameraOn ? t.cameraOff : t.cameraOn}
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center animate-fadeIn pb-8">
            <HoloResultCard 
              fortune={drawnFortune}
              question={question}
              oracleResponse={oracleResponse}
              isOracleTyping={isOracleTyping}
              lang={lang}
              t={t}
              onPrint={handlePrint}
            />
            
            <button
              onClick={handleReset}
              className="cyber-button mt-6"
            >
              🔄 {t.drawAgain}
            </button>
          </div>
        )}
      </main>
      
      <PrintArea 
        fortune={drawnFortune}
        question={question}
        oracleResponse={oracleResponse}
        lang={lang}
      />
      
      <FloatingFooter />
    </div>
  );
}
