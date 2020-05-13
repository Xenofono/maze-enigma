const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const engine = Engine.create();
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
  Bodies.rectangle(width / 2, 0, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 40, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 40, height, {
    isStatic: true,
  }),
];

World.add(world, walls);

const arrayFactory = (x, y) =>
  Array(x)
    .fill(null)
    .map(() => Array(y).fill(false));

const grid = arrayFactory(cells, cells);
const verticals = arrayFactory(cells, cells-1);
const horizontals = arrayFactory(cells-1, cells);

const startRow = Math.floor(Math.random()*cells)
const startColumn = Math.floor(Math.random()*cells)

const iterateMaze = (row, column) => {
  //if cell has been visited then return early

  //mark cell as visited

  //assemble randomly-ordered list of neighbors

  //for each neighbor...

  //see if neighbor is out of bounds

  //if we have visited neighbor, visit next neighbor

  //remove a wall from horizontals or verticals

  //visit next cell
};

iterateMaze(startRow, startColumn)