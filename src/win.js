import { JSON36 } from "weird-json";

window.addEventListener("DOMContentLoaded", () => {
  try {
    const paramPairs = location.search
      .replace(/^\?/, "")
      .split("&")
      .map((s) => s.split("="));
    const resultPair = paramPairs.find((p) => p[0] === "result");
    const result = JSON36.parse(resultPair[1]);
    const score = result.score;

    const shareUrl = encodeURIComponent("https://runet-history.ru/");
    let shareComment = null;

    let strings = {
      title: null,
      red: `Вы собрали ${score} из 65 объектов`,
      text: null,
    };
    if (score >= 56) {
      shareComment =
        "Я отлично разбираюсь в истории Рунета. А как ты, %username%?";
      strings.title = "Первыйнах!";
      strings.text = `
        <p class="results__text">Примите уважение интернет-дедов, вы многое повидали. Пока сегодняшняя школота ещё ходила пешком под стол, вы уже вовсю собирали лулзы и мочили элитных троллей в комментариях.</p>
        <p class="results__text">Вы помните мемы Лурка с Башем, приветливые «о-оу» от аськи и шутки Масяни. С таким человеком приятно иметь дело: респектуем чувству юмора, смекалке и знанию истории нашей сети. Поздравляем</p>`;
    } else if (score >= 41) {
      shareComment =
        "Я хорошо знаю историю этих ваших интернетов. А как ты, %username%?";
      strings.title = "Зачот!";
      strings.text = `
      <p class="results__text">Вы знаете историю наших интернетов «на твёрдую четвёрку». В беседе можете легко развлечь отстающих товарищей: показать мемчик, рассказать, кто тут в сети главный и поставить диагноз по юзерпику.</p>
      <p class="results__text">Если вы попадёте в интернет-дискуссию — обязательно выйдете из неё тонко и красиво. Мы гарантируем это. Вы в курсе, что творится с миром айти, где купить классный девайс и качнуть свежий фильм на вечер. Респект!</p>
      `;
    } else if (score >= 27) {
      shareComment =
        "Я знаю Рунет «на троечку». Зато имею здоровый румянец и хорошую осанку.";
      strings.title = "Нуващще!";
      strings.text = `
      <p class="results__text">Что происходит в Рунете вы знаете «на троечку». Может, оно и к лучшему — от долгого сидения за компом развивается слепота и сколиоз. В детстве вы наверняка были сыном маминой подруги: читали книжки, пока другие скроллили анекдоты.</p>
      <p class="results__text">В целом, прогноз хороший. Если подтянуть матчасть и освежить историю, вы вполне адаптируетесь в наших интернетах. Посмотрите игры или мемчики — они как вино, не стареют со временем.</p>
      `;
    } else if (score >= 14) {
      shareComment =
        "В истории Рунета я разбираюсь не очень. Зато руки у меня — золотые!";
      strings.title = "На этот раз как-то не удалось.";
      strings.text = `
      <p class="results__text">Вы шли к успеху. Не получилось, не фартануло. Возможно, вы где-то слышали про Фидо или Хабр, а друзья кидали вам видосик с «опасным поцыком». Но вас сложно назвать знатоком Рунета: «ссылка, она для кого — отдых, а для кого — наказание».</p>
      <p class="results__text">Хорошая новость: пока не пришёл «Чебурнет», есть время погуглить культурные достижения сети и восхититься её богатством. Благо, интернет помнит всё. Мемы, истории успеха наших героев и проектов дадут +100500 к настроению и эрудиции.</p>
      `;
    } else {
      shareComment =
        "Я в гробу видал эти ваши интернеты. Лучше лежать на траве и пить берёзовый сок.";
      strings.title = "Это печально.";
      strings.text = `
      <p class="results__text">Вы либо ненавидите всё русское и видали в гробу историю Рунета, либо выросли в глухом домике возле леса, где надо залезть на берёзку, чтобы поймать сигнал. Факт остаётся фактом: вы не такой, как все.</p>
      <p class="results__text">Если вам провести интернет, вы вряд ли тут же победите онлайн-тролля в словесном самбо. Но начнёте путешествие в дивный новый мир сети. Там кроме информационного мусора, диванных войск и анонимусов есть масса чего прекрасного и забавного.</p>
      `;
    }
    shareComment = encodeURIComponent(shareComment);

    document.querySelector(
      ".results__content .results__title--first"
    ).innerHTML = strings.title;
    document.querySelector(".results__content .results__title--red").innerHTML =
      strings.red;
    document.querySelector(".results__content .results__texts").innerHTML =
      strings.text;

    const shareTitle = encodeURIComponent("История Рунета");
    const shareImage = encodeURIComponent(
      "http://runet-history.ru/assets/opengraph.png"
    );

    document.querySelector(
      ".share-tw"
    ).href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareComment}`;

    // document.querySelector(
    //   ".share-ok"
    // ).href = `https://connect.ok.ru/offer?url=${shareUrl}&title=${shareComment}&imageUrl=${shareImage}&st.comments=${shareComment}`;

    document.querySelector(
      ".share-vk"
    ).href = `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}&image=${shareImage}&comment=${shareComment}`;

    document.querySelector(
      ".share-tg"
    ).href = `https://t.me/share/url?url=${shareUrl}&text=${shareComment}`;
  } catch (error) {
    console.log(error);
    document.querySelector(
      ".results__content .results__title--first"
    ).innerHTML = `Ой, что-то пошло не так`;
    document.querySelector(
      ".results__content .results__title--red"
    ).innerHTML = `Ваш результат не парсится`;
  }
});
