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
    this.timer;
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

    const notifications = notes.filter((note) => note.notification);
    notifications.forEach((note) => {
      setNotificationTimer(note);
    });

    const selectedByAttr = arrToDisplay.filter((note) => note[attr]);
    console.log(`selectedByAttr`, selectedByAttr);
    arrToDisplay = arrToDisplay.filter(
      (note) => !selectedByAttr.includes(note)
    );

    arrToDisplay = arrToDisplay.filter(
      (note) => !note.isDeleted === true && !note.isArchived === true
    );

    console.log(`arrToDisplay`, arrToDisplay);

    if (attr === "notification") {
      selectedByAttr.forEach((note) => UI.addNote(note));
    }

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

    record.innerHTML = getNote(note);

    const actualNote = record.querySelector(".note");

    actualNote.classList.add(note.color);

    const existNotification = record.querySelector(".existNotification");
    const notificationEdit = record.querySelector(".notificationEdit");
    const deleteNotificationBtn = record.querySelector(".deleteNotification");
    const notificationBtn = record.querySelector(".notificationBtn");
    const notificationDate = record.querySelector(".notificationDate");
    const notificationTime = record.querySelector(".notificationTime");
    const saveNotificationBtn = record.querySelector(".saveNotificationBtn");
    const existDate = record.querySelector(".existDate");
    const existTime = record.querySelector(".existTime");
    const existDateDiv = record.querySelector(".existDateDiv");
    const existTimeDiv = record.querySelector(".existTimeDiv");

    if (existDate.value) {
      existDateDiv.innerText = existDate.value;
      existTimeDiv.innerText = existTime.value;
      existNotification.classList.remove("hidden");
    }

    notificationBtn.addEventListener("click", (e) => {
      viewNotificationEdit(
        e,
        notificationEdit,
        notificationBtn,
        existNotification,
        deleteNotificationBtn
      );
    });

    existNotification.addEventListener("click", (e) =>
      viewNotificationEdit(
        e,
        notificationEdit,
        notificationBtn,
        existNotification,
        deleteNotificationBtn
      )
    );

    const error = document.createElement("div");
    error.classList.add("error");

    saveNotificationBtn.addEventListener("click", (e) =>
      saveNotification(
        e,
        notificationDate,
        notificationTime,
        notificationEdit,
        error,
        existDate,
        existTime,
        existDateDiv,
        existTimeDiv,
        existNotification,
        note
      )
    );

    deleteNotificationBtn.addEventListener("click", (e) =>
      deleteNotification(e, existTime, existDate, existNotification, note)
    );

    let initColor = actualNote.querySelector(`.${note.color}`);
    initColor.innerHTML = '<i class="fas fa-check"></i>';

    record
      .querySelector(".colorPalette")
      .addEventListener(
        "click",
        ({ target }) =>
          (initColor = changeNoteColor(note, target, initColor, actualNote))
      );

    record.querySelector(".pin").addEventListener("click", () => pinNote(note));

    record
      .querySelector(".archive")
      .addEventListener("click", () => archiveNote(note));

    record
      .querySelector(".delete")
      .addEventListener("click", () => deleteNote(note));

    record.addEventListener("click", ({ target }) =>
      openEdit(record, target, note)
    );

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
