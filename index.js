const notes = JSON.parse(localStorage.getItem("Notes")) || [];
let tab = "isPinned";

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
    const noteList = document.getElementById("note-list");
    noteList.innerHTML = "";

    let arrToDisplay = notes;
    const selectedByAttr = arrToDisplay.filter((note) => note[attr] === "true");
    console.log(`selectedByAttr`, selectedByAttr);
    arrToDisplay = arrToDisplay.filter(
      (note) => !selectedByAttr.includes(note)
    );
    // debugger;

    arrToDisplay = arrToDisplay.filter(
      (note) => !note.isDeleted === true && note.isArchived !== "true"
    );

    console.log(`arrToDisplay`, arrToDisplay);

    if (attr === "isArchived" || attr === "isDeleted") {
      selectedByAttr.forEach((note) => UI.addNote(note));
    }

    if (selectedByAttr.length && attr === "isPinned") {
      const pinHeader = document.createElement("h1");
      pinHeader.innerText = "Pinned";
      noteList.appendChild(pinHeader);

      selectedByAttr.forEach((note) => UI.addNote(note));

      const allHeader = document.createElement("h1");
      allHeader.innerText = "Other notes";
      noteList.appendChild(allHeader);
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
    <button class="formButton"><i class="far fa-times-circle"></i></button>
    `;
    record.querySelector("button").addEventListener("click", () => {
      if (note.isDeleted === "true") {
        notes.splice(notes.indexOf(note), 1);
        localStorage.setItem("Notes", JSON.stringify(notes));
        UI.displayNotes(tab);
        return;
      }
      console.log(`herei am`);
      note.isDeleted = "true";
      note.isPinned = "false";
      note.isArchived = "false";
      console.log(`note`, note);
      notes.splice(notes.indexOf(note), 1, note);
      localStorage.setItem("Notes", JSON.stringify(notes));
      UI.displayNotes(tab);
    });
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
