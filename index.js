let notes = JSON.parse(localStorage.getItem("Notes")) || [];
let tab = "isPinned";
const mainContainer = document.getElementById("container");
const trashMessageBox = document.createElement("div");

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
  static displayNotes(attr) {
    console.log(`trashMessageBox`, trashMessageBox);
    if (mainContainer.contains(trashMessageBox)) {
      trashMessageBox.innerHTML = "";
      mainContainer.removeChild(trashMessageBox);
    }
    form.classList.remove("hidden");

    const noteList = document.getElementById("note-list");
    noteList.innerHTML = "";

    let arrToDisplay = notes;
    const selectedByAttr = arrToDisplay.filter((note) => note[attr] === true);
    console.log(`selectedByAttr`, selectedByAttr);
    arrToDisplay = arrToDisplay.filter(
      (note) => !selectedByAttr.includes(note)
    );
    // debugger;

    arrToDisplay = arrToDisplay.filter(
      (note) => !note.isDeleted === true && !note.isArchived === true
    );

    console.log(`arrToDisplay`, arrToDisplay);

    if (attr === "isArchived" || attr === "isDeleted") {
      form.classList.add("hidden");

      selectedByAttr.forEach((note) => UI.addNote(note));
    }

    if (attr === "isDeleted") {
      trashMessageBox.classList.add("trashMessageBox");
      const trashH2 = document.createElement("h2");
      trashH2.innerText = "Заметки удаляются из корзины через 7 дней.";

      if (selectedByAttr.length) {
        const clearTrashButton = document.createElement("button");
        clearTrashButton.classList.add("formButton");
        clearTrashButton.innerText = "Очистить корзину";
        clearTrashButton.addEventListener("click", () => {
          notes = notes.filter((note) => !selectedByAttr.includes(note));
          localStorage.setItem("Notes", JSON.stringify(notes));
          UI.displayNotes(tab);
        });
        trashMessageBox.prepend(clearTrashButton);
      }
      trashMessageBox.prepend(trashH2);
      mainContainer.prepend(trashMessageBox);
    }

    if (selectedByAttr.length && attr === "isPinned") {
      const pinHeader = document.createElement("h1");
      pinHeader.innerText = "Pinned";
      noteList.appendChild(pinHeader);

      selectedByAttr.forEach((note) => UI.addNote(note));

      if (arrToDisplay.length) {
        const allHeader = document.createElement("h1");
        allHeader.innerText = "Other notes";
        noteList.appendChild(allHeader);
      }
    }
    if (attr === "isPinned") {
      arrToDisplay.forEach((note) => UI.addNote(note));
    }
  }

  static addNote(note) {
    const noteList = document.getElementById("note-list");

    const record = document.createElement("div");

    record.classList.add("note");
    record.classList.add(note.color);

    record.innerHTML = `
    ${note.title}</br>
    ${note.text}
    <button class="formButton archive"><i class="fas fa-archive"></i></button>
    <button class="formButton pin"><i class="fas fa-thumbtack"></i></button>
    <button class="formButton delete"><i class="far fa-times-circle"></i></button>
    `;

    record.querySelector(".pin").addEventListener("click", () => pinNote(note));

    record
      .querySelector(".archive")
      .addEventListener("click", () => archiveNote(note));

    record
      .querySelector(".delete")
      .addEventListener("click", () => deleteNote(note));
    noteList.appendChild(record);
  }
}

document.addEventListener("DOMContentLoaded", UI.displayNotes(tab));

//sidebar tabs event listener
const sidebar = document.getElementById("sidebar");

sidebar.addEventListener("click", ({ target }) => {
  if (target.className.includes("nav-list-item")) {
    [...sidebar.children].forEach((child) => child.classList.remove("chosen"));
    target.classList.add("chosen");
    tab = target.querySelector("input").value;
    UI.displayNotes(tab);
  }
});
