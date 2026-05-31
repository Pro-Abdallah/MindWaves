import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questionsData, resultsData } from './questions.data'
import OceanBackground from '../ABottleReturned/components/OceanBackground'
import './InnerEcho.css'
import '../ABottleReturned/ABottleReturned.css'

/**
 * Immersive Interactive Psychological Reflection Quiz.
 * "Test Your Inner Echo"
 */
export default function InnerEcho() {
  // Localization state
  const [lang, setLang] = useState('en')

  // Quiz state machine: 'intro' | 'quiz' | 'result'
  const [stage, setStage] = useState('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [activeSelectIdx, setActiveSelectIdx] = useState(-1) // active choice for keyboard navigation


  // Particles ref removed because we are using OceanBackground

  // Keyboard navigation controller
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage === 'quiz') {
        const currentQuestion = questionsData[currentIdx]
        
        // Number mappings (1, 2, 3) to choose answers
        if (e.key === '1') {
          handleSelectAnswer(currentQuestion.answers[0].score)
        } else if (e.key === '2') {
          handleSelectAnswer(currentQuestion.answers[1].score)
        } else if (e.key === '3') {
          handleSelectAnswer(currentQuestion.answers[2].score)
        }

        // Arrow keys to navigate options
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

  // Calculate final score logic
  const calculateResult = () => {
    const total = answers.reduce((acc, curr) => acc + curr, 0)
    
    // Ranges:
    // Min score = 7 (7 * 1), Max score = 21 (7 * 3)
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
    subtitle: { en: "A small awareness journey into your emotional patterns.", ar: "رحلة وعي صغيرة لاستكشاف تقلباتك ومزاجك الداخلي." },
    begin: { en: "Begin The Reflection", ar: "ابدأ رحلة الوعي" },
    qCount: { en: "Question", ar: "السؤال" },
    of: { en: "of", ar: "من" },
    helpCenter: { en: "Go To Help Center", ar: "الذهاب لمركز المساعدة" },
    restart: { en: "Restart Reflection", ar: "إعادة الاختبار" },
    drApproval: {
      en: "This test has been reviewed and approved by psychiatrist Dr. Ghada El Qady.",
      ar: "تمت مراجعة واعتماد هذا الاختبار من قبل طبيبة الأمراض النفسية د. غادة القاضي."
    },
    diagnosticDisclaimer: {
      en: "This test is not an official diagnostic tool, but rather an awareness-based guide designed to help users better understand their emotional and mood-related experiences.",
      ar: "هذا الاختبار ليس أداة تشخيص رسمية، بل هو دليل للتوعية مصمم لمساعدتك على فهم تقلباتك ومزاجك النفسي بشكل أفضل."
    },
    audioToggle: {
      en: "Ambient Ambience",
      ar: "الموسيقى المحيطة"
    }
  }

  return (
    <section className={`ie-container ${lang === 'ar' ? 'ie-rtl' : ''}`} id="inner-echo" aria-label="Inner Echo Quiz">
      {/* Ocean background — same as Ride The Waves & ABottleReturned */}
      <OceanBackground isBlurred={false} />



      {/* ── Content View Wrapper ── */}
      <div className="ie-content">
        <AnimatePresence mode="wait">
          
          {/* ── STEP 1: Intro Screen ── */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1 }}
              className="ie-card ie-card--intro"
            >
              <div className="ie-card__header">
                <h2 className="ie-card__title">{t.title[lang]}</h2>
              </div>
              <p className="ie-card__subtitle">{t.subtitle[lang]}</p>
              
              <button 
                className="ie-card__btn ie-card__btn--pulse"
                onClick={handleStartQuiz}
              >
                <span className="ie-card__btn-glow" />
                {t.begin[lang]}
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: Questions view ── */}
          {stage === 'quiz' && (
            <motion.div
              key={`question-${currentIdx}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1 }}
              className="ie-card ie-card--quiz"
            >
              {/* Question Header Progress */}
              <div className="ie-quiz-header">
                <span className="ie-quiz-header__count">
                  {t.qCount[lang]} {currentIdx + 1} {t.of[lang]} {questionsData.length}
                </span>
                
                <div className="ie-quiz-header__progress-bar">
                  <div 
                    className="ie-quiz-header__progress-fill"
                    style={{ width: `${((currentIdx + 1) / questionsData.length) * 100}%` }}
                  />
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
                    <span className="ie-quiz-answer-btn__index">{index + 1}</span>
                    <span className="ie-quiz-answer-btn__text">{answer.text[lang]}</span>
                  </button>
                ))}
              </div>

              {/* Keyboard help hint */}
              <div className="ie-keyboard-hint">
                <span>Press <strong>1</strong>, <strong>2</strong>, or <strong>3</strong> on your keyboard to select</span>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Results display screen ── */}
          {stage === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1 }}
              className={`ie-card ie-card--result ${result.class}`}
            >
              <span className="ie-card__tag">REFLECTION COMPLETED</span>
              
              {/* Result Title & Icon with special glow rings */}
              <div className="ie-result-badge">
                <div className="ie-result-badge__glow" />
                <h3 className="ie-result-title">{result.title[lang]}</h3>
              </div>

              {/* Result Description */}
              <p className="ie-result-desc">{result.message[lang]}</p>

              {/* Special action button for Seek Help (Red result) */}
              {result.class === 'result-help' && (
                <button 
                  className="ie-card__btn ie-card__btn--red"
                  onClick={() => alert(lang === 'en' ? "Redirecting to Support Center..." : "جاري توجيهك لمركز الدعم النفسي...")}
                >
                  {t.helpCenter[lang]}
                </button>
              )}

              {/* Return/Reset Button */}
              <button 
                className="ie-card__btn ie-card__btn--secondary"
                onClick={handleRestart}
              >
                {t.restart[lang]}
              </button>

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
