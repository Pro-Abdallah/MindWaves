/**
 * islands.data.js
 *
 * Configurable details for the 6 interactive islands representing Bipolar Disorder topics.
 * Each island has specific coordinates in the 3D scene (x, y, z) and stylistic choices.
 */

export const islandsData = [
  {
    id: 1,
    title: "Understanding Mood Shifts",
    subtitle: "Navigating between mania and depression",
    route: "/island/1",
    position: [-14, 0, -8],
    color: "#5184C0", // Steel Blue
    accentColor: "#91BFF6", // Sky Blue
    scale: 2.1,
    elevation: 1.5,
    description: "Explore the dual nature of Bipolar Disorder, characterizing the shifts from manic highs to depressive lows."
  },
  {
    id: 2,
    title: "Energy & Sleep Rhythms",
    subtitle: "The biological clock & circadian disruption",
    route: "/island/2",
    position: [-8, 0, 10],
    color: "#05395E", // Deep Navy
    accentColor: "#5184C0",
    scale: 1.8,
    elevation: 1.1,
    description: "Learn how sleep architecture changes and how energy levels fluctuate during different mood phases."
  },
  {
    id: 3,
    title: "Signs & Symptoms",
    subtitle: "Identifying clinical indicators",
    route: "/island/3",
    position: [6, 0, -12],
    color: "#91BFF6", // Sky Blue
    accentColor: "#DFE1E6", // Mist
    scale: 2.3,
    elevation: 2.0,
    description: "Examine the diagnostic criteria, including hypomania, mixed episodes, and rapid cycling."
  },
  {
    id: 4,
    title: "Treatment & Therapy",
    subtitle: "Stabilizing the waves of emotion",
    route: "/island/4",
    position: [15, 0, 4],
    color: "#5184C0",
    accentColor: "#DFE1E6",
    scale: 1.9,
    elevation: 1.4,
    description: "A look into mood stabilizers, psychotherapy, lifestyle management, and psychiatric support systems."
  },
  {
    id: 5,
    title: "Coping & Support Systems",
    subtitle: "Building resilience on land",
    route: "/island/5",
    position: [2, 0, 12],
    color: "#05395E",
    accentColor: "#91BFF6",
    scale: 2.0,
    elevation: 1.3,
    description: "Practical strategies for self-monitoring, family support, crisis planning, and daily wellness habits."
  },
  {
    id: 6,
    title: "History & Creative Minds",
    subtitle: "The connection with artistic genius",
    route: "/island/6",
    position: [-20, 0, 5],
    color: "#91BFF6",
    accentColor: "#5184C0",
    scale: 1.6,
    elevation: 1.0,
    description: "Tracing historical figures, artists, and writers who navigated these waves and channelled them into masterpiece works."
  }
];
