import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { questionsData, resultsData } from './questions.data'
import OceanBackground from '../ABottleReturned/components/OceanBackground'
import './InnerEcho.css'
import '../ABottleReturned/ABottleReturned.css'

/**
 * Helper to generate the smooth cubic Bezier path for the SVG wave visualization.
 * Spreads the 7 points across the width and maps score (1, 2, 3) to height levels.
 */
const generateWavePath = (answers) => {
  if (!answers || answers.length === 0) return "";
  
  const width = 500;
  const paddingX = 40;
  const availableWidth = width - paddingX * 2;
  const stepX = availableWidth / 6;
  
  // Score 1 -> Calm (Y=110) | Score 2 -> Alert (Y=75) | Score 3 -> Peak (Y=40)
  const mapY = (score) => {
    if (score === 1) return 110;
    if (score === 2) return 75;
    return 40;
  };
  
  const points = answers.map((score, idx) => ({
    x: paddingX + idx * stepX,
    y: mapY(score)
  }));
  
  let path = `M ${points[0].x} ${points[0].y}`;
  const dx = stepX / 2; // Control point offset for smooth curves
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    path += ` C ${p0.x + dx} ${p0.y}, ${p1.x - dx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  
  return path;
};

/**
 * Helper to close the wave path to fill the gradient area below the curve.
 */
const generateFilledPath = (answers) => {
  const linePath = generateWavePath(answers);
  if (!linePath) return "";
  
  const width = 500;
  const paddingX = 40;
  const startX = paddingX;
  const endX = width - paddingX;
  
  return `${linePath} L ${endX} 140 L ${startX} 140 Z`;
};

/**
 * Immersive Interactive Psychological Reflection Quiz.
 * "Test Your Inner Echo"
 */
export default function InnerEcho() {
  const navigate = useNavigate()
  
  // Localization state: 'en' | 'ar'
  const [lang, setLang] = useState('en')

  // Quiz state machine: 'intro' | 'quiz' | 'result'
  const [stage, setStage] = useState('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [activeSelectIdx, setActiveSelectIdx] = useState(-1) // active choice for keyboard navigation

  // Keyboard navigation controller
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage === 'quiz') {
        const currentQuestion = questionsData[currentIdx]
        
        // Keyboard number hotkeys
        if (e.key === '1') {
          handleSelectAnswer(currentQuestion.answers[0].score)
        } else if (e.key === '2') {
          handleSelectAnswer(currentQuestion.answers[1].score)
        } else if (e.key === '3') {
          handleSelectAnswer(currentQuestion.answers[2].score)
        }

        // Arrow keys & Tab navigation
        if (e.key === 'ArrowDown' || e.key === 'Tab') {
          e.preventDefault()
          setActiveSelectIdx((prev) => (prev + 1) % 3)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveSelectIdx((prev) => (prev - 1 + 3) % 3)
        } else if (e.key === 'Enter' && activeSelectIdx >= 0) {
          e.preventDefault()
          handleSelectAnswer(currentQuestion.answers[activeSelectIdx].score)
        }
      } else if (stage === 'intro' && e.key === 'Enter') {
        e.preventDefault()
        handleStartQuiz()
      } else if (stage === 'result' && e.key === 'Escape') {
        e.preventDefault()
        handleRestart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stage, currentIdx, activeSelectIdx])

  const handleStartQuiz = () => {
    setStage('quiz')
    setCurrentIdx(0)
    setAnswers([])
    setActiveSelectIdx(-1)
  }

  const handleSelectAnswer = (score) => {
    const newAnswers = [...answers, score]
    setAnswers(newAnswers)

    if (currentIdx + 1 < questionsData.length) {
      setCurrentIdx(currentIdx + 1)
      setActiveSelectIdx(-1)
    } else {
      setStage('result')
    }
  }

  const handleRestart = () => {
    setStage('intro')
    setCurrentIdx(0)
    setAnswers([])
    setActiveSelectIdx(-1)
  }

  const calculateResult = () => {
    const total = answers.reduce((acc, curr) => acc + curr, 0)
    
    // Ranges: Min score = 7, Max score = 21
    if (total <= 11) {
      return resultsData.stable
    } else if (total <= 16) {
      return resultsData.aware
    } else {
      return resultsData.help
    }
  }

  const result = stage === 'result' ? calculateResult() : null

  // Localization strings helper
  const t = {
    title: { en: "Test Your Inner Echo", ar: "اختبر صدى روحك الداخلي" },
    subtitle: { en: "An awareness journey designed to map your emotional and mood patterns.", ar: "رحلة وعي مصممة لرصد تقلباتك ومزاجك النفسي الداخلي." },
    begin: { en: "Begin Reflection", ar: "ابدأ رحلة الوعي" },
    qCount: { en: "Question", ar: "السؤال" },
    of: { en: "of", ar: "من" },
    helpCenter: { en: "Seek Safe Harbor Support", ar: "الذهاب لمراكز المساعدة" },
    restart: { en: "Begin Anew", ar: "إعادة الاختبار" },
    drApproval: {
      en: "Reviewed and approved by psychiatrist Dr. Ghada El Qady.",
      ar: "تمت مراجعة واعتماد هذا الاختبار من قبل طبيبة الأمراض النفسية د. غادة القاضي."
    },
    diagnosticDisclaimer: {
      en: "This test is not an official diagnostic tool, but rather an awareness-based guide to help you better observe your emotional experiences.",
      ar: "هذا الاختبار ليس أداة تشخيص رسمية، بل هو دليل للتوعية مصمم لمساعدتك على فهم تقلباتك ومزاجك النفسي بشكل أفضل."
    },
    keyboardPrompt: {
      en: "Press 1, 2, or 3 to choose",
      ar: "اضغط على 1 أو 2 أو 3 للاختيار"
    }
  }

  return (
    <section className={`ie-container ${lang === 'ar' ? 'ie-rtl' : ''}`} id="inner-echo" aria-label="Inner Echo Quiz">
      {/* Ocean background — dynamic blur focuses attention during assessment */}
      <OceanBackground isBlurred={stage !== 'intro'} />

      {/* ── Content View Wrapper ── */}
      <div className="ie-content">
        <AnimatePresence mode="wait">
          
          {/* ── STEP 1: Intro Screen ── */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="ie-card ie-card--intro"
            >


              <span className="ie-card__tag">AWARENESS TOOL</span>
              <h2 className="ie-card__title">{t.title[lang]}</h2>
              <p className="ie-card__subtitle">{t.subtitle[lang]}</p>
              
              <button 
                className="ie-card__btn ie-card__btn--pulse"
                onClick={handleStartQuiz}
              >
                <span className="ie-card__btn-glow" />
                {t.begin[lang]}
              </button>

              <div className="ie-card__divider" />

              <div className="ie-disclaimer">
                <p className="ie-disclaimer__doctor">
                  <svg className="ie-disclaimer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {t.drApproval[lang]}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Questions view ── */}
          {stage === 'quiz' && (
            <motion.div
              key={`question-${currentIdx}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="ie-card ie-card--quiz"
            >
              {/* Header Progress */}
              <div className="ie-quiz-header" style={{ marginBottom: '28px' }}>
                <span className="ie-quiz-header__count">
                  {t.qCount[lang]} {currentIdx + 1} {t.of[lang]} {questionsData.length}
                </span>
                {/* Stepper Node Dots */}
                <div className="ie-stepper">
                  {questionsData.map((_, idx) => {
                    let nodeClass = "ie-stepper__node";
                    if (idx === currentIdx) nodeClass += " ie-stepper__node--active";
                    else if (idx < currentIdx) nodeClass += " ie-stepper__node--completed";
                    return (
                      <div key={idx} className={nodeClass} />
                    );
                  })}
                </div>
              </div>

              {/* Question Title */}
              <h3 className="ie-quiz-question">
                {questionsData[currentIdx].question[lang]}
              </h3>

              {/* Answers Grid */}
              <div className="ie-quiz-answers">
                {questionsData[currentIdx].answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(answer.score)}
                    className={`ie-quiz-answer-btn ${activeSelectIdx === index ? 'ie-quiz-answer-btn--focused' : ''}`}
                    aria-label={answer.text[lang]}
                  >
                    <span className="ie-quiz-keycap">{index + 1}</span>
                    <span className="ie-quiz-answer-btn__text">{answer.text[lang]}</span>
                  </button>
                ))}
              </div>

              {/* Keyboard help hint */}
              <div className="ie-keyboard-hint">
                <span>
                  {lang === 'en' ? "Press " : "اضغط على "}
                  <kbd className="ie-kbd">1</kbd>, <kbd className="ie-kbd">2</kbd>, {lang === 'en' ? "or " : "أو "} <kbd className="ie-kbd">3</kbd> {lang === 'en' ? "to select" : "للاختيار"}
                </span>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Results display screen ── */}
          {stage === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`ie-card ie-card--result ${result.class}`}
            >


              <span className="ie-card__tag">ECHO PROFILE COMPLETED</span>
              
              {/* Dynamic Inner Echo Wave Visualization */}
              <div className="ie-wave-container">
                <h4 className="ie-wave-container__title">
                  {lang === 'en' ? "Your Emotional Echo Wave" : "موجة الصدى النفسي الخاصة بك"}
                </h4>
                <svg viewBox="0 0 500 150" className="ie-echo-wave-svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="wave-grad-stable" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="wave-grad-aware" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#EF4444" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="wave-grad-help" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#7F1D1D" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
                    </linearGradient>

                    <linearGradient id="area-grad-stable" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="area-grad-aware" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="area-grad-help" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Guidelines */}
                  <line x1="40" y1="40" x2="460" y2="40" stroke="rgba(145, 191, 246, 0.08)" strokeDasharray="3 3" />
                  <line x1="40" y1="75" x2="460" y2="75" stroke="rgba(145, 191, 246, 0.08)" strokeDasharray="3 3" />
                  <line x1="40" y1="110" x2="460" y2="110" stroke="rgba(145, 191, 246, 0.08)" strokeDasharray="3 3" />

                  {/* Filled Wave Area */}
                  <motion.path 
                    d={generateFilledPath(answers)} 
                    fill={`url(#area-grad-${result.class.replace('result-', '')})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                  />

                  {/* Glowing Neon Line */}
                  <motion.path 
                    d={generateWavePath(answers)} 
                    fill="none" 
                    stroke={`url(#wave-grad-${result.class.replace('result-', '')})`}
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="ie-echo-wave-path"
                  />

                  {/* Score Dots */}
                  {answers.map((score, idx) => {
                    const width = 500;
                    const paddingX = 40;
                    const availableWidth = width - paddingX * 2;
                    const stepX = availableWidth / 6;
                    const x = paddingX + idx * stepX;
                    const mapY = (s) => {
                      if (s === 1) return 110;
                      if (s === 2) return 75;
                      return 40;
                    };
                    const y = mapY(score);
                    return (
                      <motion.circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#FFFFFF"
                        stroke={`url(#wave-grad-${result.class.replace('result-', '')})`}
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.2 + idx * 0.1 }}
                      />
                    );
                  })}
                </svg>
                <div className="ie-wave-labels">
                  <span>Q1</span>
                  <span>Q2</span>
                  <span>Q3</span>
                  <span>Q4</span>
                  <span>Q5</span>
                  <span>Q6</span>
                  <span>Q7</span>
                </div>
              </div>

              {/* Result Title & Icon with special glow rings */}
              <div className="ie-result-badge">
                <div className="ie-result-badge__glow" />
                <h3 className="ie-result-title">{result.title[lang]}</h3>
              </div>

              {/* Result Description */}
              <p className="ie-result-desc">{result.message[lang]}</p>

              {/* Dynamic support router based on status */}
              <div className="ie-result-actions">
                {result.class === 'result-help' && (
                  <button 
                    className="ie-card__btn ie-card__btn--red"
                    onClick={() => navigate('/safe-harbor')}
                  >
                    {t.helpCenter[lang]}
                  </button>
                )}

                <button 
                  className="ie-card__btn ie-card__btn--secondary"
                  onClick={handleRestart}
                >
                  {t.restart[lang]}
                </button>
              </div>

              {/* Decorative Divider */}
              <div className="ie-card__divider" />

              {/* Psychiatrist disclaimer overlay */}
              <div className="ie-disclaimer">
                <p className="ie-disclaimer__doctor">
                  <svg className="ie-disclaimer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  {t.drApproval[lang]}
                </p>
                <p className="ie-disclaimer__text">{t.diagnosticDisclaimer[lang]}</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
