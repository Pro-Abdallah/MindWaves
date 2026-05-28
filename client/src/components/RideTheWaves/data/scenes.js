export const scenes = [
  {
    id: 1,
    title: 'The Mother',
    situation: 'You enter the room as the mother and find your bipolar son sitting on the bed. His face is pale, and he shows a total loss of energy, appearing unable to move or even look up.',
    videoSrc: '/ride_the_waves/SCENE 1 – The Mother.MOV',
    choices: [
      {
        text: 'Tell him to get up and stop being lazy.',
        isSupportive: false,
        feedback: 'Bipolar disorder is not laziness; pressure can make the condition worse.'
      },
      {
        text: 'Ignore him and leave the room.',
        isSupportive: false,
        feedback: 'Ignoring him increases his feelings of loneliness and isolation.'
      },
      {
        text: 'Ask him how he is feeling.',
        isSupportive: true,
        feedback: 'Well done! Asking about his feelings makes him feel that someone understands him.'
      },
      {
        text: 'Sit with him and try to help.',
        isSupportive: true,
        feedback: 'Well done! Your presence and support provide him with safety during his moments of weakness.'
      }
    ]
  },
  {
    id: 2,
    title: 'The Coworker',
    situation: 'You are at the office, and your bipolar coworker is talking to you at an incredible speed. His thoughts are overlapping so fast that he can\'t seem to slow down or stay on one topic.',
    videoSrc: '/ride_the_waves/SCENE 2 – The Coworker.MOV',
    choices: [
      {
        text: 'Interrupt him and say, "You sound illogical and crazy."',
        isSupportive: false,
        feedback: 'A harsh reaction increases his tension and makes the condition worse.'
      },
      {
        text: 'Avoid dealing with him entirely in the office.',
        isSupportive: false,
        feedback: 'Avoidance makes him feel shunned and rejected by the team.'
      },
      {
        text: 'Listen to him with patience and calmness.',
        isSupportive: true,
        feedback: 'Well done! Listening reduces the pressure on him and builds trust.'
      },
      {
        text: 'Try to calmly guide the conversation to a specific point.',
        isSupportive: true,
        feedback: 'Well done! Calm guidance helps him gather his scattered thoughts.'
      }
    ]
  },
  {
    id: 3,
    title: 'The Groupmate',
    situation: 'While working with your bipolar classmate on a project, you notice he is extremely distracted, jumping between ideas quickly, and then suddenly withdrawing into total silence.',
    videoSrc: '/ride_the_waves/SCENE 3 – The Groupmate.MOV',
    choices: [
      {
        text: 'Exclude him from the task entirely.',
        isSupportive: false,
        feedback: 'Exclusion increases his sense of failure and may trigger a depressive episode.'
      },
      {
        text: 'Get angry and complain about him to the rest of the group.',
        isSupportive: false,
        feedback: 'Anger increases his psychological pressure and anxiety.'
      },
      {
        text: 'Ask if he needs help with a specific part.',
        isSupportive: true,
        feedback: 'Well done! Offering help shows your understanding of his circumstances.'
      },
      {
        text: 'Give him simple tasks and help him finish them.',
        isSupportive: true,
        feedback: 'Well done! Simple support improves his self-confidence and performance.'
      }
    ]
  },
  {
    id: 4,
    title: 'The Father',
    situation: 'You are the father, and suddenly your bipolar son loses all control. He begins shouting loudly and breaking things around the room in an intense, uncontrollable state.',
    videoSrc: '/ride_the_waves/SCENE 4 – The Father.mp4',
    choices: [
      {
        text: 'Tell him, "You need a Sheikh to break this spell."',
        isSupportive: false,
        feedback: 'This is a medical condition that requires professional treatment, not just spiritual solutions.'
      },
      {
        text: 'Shout at him and tell him to stop immediately.',
        isSupportive: false,
        feedback: 'Shouting increases aggression and danger in the moment.'
      },
      {
        text: 'Stay calm and try to ensure his safety.',
        isSupportive: true,
        feedback: 'Well done! Your calmness is what will help contain the situation and prevent injuries.'
      },
      {
        text: 'Seek immediate medical help (a psychiatrist).',
        isSupportive: true,
        feedback: 'Well done! Professional help is the most appropriate and safest solution for him.'
      }
    ]
  }
];
