const endGameScreen = async (gameRes, endGameContainer) => {
  const {
    textStyle,
    mainCanvas: { width, height },
  } = config;

  const title = new PIXI.Text(
    gameRes ? "Congratulations! You won!" : "You lost!",
    textStyle
  );
  const subtitle1 = new PIXI.Text("Press Enter to restart", textStyle);
  const subtitle2 = new PIXI.Text("Press Esc to go to menu", textStyle);

  title.anchor.x = 0.5;
  title.position.x = width / 2;
  title.position.y = height * 0.3;
  title.scale.set(1.5);

  subtitle1.anchor.x = 0.5;
  subtitle1.position.x = width / 2;
  subtitle1.position.y = height * 0.5;

  subtitle2.anchor.x = 0.5;
  subtitle2.position.x = width / 2;
  subtitle2.position.y = height * 0.6;

  endGameContainer.addChild(title, subtitle1, subtitle2);

  return new Promise((resolve) => {
    window.document.onkeydown = (e) => {
      switch (e.key) {
        case "Enter": {
          clearContainer(endGameContainer);
          app.stage.removeChild(endGameContainer);
          return resolve("play");
        }
        case "Escape": {
          clearContainer(endGameContainer);
          app.stage.removeChild(endGameContainer);
          return resolve("menu");
        }
        default:
          return;
      }
    };
  });
};
