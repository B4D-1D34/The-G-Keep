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
    const workspace = document.querySelector("#container");

    let arrToDisplay = notes;
    const pinned = arrToDisplay.filter((note) => note.isPinned === "true");
    console.log(`pinned`, pinned);
    arrToDisplay = arrToDisplay.filter((note) => !pinned.includes(note));

    if (pinned.length) {
      const pinHeader = document.createElement("h1");
      pinHeader.innerText = "ЗАКРЕПЛЕННЫЕ";
      workspace.appendChild(pinHeader);
      pinned.forEach((note) => UI.addNote(note));
    }

    const allHeader = document.createElement("h1");
    allHeader.innerText = "ДРУГИЕ ЗАМЕТКИ";
    workspace.appendChild(allHeader);
    arrToDisplay.forEach((note) => UI.addNote(note));
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

const pinButton = document.getElementById("pinBtn");

const archiveButton = document.getElementById("archiveBtn");

const colorPalette = document.getElementById("colorPalette");

const colorInput = document.getElementById("colorInput");

const titleInput = document.getElementById("titleInput");

const textInput = document.getElementById("textInput");

const form = document.getElementById("mainInput");

//color choise
let recentColor = "blank";
let targetEl = document.getElementById("initialColor");
colorPalette.addEventListener("click", ({ target }) => {
  if (target.className.includes("color ")) {
    targetEl.innerHTML = "";

    form.classList.remove(recentColor);
    colorInput.value = target.className.slice(6);
    targetEl = target;
    targetEl.innerHTML = '<i class="fas fa-check"></i>';
    recentColor = colorInput.value;
    form.classList.add(recentColor);
  }
});

//input pin button
pinButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (pinButton.value === "true") {
    pinButton.value = false;
    pinButton.classList.remove("chosen");
  } else {
    pinButton.value = true;
    pinButton.classList.add("chosen");
  }
});

//input archive button
archiveButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (archiveButton.value === "true") {
    archiveButton.value = false;
    archiveButton.classList.remove("chosen");
  } else {
    archiveButton.value = true;
    archiveButton.classList.add("chosen");
  }
});

//extended view of input
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

//creating note input button
addButton.addEventListener("click", (e) => {
  e.preventDefault();
  const note = new Note({
    text: textInput.value,
    title: titleInput.value,
    color: colorInput.value,
    isPinned: pinButton.value,
    isArchived: archiveButton.value,
  });
  UI.addNote(note);
  notes.push(note);
  localStorage.setItem("Notes", JSON.stringify(notes));
  form.reset();
});
