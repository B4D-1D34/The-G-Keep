const addButton = document.getElementById("addNoteButton");

const pinButton = document.getElementById("pinBtn");

const archiveButton = document.getElementById("archiveBtn");

const notificationButton = document.getElementById("notificationBtn");

const notificationEdit = document.querySelector(".notificationEdit");

const notificationDate = document.getElementById("notificationDate");

const notificationTime = document.getElementById("notificationTime");

const existNotification = document.getElementById("existNotification");

const existDate = document.getElementById("existDate");
const existTime = document.getElementById("existTime");
const existDateDiv = document.getElementById("existDateDiv");
const existTimeDiv = document.getElementById("existTimeDiv");

const saveNotificationBtn = document.getElementById("saveNotificationBtn");

const deleteNotificationBtn = document.getElementById("deleteNotification");

const colorPalette = document.getElementById("colorPalette");

const colorButton = document.getElementById("colorBtn");
colorButton.addEventListener("click", (e) => e.preventDefault());

const colorInput = document.getElementById("colorInput");

const titleInput = document.getElementById("titleInput");

const textInput = document.getElementById("textInput");

const form = document.getElementById("mainInput");

function viewNotificationEdit(e) {
  e.preventDefault();
  notificationEdit.classList.remove("hidden");
  document.addEventListener("click", function qlose(e) {
    if (
      e.target === notificationButton ||
      (existNotification.contains(e.target) &&
        e.target !== deleteNotificationBtn)
    ) {
      return;
    }
    if (!notificationEdit.contains(e.target)) {
      notificationEdit.classList.add("hidden");
      console.log(`hello`);

      e.currentTarget.removeEventListener(e.type, qlose);
    }
  });
}

notificationButton.addEventListener("click", viewNotificationEdit);

existNotification.addEventListener("click", viewNotificationEdit);

const error = document.createElement("div");
error.classList.add("error");

saveNotificationBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //validation
  const inputs = [notificationDate, notificationTime];
  const emptyInputs = inputs.filter((input) => !input.value);
  if (emptyInputs.length) {
    error.innerText = `Заполните поле`;
    emptyInputs.forEach((input, i) => {
      if (i + 1 === emptyInputs.length) {
        error.innerText += ` ${input.name}.`;
      } else {
        error.innerText += ` ${input.name}, `;
      }
    });
    if (!notificationEdit.contains(error)) {
      notificationEdit.appendChild(error);
      setTimeout(() => {
        error.remove();
      }, 3000);
    }
    return;
  }
  //notification creation

  existDate.value = notificationDate.value;
  existTime.value = notificationTime.value;
  existDateDiv.innerText = existDate.value;
  existTimeDiv.innerText = existTime.value;
  existNotification.classList.remove("hidden");
});

deleteNotificationBtn.addEventListener("click", (e) => {
  e.preventDefault();
  existTime.value = "";
  existDate.value = "";
  existNotification.classList.add("hidden");
});

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
    isPinned: pinButton.value === "true" ? true : false,
    isArchived: archiveButton.value === "true" ? true : false,
    notification:
      existDate.value === "" || existTime.value === ""
        ? null
        : {
            date: existDate.value,
            time: existTime.value,
          },
  });
  console.log(`note.isArchived`, note.isArchived);
  if (note.isArchived === true) {
    note.isPinned = false;
  }
  notes.push(note);
  localStorage.setItem("Notes", JSON.stringify(notes));
  UI.addNote(note);
  UI.displayNotes(tab);

  [...form.querySelector(".buttonContainer").children].forEach((child) => {
    child.classList.remove("chosen");
    child.value = "false";
  });
  existTime.value = "";
  existDate.value = "";
  existNotification.classList.add("hidden");
  form.reset();
});
