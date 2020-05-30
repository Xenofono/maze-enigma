const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 14;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: width,
    height: height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

const shape = Bodies.rectangle(0, 0, 50, 50, {
  isStatic: true,
});

//walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 2, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 2, height, {
    isStatic: true,
  }),
];

World.add(world, walls);

const arrayFactory = (x, y) =>
  Array(x)
    .fill(null)
    .map(() => Array(y).fill(false));

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

const grid = arrayFactory(cellsVertical, cellsHorizontal);
const verticals = arrayFactory(cellsVertical, cellsHorizontal - 1);
const horizontals = arrayFactory(cellsVertical - 1, cellsHorizontal);

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const iterateMaze = (row, column) => {
  //if cell has been visited then return early
  if (grid[row][column]) return;

  //mark cell as visited
  grid[row][column] = true;
  //assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);
  //for each neighbor...
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;

    //see if neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue;
    }

    //if we have visited neighbor, visit next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    //remove a wall from horizontals or verticals
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }

    iterateMaze(nextRow, nextColumn);
  }

  //visit next cell
};

iterateMaze(1, 1);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      10,
      {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "orange",
        },
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      10,
      unitLengthY,
      {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "orange",
        },
      }
    );
    World.add(world, wall);
  });
});

//goal of game is to get player to this object
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    isStatic: true,
    label: "goal",
    render: {
      fillStyle: "green",
    },
  }
);

World.add(world, goal);

//player

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "player",
});
World.add(world, ball);

document.addEventListener("keydown", ({ keyCode }) => {
  const { x, y } = ball.velocity;
  switch (keyCode) {
    case 87:
      Body.setVelocity(ball, { x, y: y - 5 });
      break;
    case 68:
      Body.setVelocity(ball, { x: x + 5, y: 0 });
      break;
    case 83:
      Body.setVelocity(ball, { x, y: y + 5 });
      break;
    case 65:
      Body.setVelocity(ball, { x: x - 5, y: 0 });

      break;
  }
});

//win condition

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((pair) => {
    const labels = ["player", "goal"];

    if (
      labels.includes(pair.bodyA.label) &&
      labels.includes(pair.bodyB.label)
    ) {
      console.log("user won");
      world.gravity.y = 1;
      world.bodies
        .filter((body) => body.label === "wall")
        .forEach((body) => Body.setStatic(body, false));

      Body.setStatic(goal, false);
      document.querySelector(".winner").classList.remove("hidden")
    }
  });
});
