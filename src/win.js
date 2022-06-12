import "./polyfill";

window.addEventListener("DOMContentLoaded", function () {
  try {
    const score = parseInt(window.localStorage.getItem("gameScore") || 0);
    const gameStarted = window.localStorage.getItem("gameStarted");
    const gameFinishPage = window.localStorage.getItem("gameFinishPage");

    if (!gameStarted) {
      window.location.href = "/";
    }
    if (
      !gameFinishPage ||
      window.location.pathname !== `/end-${gameFinishPage}/`
    ) {
      window.location.href = "/";
    }

    const shareUrl = encodeURIComponent(window.location.href);
    let shareComment = null;
    let scoreText = `Вы ответили на ${score} из 65 вопросов`;

    if (score <= 13) {
      shareComment =
        "Я в гробу видал эти ваши интернеты. Лучше лежать на траве и пить берёзовый сок.";
    } else if (score <= 26) {
      shareComment =
        "В истории Рунета я разбираюсь не очень. Зато руки у меня — золотые!";
    } else if (score <= 40) {
      shareComment =
        "Я знаю Рунет «на троечку». Зато имею здоровый румянец и хорошую осанку.";
    } else if (score <= 55) {
      shareComment =
        "Я хорошо знаю историю этих ваших интернетов. А как ты, %username%?";
    } else {
      shareComment =
        "Я отлично разбираюсь в истории Рунета. А как ты, %username%?";
    }

    shareComment = encodeURIComponent(shareComment);

    // document.querySelector(
    //   ".results__content .results__title--first"
    // ).innerHTML = strings.title;
    document.querySelector(".results__content .results__title--red").innerHTML =
      scoreText;
    // document.querySelector(".results__content .results__texts").innerHTML =
    //   strings.text;

    const shareTitle = encodeURIComponent("История Рунета");
    const vkImage = document
      .querySelector('meta[property="vk:image"]')
      .getAttribute("content");

    document.querySelector(
      ".share-tw"
    ).href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareComment}`;

    // document.querySelector(
    //   ".share-ok"
    // ).href = `https://connect.ok.ru/offer?url=${shareUrl}&title=${shareComment}&imageUrl=${shareImage}&st.comments=${shareComment}`;

    document.querySelector(
      ".share-vk"
    ).href = `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}&image=${vkImage}&comment=${shareComment}`;

    document.querySelector(
      ".share-tg"
    ).href = `https://t.me/share/url?url=${shareUrl}&text=${shareComment}`;
  } catch (error) {
    console.log(error);
  }
});
