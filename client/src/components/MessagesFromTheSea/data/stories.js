/**
 * stories.js
 * Central data registry for all 4 Messages From the Sea stories.
 * Add / modify story content here — UI components are data-driven.
 */

import srtContent from "./Behind_the_Silence_English.srt?raw";

function parseSrt(srt) {
  if (!srt) return [];
  const blocks = srt.replace(/\r/g, "").trim().split("\n\n");
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      if (lines.length < 3) return null;
      const timeLine = lines[1];
      const text = lines.slice(2).join("\n");

      const parseTime = (t) => {
        const [hms, ms] = t.split(",");
        if (!hms || !ms) return 0;
        const [h, m, s] = hms.split(":").map(Number);
        return h * 3600 + m * 60 + s + Number(ms) / 1000;
      };

      const times = timeLine.split(" --> ");
      if (times.length !== 2) return null;
      const [start, end] = times.map(parseTime);
      return { start, end, text };
    })
    .filter(Boolean);
}

export const STORIES = [
  {
    id: "audio",
    type: "audio",
    category: "Audio Story",
    label: "Silence Inside a Heavy Heart",
    lead: "An honest conversation about living with bipolar disorder and finding strength through understanding",
    bottleLabel: "A Voice",
    tagline: "Close your eyes. Listen.",
    description: "A real voice, carried by the waves.",
    color: "#7DD3FC",
    glowColor: "rgba(125,211,252,0.6)",
    src: "https://res.cloudinary.com/dwgbbvjbz/video/upload/v1779583794/1st_story_audio_m23eky.mp3",
    subtitles: parseSrt(srtContent),
  },
  {
    id: "video",
    type: "video",
    category: "Video Story",
    label: "Not by Choice",
    lead: "Some of the hardest battles are the ones we don't choose. This is a story of confusion, survival, and finding a way forward.",
    bottleLabel: "A Vision",
    tagline: "See the storm from within.",
    description: "A cinematic window into another world.",
    color: "#7B61FF",
    glowColor: "rgba(123,97,255,0.6)",
    src: "https://res.cloudinary.com/dwgbbvjbz/video/upload/2nd_story_video_-_Not_By_Choice_-_optimized_tmyyae.mp4",
    poster: null,
  },
  {
    id: "comic",
    type: "comic",
    category: "Illustrated Story",
    label: "Little Heart, Big Waves",
    lead: "Every wave tells a story. This one belongs to a child learning to navigate emotions bigger than himself.",
    bottleLabel: "A Picture",
    tagline: "Turn the page. Feel each panel.",
    description: "A story told in images and silence.",
    color: "#E8994A",
    glowColor: "rgba(232,153,74,0.6)",
    pages: [
      "/comic_story/0 - Cover.jpg",
      "/comic_story/1.jpg",
      "/comic_story/2.jpg",
      "/comic_story/3.jpg",
      "/comic_story/4.jpg",
      "/comic_story/5.jpg",
      "/comic_story/6.jpg",
      "/comic_story/7.jpg",
      "/comic_story/8.jpg",
      "/comic_story/9.jpg",
      "/comic_story/10.jpg",
      "/comic_story/11.jpg",
      "/comic_story/12.jpg",
      "/comic_story/13.jpg",
      "/comic_story/14.jpg",
      "/comic_story/15.jpg",
      "/comic_story/16.jpg",
      "/comic_story/17.jpg",
      "/comic_story/18.jpg",
      "/comic_story/19 - End Cover.jpg",
    ],
  },
  {
    id: "text",
    type: "text",
    category: "Written Story",
    label: "A Journey Through the Stigma",
    lead: "Behind every label is a person searching to be understood.",
    bottleLabel: "A Letter",
    tagline: "Words washed ashore.",
    description: "A personal testimony from the depths.",
    color: "#5DB88A",
    glowColor: "rgba(93,184,138,0.6)",
    image: "/text_story/WhatsApp Image 2026-05-19 at 4.28.03 PM.jpeg",
    title: "My Story with Bipolar",
    subtitle: "A Journey Through the Stigma",
    paragraphs: [
      "Forty days after my father's death, I went to attend a wedding for some of our neighbors in the village. The colored lights were strung over the narrow street, and folk songs blared from the speakers at a volume that shook the entire place.",
      "Women were ululating, children were running between people, and everything around me suggested this was a normal wedding night. And in the middle of all that... I didn't feel like I existed at all.",
      "I was walking as if someone else was moving my body. My face smiled automatically, and my hands shook people's hands, but I wasn't conscious of why I was there, nor could I understand if I was doing the right or wrong thing.",
      'I am Mahmoud, and I recently began to understand that this condition had a name: "Bipolar Disorder." But before reaching this truth, I lived for many years lost amidst my thoughts and the way people looked at me.',
      "I am now 35 years old, and since I was a child, I've felt like there was something different inside me. If someone made a simple comment, I would replay it in my head dozens of times.",
      'My family didn\'t understand what was happening to me; they saw me as "overly sensitive" or "exaggerating things." I grew up feeling like a stranger to those around me.',
      "I remained afraid to see a doctor for years. In Sohag, the matter is akin to a scandal. I used to hide my appointments even from those closest to me, entering the clinic feeling like I was doing something wrong.",
      'I went to four doctors, each giving me a different diagnosis. Until I reached one who told me I had "Bipolar Disorder." Only then did I feel relieved — for the first time, I felt I wasn\'t a bad person... I was just sick.',
      '"All my life I thought I was a flawed person... but the truth is I needed treatment, not judgment from people."',
    ],
  },
];
