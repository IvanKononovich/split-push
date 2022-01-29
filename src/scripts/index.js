let complexity = +(localStorage.getItem("complexity") || 0);
if (!complexity) {
  localStorage.setItem("complexity", 1);
  complexity = 1;
}

const MAX_LEVEL_HEIGHT = 2 + Math.round(complexity / 3);
const LEVEL_WIDTH = 2 + complexity;

const getRandom = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const levelMap = [
  1,
  ...new Array(LEVEL_WIDTH).fill(MAX_LEVEL_HEIGHT),
  "finish",
];
const place = [];
let user = null;

const getEntityLevel = () => {
  let level = 1;
  if (place.flat().length === 1) {
    return level;
  }

  level = place.reduce((acc, column, columnIndex) => {
    const prevColumn = place[columnIndex - 1];
    let prevMin = 1;
    if (prevColumn) {
      prevMin = Math.min(...prevColumn.map(({ level }) => level)) + 1;
    }
    const columnSumLevel = column.reduce((columnAccLevel, { level }, index) => {
      let accColumnAccLevel = columnAccLevel;
      if (index < column.length - 1) {
        accColumnAccLevel += level;
      }
      return accColumnAccLevel;
    }, 0);
    return getRandom(prevMin, acc + columnSumLevel);
  }, level);

  return level;
};
const getFinishLevel = () => {
  let level =
    Math.max(...place[place.length - 2].map(({ level }) => level)) / 1.2;

  return Math.round(level);
};

let resolveUserPromise = null;
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
        new Promise((resolve) => {
          resolveUserPromise = resolve;
        }).then(() => {
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
        });
        place[widthIndex].push({ level: 1 });
      }
    }
  }

  resolveUserPromise();
};

generateLevel();
