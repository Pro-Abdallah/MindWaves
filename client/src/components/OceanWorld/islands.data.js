/**
 * islands.data.js
 *
 * Configurable details for the 6 interactive islands representing Bipolar Disorder topics.
 * Each island has specific coordinates in the 3D scene (x, y, z) and custom textual copy.
 */

export const islandsData = [
  {
    id: 1,
    title: "The Still Island",
    subtitle: "What Bipolar Disorder Is",
    route: "/island/1",
    position: [-14, 0, -8],
    color: "#5184C0", // Steel Blue
    accentColor: "#91BFF6", // Sky Blue
    scale: 2.1,
    elevation: 1.5,
    image: "/island_still.png",
    heroImage: "/hero_still_island.png",
    introText: "At first glance, everything here feels calm. The sea is quiet. The land is steady. But beneath the surface, something is always shifting.",
    mainContent: [
      "Bipolar disorder is a mental health condition that affects mood, energy, activity, and the way a person experiences the world around them.",
      "It is not simply \"being emotional\" or having mood swings.",
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
    position: [-8, 0, 10],
    color: "#C05118", // Deep Ember
    accentColor: "#F0813A",
    scale: 1.8,
    elevation: 1.1,
    image: "/island_burning.png",
    heroImage: "/hero_burning_island.png",
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
    position: [6, 0, -12],
    color: "#91BFF6", // Sky Blue
    accentColor: "#DFE1E6", // Mist
    scale: 2.3,
    elevation: 2.0,
    image: "/island_sunken.png",
    heroImage: "/hero_sunken_island.png",
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
  },
  {
    id: 4,
    title: "The Twin Islands",
    subtitle: "Bipolar I & Bipolar II",
    route: "/island/4",
    position: [15, 0, 4],
    color: "#5184C0",
    accentColor: "#DFE1E6",
    scale: 1.9,
    elevation: 1.4,
    image: "/island_twin.png",
    heroImage: "/hero_twin_island.png",
    introText: "These islands belong to the same sea. But they are not the same place.",
    mainContent: [
      "Bipolar disorder exists in different forms.",
      "Bipolar I includes full manic episodes that are often intense, visible, and disruptive.",
      "Bipolar II involves hypomania a milder form of mania that may appear productive or even normal from the outside combined with long and deeply painful depressive episodes.",
      "Because hypomania may seem normal, Bipolar II is often misunderstood or overlooked entirely.",
      "Both experiences are real.",
      "Both can deeply affect a person's life."
    ],
    endingLine: "Not every storm arrives the same way."
  },
  {
    id: 5,
    title: "The Root Island",
    subtitle: "Causes",
    route: "/island/5",
    position: [2, 0, 12],
    color: "#05395E",
    accentColor: "#91BFF6",
    scale: 2.0,
    elevation: 1.3,
    image: "/island_root.png",
    heroImage: "/hero_root_island.png",
    introText: "Nothing on this island grew overnight. Every root reaches into something deeper.",
    mainContent: [
      "There is no single cause of bipolar disorder.",
      "Research suggests it develops through a combination of interconnected factors.",
      "Genetics can increase vulnerability.",
      "Changes in brain chemistry may affect mood regulation.",
      "Trauma and stressful life experiences can shape emotional responses over time.",
      "Sleep disruption and substance use may also trigger or intensify episodes.",
      "These causes do not exist separately.",
      "Like roots beneath the ground, they connect in ways that are not always visible from the surface."
    ],
    endingLine: "What appears suddenly often begins far below the surface."
  },
  {
    id: 6,
    title: "The Lighthouse Island",
    subtitle: "Treatment & Recovery",
    route: "/island/6",
    position: [-20, 0, 5],
    color: "#91BFF6",
    accentColor: "#5184C0",
    scale: 1.6,
    elevation: 1.0,
    image: "/island_lighthouse.png",
    heroImage: "/hero_lighthouse_island.png",
    introText: "The sea does not become calm here. But for the first time, there is a direction.",
    mainContent: [
      "Recovery does not mean becoming a different person.",
      "And it does not mean the waves disappear forever.",
      "Treatment can help people manage bipolar disorder and build stability over time.",
      "Medication may help regulate mood episodes.",
      "Therapy can provide coping strategies, emotional understanding, and support.",
      "Healthy routines, sleep, and trusted relationships also play an important role in recovery.",
      "Some days remain difficult.",
      "But recovery is possible.",
      "Not perfect.",
      "Possible."
    ],
    endingLine: "You cannot control the sea. But you can learn how to navigate it."
  }
];
