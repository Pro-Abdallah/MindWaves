/**
 * islands.data.js
 *
 * Configurable details for the 3 core interactive islands representing Bipolar Disorder topics.
 */

export const islandsData = [
  {
    id: 1,
    title: "The Still Island",
    subtitle: "What Bipolar Disorder Is",
    route: "/island/1",
    position: [0, 0, -12],
    color: "#5184C0", // Steel Blue
    accentColor: "#91BFF6", // Sky Blue
    scale: 2.8,
    elevation: 1.5,
    image: "/island_still.png",
    introText: "At first glance, everything here feels calm. The sea is quiet. The land is steady. But beneath the surface, something is always shifting.",
    mainContent: [
      "Bipolar disorder is a mental health condition that affects mood, energy, activity, and the way a person experiences the world around them.",
      "It is not simply “being emotional” or having mood swings.",
      "The changes are deeper, more intense, and can affect sleep, thinking, decision-making, and daily life.",
      "Many people living with bipolar disorder appear completely fine from the outside, even while struggling internally.",
      "Around 1 in 200 people worldwide live with bipolar disorder.",
      "It is not caused by weakness, personality, or lack of self-control."
    ],
    endingLine: "Some storms cannot be seen from the shore."
  },
  {
    id: 2,
    title: "The Burning Island",
    subtitle: "Mania",
    route: "/island/2",
    position: [-16, 0, 6],
    color: "#05395E", // Deep Navy
    accentColor: "#ffaa00", // Vibrant Orange/Fire
    scale: 2.4,
    elevation: 1.1,
    image: "/island_burning.png",
    introText: "From far away, this island looks powerful. Bright. Alive. Almost impossible to ignore. But the closer you get, the more unstable it becomes.",
    mainContent: [
      "A manic episode can feel intense and unstoppable.",
      "Energy rises quickly.",
      "Sleep feels unnecessary.",
      "Thoughts move too fast to hold onto.",
      "A person may feel unusually confident, impulsive, or unstoppable.",
      "They may speak faster, take risks, spend recklessly, or believe nothing can go wrong.",
      "At first, mania can appear exciting or productive from the outside.",
      "But underneath, it can become overwhelming, dangerous, and difficult to control.",
      "One of the hardest parts of mania is that the person may not recognize anything is wrong while it is happening."
    ],
    endingLine: "Not every bright light is safe to follow."
  },
  {
    id: 3,
    title: "The Sunken Island",
    subtitle: "Depression",
    route: "/island/3",
    position: [16, 0, 6],
    color: "#91BFF6", // Sky Blue
    accentColor: "#DFE1E6", // Mist
    scale: 2.9,
    elevation: 2.0,
    image: "/island_sunken.png",
    introText: "This island barely rises above the water. Quiet. Heavy. Almost disappearing into the sea.",
    mainContent: [
      "A depressive episode is more than sadness.",
      "It can feel like exhaustion that sleep cannot fix.",
      "Like watching life continue from somewhere far away.",
      "Energy becomes difficult to find.",
      "Simple tasks feel impossibly heavy.",
      "Concentration fades.",
      "Isolation grows quietly.",
      "Some people lose interest in the things they once loved.",
      "Others feel nothing at all, even when they want to, but unable to feel much at all.",
      "Depression often remains invisible to others, even when someone is struggling deeply beneath the surface."
    ],
    endingLine: "Some people drown quietly."
  }
];
