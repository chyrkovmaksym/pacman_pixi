const play = async (mainContainer) => {
  const {
    scores: { dotRadius, dotColor },
    textStyle,
    frame: { frameColor, frameWidth, frameTransparency },
    mainCanvas: { width, height },
  } = config;

  let isAlive = true;

  let scoresCounter = 0;
  const vector = new Vector(0, 0);

  const createDot = (position) => {
    const dot = new PIXI.Graphics()
      .beginFill(dotColor)
      .drawCircle(0, 0, dotRadius);
    dot.position.set(position.x, position.y);
    return dot;
  };

  const title = new PIXI.Text("Pacman", textStyle);
  const scores = new PIXI.Text(`Scores: ${scoresCounter}`, textStyle);

  const frame = new PIXI.Graphics()
    .lineStyle(frameWidth, frameColor, frameTransparency)
    .drawRect(
      frameWidth,
      frameWidth,
      width - frameWidth * 2,
      height - frameWidth * 2
    );

  const bgTexture = loader.resources.BG.texture;
  const pacmanTexture1 = loader.resources.PAC1.texture;
  const pacmanTexture2 = loader.resources.PAC2.texture;
  const ghostTexture = loader.resources.GHOST.texture;

  const spriteBG = new PIXI.Sprite(bgTexture);
  const pacman = new PIXI.Sprite(pacmanTexture1);
  const ghost = new PIXI.Sprite(ghostTexture);

  spriteBG.width = width;
  spriteBG.height = height;

  ghost.anchor.x = 0.5;
  ghost.anchor.y = 0.5;
  ghost.position.set(20, 20);
  ghost.scale.set(0.125);

  pacman.anchor.x = 0.5;
  pacman.anchor.y = 0.5;
  pacman.scale.set(0.125);
  pacman.position.set(800 / 2, 600 / 2);

  title.anchor.x = 0.5;
  title.position.set(800 / 2, 0);

  scores.anchor.x = 1;
  scores.position.set(800 - 4, 0);

  mainContainer.addChild(spriteBG, title, scores, frame, pacman, ghost);

  const dots = [];
  const dotSpeed = 7;

  for (let i = 0; i <= width; i += 100) {
    for (let j = 0; j <= height; j += 100) {
      let dot = createDot({ x: i, y: j });
      mainContainer.addChild(dot);
      dots.push(dot);
    }
  }

  const maxScores = dots.length;

  setInterval(() => {
    pacman.texture =
      pacman.texture === pacmanTexture2 ? pacmanTexture1 : pacmanTexture2;
  }, 300);

  window.document.onkeydown = (e) => {
    console.log(e.type, e.key);
    let offset = 0.5;
    switch (e.key) {
      case "ArrowLeft":
        vector.x -= offset;
        break;
      case "ArrowRight":
        vector.x += offset;
        break;
      case "ArrowUp":
        vector.y -= offset;
        break;
      case "ArrowDown":
        vector.y += offset;
        break;
      default:
        return;
    }
    vector.normalize();
  };

  const scoresAnimQueue = [];

  const animateScoreTitle = () => {
    scoresAnimQueue[0].status = "inProgress";
    let expands = true;
    const interval = setInterval(() => {
      const size = scores.scale.x;
      if (expands) {
        scores.scale.set(size + 0.02);
        if (size >= 1.3) {
          expands = false;
        }
      } else {
        scores.scale.set(size - 0.02);
        if (size <= 1) {
          clearInterval(interval);
          scoresAnimQueue.shift();
          return;
        }
      }
    }, 1000 / 60);
  };

  const updateDotPosition = (dot, scoreTicker) => () => {
    const scoreDirection = new Vector(
      scores.position.x - dot.position.x,
      scores.position.y - dot.position.y
    );
    if (scoreDirection.mag() <= 10) {
      scoresCounter++;
      scores.text = `Scores: ${scoresCounter}`;
      mainContainer.removeChild(dot);
      scoresAnimQueue.push({ status: "waiting" });
      return scoreTicker.destroy();
    }
    scoreDirection.normalize();

    dot.position.x += scoreDirection.x * dotSpeed;
    dot.position.y += scoreDirection.y * dotSpeed;
  };

  const checkMath = () => {
    pacman.x;
    pacman.y;
    dots.slice().forEach((dot) => {
      if (getCollision(dot, pacman)) {
        if (dots.includes(dot)) {
          dots.splice(dots.indexOf(dot), 1);
          const scoreTicker = new PIXI.Ticker();
          dot.tint = 0xff0000;
          scoreTicker.add(updateDotPosition(dot, scoreTicker));
          scoreTicker.start();
        }
      }
    });

    if (getCollision(ghost, pacman)) {
      isAlive = false;
    }
  };

  const updatePositions = () => {
    if (vector.x < 0) {
      pacman.scale.y = -0.125;
    } else {
      pacman.scale.y = 0.125;
    }

    pacman.position.x += vector.x * 3;
    pacman.position.y += vector.y * 3;
    pacman.rotation = vector.angle();

    vector.mult(0.98);

    pacman.position.x = (800 + pacman.position.x) % 800;
    pacman.position.y = (600 + pacman.position.y) % 600;

    const ghostVector = new Vector(
      pacman.position.x - ghost.position.x,
      pacman.position.y - ghost.position.y
    );

    if (ghostVector.mag() >= 1) {
      if (ghostVector.x < 0) {
        ghost.scale.x = 0.125;
      } else {
        ghost.scale.x = -0.125;
      }
    }

    ghostVector.normalize();

    ghost.position.x += ghostVector.x;
    ghost.position.y += ghostVector.y;

    ghost.position.x = (800 + ghost.position.x) % 800;
    ghost.position.y = (600 + ghost.position.y) % 600;
  };

  const ticker = new PIXI.Ticker();

  ticker.add(() => {
    updatePositions();
  });
  ticker.add(() => {
    checkMath();
  });
  ticker.add(() => {
    if (scoresAnimQueue.length && scoresAnimQueue[0].status === "waiting") {
      animateScoreTitle();
    }
  });

  ticker.start();

  console.log(dots.length);

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (scoresCounter >= maxScores) {
        clearContainer(mainContainer);
        ticker.stop();
        clearInterval(interval);
        app.stage.removeChild(mainContainer);
        resolve(true);
      }
      if (!isAlive) {
        clearContainer(mainContainer);
        ticker.stop();
        clearInterval(interval);
        app.stage.removeChild(mainContainer);
        resolve(false);
      }
    }, 500);
  });
};
