export default {
  doggo: {
    x: 1400,
    y: 960,
    sprite: "doggo",
    quiz: {
      area: {
        x: 1300,
        y: 960,
        width: 500,
        height: 350,
        origin: [0, 1],
      },
      quiestion: "Что это за собачка?",
      answers: [
        `Пёс MS DOS`,
        `Собака Фидонета`,
        `символ TDK\nCorporation`,
        `DOGE`,
      ],
      correctNumber: 2,
      correctAnswerLines: [
        "Верно, я — собака Фидонета — маскот американской некоммерческой оффлайновой компьютерной сети.",
        "В 1990 году её первые узлы появились в Новосибирске и распространились по другим городам. В итоге в России сложилась целая субкультура фидошников со своим фольклором, жаргоном и веселыми офлайн-встречами aka фидопойками. Вуф!",
      ],
      wrongAnswerLines: [
        "Неправильно. Я — собака Фидонета — маскот американской некоммерческой оффлайновой компьютерной сети.",
        "В 1990 году её первые узлы появились в Новосибирске и распространились по другим городам. В итоге в России сложилась целая субкультура фидошников со своим фольклором, жаргоном и веселыми офлайн-встречами aka фидопойками. Вуф!",
      ],
    },
  },
  anek: {
    x: 3150,
    y: 330,
    sprite: "anek",
    quiz: {
      area: {
        x: 3050,
        y: 330,
        width: 500,
        height: 350,
        origin: [0, 1],
      },
      quiestion: "Что это за Анекдот?",
      answers: [`Хз`, `Хз`, `Хз`, `Хз`],
      correctNumber: 1,
      correctAnswerLines: [
        "Верно, я — собака Фидонета — маскот американской некоммерческой оффлайновой компьютерной сети.",
        "В 1990 году её первые узлы появились в Новосибирске и распространились по другим городам. В итоге в России сложилась целая субкультура фидошников со своим фольклором, жаргоном и веселыми офлайн-встречами aka фидопойками. Вуф!",
      ],
      wrongAnswerLines: [
        "Неправильно. Я — собака Фидонета — маскот американской некоммерческой оффлайновой компьютерной сети.",
        "В 1990 году её первые узлы появились в Новосибирске и распространились по другим городам. В итоге в России сложилась целая субкультура фидошников со своим фольклором, жаргоном и веселыми офлайн-встречами aka фидопойками. Вуф!",
      ],
    },
  },
  some_place: {
    x: 230,
    y: 100,
    sprite: "some_place",
  },
  mountain: {
    x: 10,
    y: 960,
    sprite: "mountain",
    colliders: [
      { x: 35, y: 950, width: 830, height: 165 },
      { x: 75, y: 785, width: 780, height: 50 },
      { x: 100, y: 735, width: 720, height: 50 },
      { x: 140, y: 685, width: 660, height: 50 },
      { x: 170, y: 635, width: 600, height: 50 },
      { x: 200, y: 585, width: 520, height: 20 }
    ],
  },
  biblioteka: {
    x: 2430,
    y: 968,
    sprite: "biblioteka",
    colliders: [
      { x: 2450, y: 965, width: 380, height: 365 }
    ],
  },
  grannies: {
    x: 1380,
    y: 425,
    sprite: "grannies",
    dialogue: {
      area: {
        x: 1300,
        y: 425,
        width: 280,
        height: 280,
        origin: [0, 1],
      },
      lines: [
        { text: 'Здарова бабка', player: true },
        { text: 'Здоров, внучок', player: false },
        { text: 'Пачом бананы', player: true },
        { text: 'А всё ёпта', player: false },
      ],
    },
  },
  domen_ru_1994: {
    x: 1650,
    y: 960,
    sprite: "domen_ru_1994",
  },
  Lebedev_1996: {
    x: 3250,
    y: 957,
    sprite: "Lebedev_1996",
    popup: {
      area: {
        x: 3140,
        y: 957,
        width: 500,
        height: 350,
        origin: [0, 1],
      },
      bubble: {
        x: 3230,
        y: 937,
        origin: [0, 1],
        text: 'Ну умер и умер.',
      },
    },
  },
  opera_com_1996: {
    x: 3800,
    y: 320,
    sprite: "opera.com_1996",
  },
  yabloko_ru_1996: {
    x: 3700,
    y: 965,
    sprite: "yabloko_ru_1996",
    colliders: [
      { x: 3700, y: 525, width: 375, height: 200 },
      { x: 3850, y: 930, width: 95, height: 400 }
    ],
  },
  Rambler_1997: {
    x: 4450,
    y: 480,
    sprite: "Rambler_1997",
    colliders: [
      { x: 4450, y: 470, width: 275, height: 70 },
    ],
  },
  Krovatka_1997: {
    x: 4600,
    y: 965,
    sprite: "Krovatka_1997",
  },
  tetris_1997: {
    x: 5180,
    y: 225,
    sprite: "tetris_1997",
  },
  ICQ_1997: {
    x: 6100,
    y: 960,
    sprite: "ICQ_1997",
  },
  Zvuki_ru_1998: {
    x: 6200,
    y: 960,
    sprite: "Zvuki_ru_1998",
  },
  Rif_1997: {
    x: 7100,
    y: 967,
    sprite: "Rif_1997",
    colliders: [
      { x: 7310, y: 645, width: 30, height: 30 },
      
    ],
  },
  Kaspersky_ru_1997: {
    x: 6100,
    y: 425,
    sprite: "Kaspersky_ru_1997",
  },
  bazar_1997: {
    x: 5100,
    y: 970,
    sprite: "bazar_1997",
  },
  pepsi_1998: {
    x: 8300,
    y: 960,
    sprite: "pepsi_1998",
  colliders: [
    { x: 8306, y: 905, width: 375, height: 220 },
    { x: 8430, y: 930, width: 160, height: 330 }
  ],
  },
  mail_ru_1998: {
    x: 7985,
    y: 960,
    sprite: "mail_ru_1998",
  },
  Webmoney_1998: {
    x: 7550,
    y: 375,
    sprite: "Webmoney_1998",
  },
  fuck_ru_1998: {
    x: 8700,
    y: 955,
    sprite: "fuck_ru_1998",
  },
  TV_1999: {
    x: 8800,
    y: 270,
    sprite: "TV_1999",
  },
};
