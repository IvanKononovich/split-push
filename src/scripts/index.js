if (!localStorage.getItem("complexity")) {
  localStorage.setItem("complexity", 1);
}

const MAX_LEVEL_HEIGHT = 5 + +localStorage.getItem("complexity");
const LEVEL_WIDTH = 5 * +localStorage.getItem("complexity");

const getRandomArbitrary = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const levelMap = [
  1,
  ...new Array(LEVEL_WIDTH)
    .fill(null)
    .map(() => getRandomArbitrary(2, MAX_LEVEL_HEIGHT)),
  "finish",
];
const place = [];
let user = null;

const getEntityLevel = () => {
  let level = 1;
  if (place.flat().length === 1) {
    return level;
  }

  level = place.reduce((acc, column) => {
    const columnSumLevel = column.reduce(
      (columnAccLevel, { level }) => columnAccLevel + level,
      0
    );
    return getRandomArbitrary(1, acc + columnSumLevel);
  }, level);

  return level;
};
const getFinishLevel = () => {
  let level =
    Math.max(...place[place.length - 2].map(({ level }) => level)) / 1.2;

  return Math.round(level);
};

const generateLevel = () => {
  for (let widthIndex = 0; widthIndex < levelMap.length; widthIndex++) {
    const column = new Column();
    place.push([]);

    for (
      let heightIndex = 0;
      heightIndex <
      (levelMap[widthIndex] === "finish" ? 1 : levelMap[widthIndex]);
      heightIndex++
    ) {
      new Box(column.div);

      if (widthIndex !== 0) {
        const entity = new Entity({
          level:
            levelMap[widthIndex] === "finish"
              ? getFinishLevel()
              : getEntityLevel(),
          position: {
            x: widthIndex,
            y: heightIndex,
          },
          type: levelMap[widthIndex] === "finish" ? "finish" : "entity",
          place,
        });
        place[widthIndex].push(entity);
      } else {
        setTimeout(() => {
          user = new Entity({
            level: 1,
            position: {
              x: 0,
              y: 0,
            },
            type: "user",
            place,
          });
          place[widthIndex][heightIndex] = user;
        }, 1000);
        place[widthIndex].push({ level: 1 });
      }
    }
  }
};

generateLevel();
