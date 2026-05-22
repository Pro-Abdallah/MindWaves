/**
 * questions.data.js
 *
 * Immersive quiz questions and answers for "Test Your Inner Echo".
 * Supports both English and Arabic.
 */

export const questionsData = [
  {
    id: 1,
    question: {
      en: "How has your mood been in the past few months?",
      ar: "مزاجك في الشهور اللي فاتت كان عامل إزاي؟"
    },
    answers: [
      {
        text: {
          en: "Stable and everything feels normal",
          ar: "مستقر وكل حاجة طبيعية"
        },
        score: 1
      },
      {
        text: {
          en: "It goes up and down a bit... but nothing major",
          ar: "بيطلع وينزل شوية... بس مفيش حاجة كبيرة"
        },
        score: 2
      },
      {
        text: {
          en: "Sometimes I feel super energetic... then a few days later I get really low",
          ar: "ساعات بحس بطاقة عالية ونشاط مفرط... وبعدها بكام يوم بنزل تحت خالص"
        },
        score: 3
      }
    ]
  },
  {
    id: 2,
    question: {
      en: "Have you ever felt your energy get so high that you couldn’t calm down?",
      ar: "هل حصل إن طاقتك بقت عالية قوي لدرجة إنك مش قادر تهدى؟"
    },
    answers: [
      {
        text: {
          en: "No, it feels normal",
          ar: "لا، بحس إنها طبيعية"
        },
        score: 1
      },
      {
        text: {
          en: "Sometimes",
          ar: "ساعات"
        },
        score: 2
      },
      {
        text: {
          en: "Yes, I sometimes feel like I’m running at 200% and can’t stop",
          ar: "آه، ساعات بحس كأني شغال بنسبة 200% ومش قادر أقف"
        },
        score: 3
      }
    ]
  },
  {
    id: 3,
    question: {
      en: "How is your sleep?",
      ar: "نومك عامل إزاي؟"
    },
    answers: [
      {
        text: {
          en: "I sleep well",
          ar: "بنام كويس ومستقر"
        },
        score: 1
      },
      {
        text: {
          en: "It goes up and down depending on stress",
          ar: "بيروح وييجي على حسب الضغط والتوتر"
        },
        score: 2
      },
      {
        text: {
          en: "Sometimes I sleep only 2–3 hours and feel energetic... and other times I sleep all day",
          ar: "ساعات بنام ساعتين تلاتة وبصحى نشيط... وساعات تانية بنام اليوم كله"
        },
        score: 3
      }
    ]
  },
  {
    id: 4,
    question: {
      en: "Do you ever feel like you can do everything and don’t need anyone?",
      ar: "هل بتيجي عليك فترات تحس فيها إنك قادر تعمل كل حاجة ومش محتاج حد؟"
    },
    answers: [
      {
        text: {
          en: "Not really",
          ar: "مش قوي بصراحة"
        },
        score: 1
      },
      {
        text: {
          en: "Sometimes",
          ar: "ساعات بتعدي عليا"
        },
        score: 2
      },
      {
        text: {
          en: "Yes... and I feel extra confident",
          ar: "آه... وبحس بثقة مفرطة في نفسي"
        },
        score: 3
      }
    ]
  },
  {
    id: 5,
    question: {
      en: "Have you ever felt the opposite—feeling down, heavy, and unable to do simple things?",
      ar: "هل حصل العكس... فترات حاسس فيها بخنقة واكتئاب ومش قادر تعمل أبسط الحاجات؟"
    },
    answers: [
      {
        text: {
          en: "No",
          ar: "لا محصلش"
        },
        score: 1
      },
      {
        text: {
          en: "Sometimes",
          ar: "ساعات بحس بكده"
        },
        score: 2
      },
      {
        text: {
          en: "Yes, a lot",
          ar: "آه وبتحصل كتير"
        },
        score: 3
      }
    ]
  },
  {
    id: 6,
    question: {
      en: "During the “high” periods... do you spend too much money or make impulsive decisions?",
      ar: "في الفترات العالية... هل بتصرف فلوس زيادة أو تاخد قرارات متهورة؟"
    },
    answers: [
      {
        text: {
          en: "No",
          ar: "لا، متحكم في نفسي"
        },
        score: 1
      },
      {
        text: {
          en: "Rarely",
          ar: "نادرًا"
        },
        score: 2
      },
      {
        text: {
          en: "Yes, it happened",
          ar: "آه بيحصل وللأسف ندمت"
        },
        score: 3
      }
    ]
  },
  {
    id: 7,
    question: {
      en: "During the “low” periods... do you isolate yourself and lose interest in things you enjoy?",
      ar: "في الفترات المنخفضة... هل بتنعزل عن الناس وبتفقد المتعة في الحاجات اللي بتحبها؟"
    },
    answers: [
      {
        text: {
          en: "Not really",
          ar: "مش قوي"
        },
        score: 1
      },
      {
        text: {
          en: "Sometimes",
          ar: "ساعات بنعزل شوية"
        },
        score: 2
      },
      {
        text: {
          en: "Yes, it happens",
          ar: "آه وبقطع مع الكل تقريبًا"
        },
        score: 3
      }
    ]
  }
];

export const resultsData = {
  stable: {
    title: {
      en: "Stable",
      ar: "مستقر"
    },
    message: {
      en: "It looks like your mood is stable and not leaning toward bipolar disorder. But it’s great that you’re learning more... keep going on the journey.",
      ar: "واضح إن مزاجك مستقر ومفيش مؤشرات قوية لاضطراب ثنائي القطب، لكن حلو إنك بتتعرف أكتر على صحتك النفسية."
    },
    class: "result-stable"
  },
  aware: {
    title: {
      en: "Be Aware",
      ar: "كن حذرًا"
    },
    message: {
      en: "Your answers show some emotional and mood changes that are worth noticing. Try to pay more attention to your feelings, energy, sleep, and the way you react to stress. Understanding yourself better is always a good first step.",
      ar: "إجاباتك بتوضح إن في شوية تغيّرات في مشاعرك ومزاجك تستحق إنك تلاحظها أكتر. حاول تركز مع مشاعرك، طاقتك، ونومك."
    },
    class: "result-aware"
  },
  help: {
    title: {
      en: "Seek Help",
      ar: "استشر متخصصًا"
    },
    message: {
      en: "Your answers suggest you might benefit from talking to a specialist. It’s not a diagnosis — just a small step toward a safe place that can help.",
      ar: "إجاباتك بتوضح إن في تغيّرات قوية في المزاج والطاقة ممكن تكون مأثرة عليك أكتر مما تتخيل. ده مش تشخيص، دي مجرد خطوة للمساعدة."
    },
    class: "result-help"
  }
};
