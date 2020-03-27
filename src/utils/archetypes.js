export default [
  {
    type: 'medic',
    health: 3,
    strength: 6,
    skills: [
      {
        type: 'heal',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 1,
      },
      {
        type: 'sprint',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 1,
      },
    ],
  },
  {
    type: 'geologist',
    health: 3,
    strength: 3,
    skills: [
      {
        type: 'intuition',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 0,
      },
      {
        type: 'clear',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 1,
      },
    ],
  },
  {
    type: 'scoot',
    health: 3,
    strength: 2,
    skills: [
      {
        type: 'guide',
        cost: 0,
        perGame: 3,
        perTurn: Infinity,
      },
      {
        type: 'furtivity',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'diver',
    health: 3,
    strength: 1,
    skills: [
      {
        type: 'dive',
        cost: 2,
        perGame: Infinity,
        perTurn: Infinity,
      },
      {
        type: 'amphibious',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'bodyguard',
    health: 5,
    strength: 7,
    skills: [
      {
        type: 'repulse',
        cost: 1,
        perGame: Infinity,
        perTurn: Infinity,
      },
      {
        type: 'protect',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'chef',
    health: 3,
    strength: 8,
    skills: [
      {
        type: 'lead',
        cost: 1,
        perGame: Infinity,
        perTurn: 1,
      },
      {
        type: 'experienced',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'engineer',
    health: 3,
    strength: 4,
    skills: [
      {
        type: 'demolish',
        cost: 2,
        perTurn: Infinity,
        perGame: 3,
      },
      {
        type: 'careful',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'climber',
    health: 5,
    strength: 5,
    skills: [
      {
        type: 'ensure',
        cost: 1,
        perTurn: Infinity,
        perGame: Infinity,
      },
      {
        type: 'agile',
        cost: 0,
        perTurn: Infinity,
        perGame: Infinity,
      },
    ],
  },
]
