document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("playButton");
  const stopButton = document.getElementById("stopButton");
  const resetButton = document.getElementById("resetButton");
  const levelDisplay = document.getElementById("level");
  const linesClearedDisplay = document.getElementById("linesCleared");
  const scoreDisplay = document.getElementById("score");
  const canvas = document.getElementById("myCanvas");

  const buttons = [playButton, stopButton, resetButton];
  buttons.forEach((button) => {
    button.addEventListener("mousedown", () => {
      button.style.transform = "scale(0.95)";
    });
    button.addEventListener("mouseup", () => {
      button.style.transform = "scale(1)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
    });
  });

  let isGlowing = false;

  function toggleCanvasGlow(state) {
    if (state) {
      canvas.style.boxShadow = "0px 0px 30px 10px rgba(255, 87, 34, 0.8)";
      isGlowing = true;
    } else {
      canvas.style.boxShadow = "0px 5px 10px rgba(0, 0, 0, 0.3)";
      isGlowing = false;
    }
  }

  playButton.addEventListener("click", () => {
    toggleCanvasGlow(true);
  });

  stopButton.addEventListener("click", () => {
    toggleCanvasGlow(false);
  });

  resetButton.addEventListener("click", () => {
    toggleCanvasGlow(false);
    animateResetInfo();
  });

  function animateText(element) {
    element.style.transition = "transform 0.2s ease, color 0.2s ease";
    element.style.transform = "scale(1.2)";
    element.style.color = "#ffd700";

    setTimeout(() => {
      element.style.transform = "scale(1)";
      element.style.color = "#fff";
    }, 200);
  }

  const gameInfoObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        animateText(mutation.target);
      }
    });
  });

  [levelDisplay, linesClearedDisplay, scoreDisplay].forEach((element) => {
    gameInfoObserver.observe(element, { childList: true });
  });

  function animateResetInfo() {
    const gameInfo = document.querySelector(".game-info");
    gameInfo.style.transition = "opacity 0.5s ease";
    gameInfo.style.opacity = "0";
    setTimeout(() => {
      gameInfo.style.opacity = "1";
    }, 500);
  }
});
