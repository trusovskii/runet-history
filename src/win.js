import "./polyfill";
import { JSON36 } from "weird-json";

window.addEventListener("DOMContentLoaded", function () {
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
      red: `Вы ответили на ${score} из 65 вопросов`,
      text: null,
    };
    if (score >= 56) {
      shareComment =
        "Я отлично разбираюсь в истории Рунета. А как ты, %username%?";
      strings.title = "Первыйнах!";
      strings.text = `
        <p class="results__text">Примите уважение интернет-дедов, вы&nbsp;многое повидали. Пока сегодняшняя школота ещё ходила пешком под стол, вы&nbsp;уже вовсю собирали лулзы и&nbsp;мочили элитных троллей в&nbsp;комментариях.</p>
        <p class="results__text">Вы&nbsp;помните мемы Лурка с&nbsp;Башем, приветливые &laquo;о-оу&raquo; от&nbsp;аськи и&nbsp;шутки Масяни. С&nbsp;таким человеком приятно иметь дело: респектуем чувству юмора, смекалке и&nbsp;знанию истории нашей сети. Поздравляем.</p>`;
    } else if (score >= 41) {
      shareComment =
        "Я хорошо знаю историю этих ваших интернетов. А как ты, %username%?";
      strings.title = "Зачот!";
      strings.text = `
      <p class="results__text">Вы&nbsp;знаете историю наших интернетов &laquo;на&nbsp;твёрдую четвёрку&raquo;. В&nbsp;беседе можете легко развлечь отстающих товарищей: показать мемчик, рассказать, кто тут в&nbsp;сети главный и&nbsp;поставить диагноз по&nbsp;юзерпику.</p>
      <p class="results__text">Если вы&nbsp;попадёте в&nbsp;интернет-дискуссию&nbsp;&mdash; обязательно выйдете из&nbsp;неё тонко и&nbsp;красиво. Мы&nbsp;гарантируем это. Вы&nbsp;в&nbsp;курсе, что творится с&nbsp;миром айти, где купить классный девайс и&nbsp;качнуть свежий фильм на&nbsp;вечер. Респект!</p>
      `;
    } else if (score >= 27) {
      shareComment =
        "Я знаю Рунет «на троечку». Зато имею здоровый румянец и хорошую осанку.";
      strings.title = "Нуващще!";
      strings.text = `
      <p class="results__text">Что происходит в&nbsp;Рунете вы&nbsp;знаете &laquo;на&nbsp;троечку&raquo;. Может, оно и&nbsp;к&nbsp;лучшему&nbsp;&mdash; от&nbsp;долгого сидения за&nbsp;компом развивается слепота и&nbsp;сколиоз. В&nbsp;детстве вы&nbsp;наверняка были сыном маминой подруги: читали книжки, пока другие скроллили анекдоты.</p>
      <p class="results__text">В&nbsp;целом, прогноз хороший. Если подтянуть матчасть и&nbsp;освежить историю, вы&nbsp;вполне адаптируетесь в&nbsp;наших интернетах. Посмотрите игры или мемчики&nbsp;&mdash; они как вино, не&nbsp;стареют со&nbsp;временем.</p>
      `;
    } else if (score >= 14) {
      shareComment =
        "В истории Рунета я разбираюсь не очень. Зато руки у меня — золотые!";
      strings.title = "На&nbsp;этот раз как-то не&nbsp;удалось";
      strings.text = `
      <p class="results__text">Вы&nbsp;шли к&nbsp;успеху. Не&nbsp;получилось, не&nbsp;фартануло. Возможно, вы&nbsp;где-то слышали про Фидо или Хабр, а&nbsp;друзья кидали вам видосик с&nbsp;&laquo;опасным поцыком&raquo;. Но&nbsp;вас сложно назвать знатоком Рунета: &laquo;ссылка, она для кого&nbsp;&mdash; отдых, а&nbsp;для кого&nbsp;&mdash; наказание&raquo;.</p>
      <p class="results__text">Хорошая новость: пока не&nbsp;пришёл &laquo;Чебурнет&raquo;, есть время погуглить культурные достижения сети и&nbsp;восхититься её&nbsp;богатством. Благо, интернет помнит всё. Мемы, истории успеха наших героев и&nbsp;проектов дадут +100500&nbsp;к настроению и&nbsp;эрудиции.</p>
      `;
    } else {
      shareComment =
        "Я в гробу видал эти ваши интернеты. Лучше лежать на траве и пить берёзовый сок.";
      strings.title = "Это печально";
      strings.text = `
      <p class="results__text">Вы&nbsp;либо ненавидите всё русское и&nbsp;видали в&nbsp;гробу историю Рунета, либо выросли в&nbsp;глухом домике возле леса, где надо залезть на&nbsp;берёзку, чтобы поймать сигнал. Факт остаётся фактом: вы&nbsp;не&nbsp;такой, как все.</p>
      <p class="results__text">Если вам провести интернет, вы&nbsp;вряд&nbsp;ли тут&nbsp;же победите онлайн-тролля в&nbsp;словесном самбо. Но&nbsp;начнёте путешествие в&nbsp;дивный новый мир сети. Там кроме информационного мусора, диванных войск и&nbsp;анонимусов есть масса чего прекрасного и&nbsp;забавного.</p>
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
