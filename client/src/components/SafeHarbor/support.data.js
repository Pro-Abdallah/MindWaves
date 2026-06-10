/**
 * support.data.js
 *
 * Clean structured data for Section IV: "Safe Harbor".
 * Contains detailed sections for Bipolar info, therapy platforms, and hotline directories.
 */

export const infoResources = [
  {
    id: "info-who",
    title: "World Health Organization (WHO)",
    desc: "A comprehensive global fact sheet outlining key facts, symptoms, treatment options, and the global health response for Bipolar Disorder.",
    url: "https://www.who.int/news-room/fact-sheets/detail/bipolar-disorder",
    cta: "Read Fact Sheet"
  },
  {
    id: "info-nimh",
    title: "National Institute of Mental Health (NIMH)",
    desc: "An in-depth guide covering the types of bipolar disorder, symptoms, causes, treatment options, and clinical trials.",
    url: "https://www.nimh.nih.gov/health/publications/bipolar-disorder#part_6167",
    cta: "View Guide"
  },
  {
    id: "info-mayo",
    title: "Mayo Clinic",
    desc: "A detailed medical overview of symptoms, causes, risk factors, complications, and diagnostic strategies for Bipolar Disorder.",
    url: "https://www.mayoclinic.org/diseases-conditions/bipolar-disorder/symptoms-causes/syc-20355955",
    cta: "Explore Symptoms"
  },
  {
    id: "info-bipolaruk",
    title: "Bipolar UK",
    desc: "A dedicated resource focused on supporting someone with bipolar disorder, including advice, peer support groups, and practical tips.",
    url: "https://www.bipolaruk.org/about-bipolar/supporting-someone/",
    cta: "Get Support Advice"
  }
];

export const therapyPlatforms = [
  {
    id: "th-vezeeta",
    name: "Vezeeta",
    category: "Book a Doctor Appointment",
    desc: "Book in-person or online appointments with doctors across multiple medical specialties.",
    url: "https://www.vezeeta.com",
    cta: "Book Appointment"
  },
  {
    id: "th-estaraht",
    name: "Estaraht",
    category: "Start Online Therapy",
    desc: "Psychological support conversations, for users who want to talk.",
    url: "https://estaraht.com",
    cta: "Start Chat"
  },
  {
    id: "th-shezlong",
    name: "Shezlong",
    category: "Start Online Therapy",
    desc: "Formal psychotherapy sessions with licensed therapists.",
    url: "https://www.shezlong.com",
    cta: "Find Therapist"
  },
  {
    id: "th-ayadi",
    name: "Ayadi",
    category: "Start Online Therapy",
    desc: "Online psychological support sessions with certified mental health specialists.",
    url: "https://www.ayadi.com",
    cta: "Start Session"
  },
  {
    id: "th-07therapy",
    name: "07 Therapy",
    category: "Start Online Therapy",
    desc: "Tailored therapy journeys, combining different therapy formats.",
    url: "https://07therapy.com",
    cta: "Begin Journey"
  },
  {
    id: "th-therapymantra",
    name: "TherapyMantra",
    category: "Start Online Therapy",
    desc: "Professional and tailored therapy in a convenient online format.",
    url: "https://therapymantra.co",
    cta: "Get Started"
  }
];

export const emergencyHotlines = [
  {
    id: "hl-mental",
    title: "Psychological Support Hotline — Ministry of Health",
    phone: "16328"
  },
  {
    id: "hl-addiction",
    title: "Addiction Treatment Hotline",
    phone: "16023"
  },
  {
    id: "hl-alazhar",
    title: "Al-Azhar Support Line for Conflict Resolution and Family Crises",
    phone: "19906"
  },
  {
    id: "hl-solidarity",
    title: "Social & Psychological Counseling Line — Ministry of Social Solidarity",
    phone: "15095"
  },
  {
    id: "hl-general",
    title: "General Mental Health and Addiction Treatment",
    phone: "16328"
  }
];
