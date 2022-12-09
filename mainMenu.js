const menu = async (menuContainer) => {
  const {
    textStyle,
    mainCanvas: { width, height },
  } = config;

  const title = new PIXI.Text("Wellcome to Pacman", textStyle);
  const subtitle = new PIXI.Text("Press any button to start", textStyle);

  const ghostTexture = loader.resources.GHOST.texture;

  title.anchor.x = 0.5;
  title.position.x = width / 2;
  const initialTitleY = height / 3;
  title.position.y = initialTitleY;
  title.scale.set(1.5);

  subtitle.anchor.x = 0.5;
  subtitle.position.x = width / 2;
  const initialSubtitleY = height / 2;
  subtitle.position.y = initialSubtitleY;

  menuContainer.addChild(title, subtitle);

  const ticker = new PIXI.Ticker();

  let counter = 0;

  const ghosts = [];

  const createGhostSprite = () => {
    const ghost = new PIXI.Sprite(ghostTexture);
    ghost.scale.set(0.125);
    ghost.anchor.set(0.5);
    ghost.position.x = width + ghost.width;
    ghost.position.y = Math.random() * height;
    return ghost;
  };

  const updateTitlePos = () => {
    title.position.y = Math.sin(counter) * 20 + initialTitleY;
    subtitle.position.y = Math.cos(counter + 10) * 20 + initialSubtitleY;
    counter += 0.05;
  };

  const updateGhostPos = () => {
    ghosts.forEach(({ sprite, vector, angle }) => {
      sprite.position.x += vector.x;
      sprite.position.y += vector.y;
      sprite.rotation += angle;
    });
  };

  setInterval(() => {
    const ghostVector = new Vector(
      Math.random() * -2 - 1,
      Math.random() * 2 - 1
    );
    const angle = Math.random() * 0.05;
    const ghostSprite = createGhostSprite();
    ghosts.push({ sprite: ghostSprite, vector: ghostVector, angle });
    menuContainer.addChild(ghostSprite);
  }, 1000);

  ticker.add(updateTitlePos);
  ticker.add(updateGhostPos);

  ticker.start();

  return new Promise((resolve) => {
    window.document.onkeydown = (e) => {
      clearContainer(menuContainer);
      ticker.stop();
      app.stage.removeChild(menuContainer);
      resolve();
    };
  });
};
