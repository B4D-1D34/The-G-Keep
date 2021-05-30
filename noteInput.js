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
  console.log(`note.isArchived`, note.isArchived);
  if (note.isArchived === "true") {
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

  form.reset();
});
