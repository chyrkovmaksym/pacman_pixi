sample2 = async () => {
  createPixiApplication();

  const { resources } = config;

  const gameContainer = new PIXI.Container();
  const menuContainer = new PIXI.Container();
  const endGameContainer = new PIXI.Container();

  const loader = PIXI.Loader.shared;
  window.loader = loader;

  for (const key of Object.keys(resources)) {
    loader.add(key, resources[key]);
  }

  const loaderPromise = new Promise((resolve) => {
    loader.onComplete.add((e) => {
      resolve();
    });
  });

  loader.load();
  await loaderPromise;

  const gameController = async () => {
    app.stage.addChild(menuContainer);
    await menu(menuContainer);
    (async function startGame() {
      app.stage.addChild(gameContainer);
      const gameRes = await play(gameContainer);
      app.stage.addChild(endGameContainer);
      const endScreenRes = await endGameScreen(gameRes, endGameContainer);
      if (endScreenRes === "menu") gameController();
      else {
        startGame();
      }
    })();
  };

  await gameController();
};

createPixiApplication = () => {
  const { width, height, bgColor } = config.mainCanvas;

  const app = new PIXI.Application({
    width: width,
    height: height,
    backgroundColor: bgColor,
    transparent: false,
  });
  document.body.appendChild(app.view);
  window.app = app;
};

const clearContainer = (container) => {
  while (container.children.length > 0) {
    const child = container.getChildAt(0);
    container.removeChild(child);
  }
};
