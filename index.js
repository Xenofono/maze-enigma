const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cells = 3;
const width = 600;
const height = 600;
const unitLength = width / cells;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
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

const grid = arrayFactory(cells, cells);
const verticals = arrayFactory(cells, cells - 1);
const horizontals = arrayFactory(cells - 1, cells);

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

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
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
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
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      10,
      {
        isStatic: true,
        label: "wall",
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      10,
      unitLength,
      {
        isStatic: true,
        label: "wall",
      }
    );
    World.add(world, wall);
  });
});

//goal of game is to get player to this object
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  { isStatic: true, label: "goal" }
);

World.add(world, goal);

//player

const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength * 0.25, {
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
    }
  });
});
