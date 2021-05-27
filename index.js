const notes = JSON.parse(localStorage.getItem("Notes")) || [];

class Note {
  constructor({
    text,
    title,
    color,
    isArchived,
    isDeleted,
    isPinned,
    isList,
    tags,
    notification,
  }) {
    this.text = text || "Пустая заметка";
    this.title = title || "Без заголовка";
    this.color = color || "blank";
    this.isArchived = isArchived || false;
    this.isDeleted = isDeleted || false;
    this.isPinned = isPinned || false;
    this.isList = isList || false;
    this.tags = tags || [];
    this.notification = notification || null;
  }
}

class UI {
  static displayNotes() {
    notes.forEach((note) => UI.addNote(note));
  }

  static addNote(note) {
    const workspace = document.querySelector("#container");

    const record = document.createElement("div");

    record.classList.add("note");
    record.classList.add(note.color);

    record.innerHTML = `
    ${note.title}</br>
    ${note.text}
    `;
    workspace.appendChild(record);
  }
}

document.addEventListener("DOMContentLoaded", UI.displayNotes);

const addButton = document.getElementById("addNoteButton");

const colorPalette = document.getElementById("colorPalette");

const colorInput = document.getElementById("colorInput");

const titleInput = document.getElementById("titleInput");

const textInput = document.getElementById("textInput");

const form = document.getElementById("mainInput");

let recentColor;
colorPalette.addEventListener("click", ({ target }) => {
  if (target.className.includes("color ")) {
    form.classList.remove(recentColor);
    colorInput.value = target.className.slice(6);
    recentColor = colorInput.value;
    console.log(colorInput.value);
    form.classList.add(recentColor);
  }
});

textInput.addEventListener("focus", () => {
  const ch = [...form.children];
  ch.forEach((el) => el.classList.remove("hidden"));
});

document.addEventListener("click", ({ target }) => {
  if (!form.contains(target)) {
    const ch = [...form.children];
    const filteredCh = ch.filter((el) => el.id !== "textInput");
    filteredCh.forEach((el) => el.classList.add("hidden"));
  }
});

addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const note = new Note({
    text: textInput.value,
    title: titleInput.value,
    color: colorInput.value,
  });
  UI.addNote(note);
  notes.push(note);
  localStorage.setItem("Notes", JSON.stringify(notes));
  form.reset();
});
