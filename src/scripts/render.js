const app = document.getElementById("app");

const createElement = (elementName, classList) => {
  const element = document.createElement(elementName);
  element.classList.add(classList);

  return element;
};

class Column {
  constructor() {
    const div = createElement("div", "column");
    app.appendChild(div);

    this.div = div;
  }
}

class Box {
  constructor(row) {
    const div = createElement("div", "box");

    row.appendChild(div);
  }
}
