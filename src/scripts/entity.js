const EQUAL_FIGHT_CHANCE = 0.8;

class Entity {
  constructor({ level, position, place = [[]], type }) {
    this.level = level;
    this.position = position;
    this.place = place;
    this.died = false;
    this.type = type;

    this.maxMove = Math.max(
      Math.ceil(place.flat().length / 2.7),
      place.length - 1
    );

    this.homeBox = this.getBox(position);

    const entityDiv = createElement("div", type);
    this.homeBox.appendChild(entityDiv);
    this.entityDiv = entityDiv;
    this.levelDiv = createElement("div", `${type}__level`);
    this.levelDiv.innerHTML = level;

    switch (type) {
      case "user":
        this.renderMoveCounter();
        break;

      case "finish":
        this.levelDiv.innerHTML += "<br /> Finish!";

      default:
        entityDiv.onclick = () => user.attack(this.position);
        break;
    }

    entityDiv.appendChild(this.levelDiv);
  }

  renderMoveCounter() {
    this.counterDiv = createElement("div", "counter");
    this.counterDiv.innerHTML = `Осталось ходов <b>${
      this.maxMove
    }</b> | Уровень сложности <b>${localStorage.getItem("complexity")}</b>`;
    app.appendChild(this.counterDiv);
  }

  getBox(position) {
    const columns = document.querySelectorAll(".column");
    return columns[position.x].childNodes[position.y];
  }

  move(position) {
    if (this.maxMove === 0) {
      return this.die();
    }
    this.position = position;
    const box = this.getBox(position);
    box.appendChild(this.entityDiv);

    this.maxMove -= 1;

    this.renderMoveCounter();
  }

  updateLevel(level) {
    this.level = level;
    this.levelDiv.innerHTML = level;
  }

  die() {
    localStorage.setItem("complexity", 1);
    alert(`Вы проиграли, ваш уровень ${this.level}`);
    window.location.reload();
  }

  remove() {
    this.entityDiv.remove();
    this.died = true;
  }

  winner() {
    setTimeout(() => {
      alert(`Вы выйграли, ваш уровень ${this.level}!`);
      window.location.reload();
      localStorage.setItem(
        "complexity",
        1 + +localStorage.getItem("complexity")
      );
    });
  }

  attack(position) {
    const entity = this.place[position.x][position.y];

    if (position.x < this.position.x || position.x > this.position.x + 1) {
      return;
    }

    if (entity.level <= this.level) {
      this.updateLevel(entity.level + this.level);
      entity.remove();
    }

    if (entity.level > this.level) {
      return this.die();
    }

    this.move(position);

    if (entity.type === "finish") {
      this.winner();
    }
  }
}
