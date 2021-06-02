const recordChange = (note) => {
  notes.splice(notes.indexOf(note), 1, note);
  localStorage.setItem("Notes", JSON.stringify(notes));
  UI.displayNotes(tab);
};

const pinNote = (note) => {
  if (note.isPinned === true) {
    note.isPinned = false;
    recordChange(note);

    return;
  }
  note.isPinned = true;
  note.isArchived = false;
  recordChange(note);
};

const archiveNote = (note) => {
  if (note.isArchived === true) {
    note.isArchived = false;
    recordChange(note);

    return;
  }
  note.isPinned = false;
  note.isArchived = true;
  recordChange(note);
};

const deleteNote = (note) => {
  if (note.isDeleted === true) {
    notes.splice(notes.indexOf(note), 1);
    localStorage.setItem("Notes", JSON.stringify(notes));
    UI.displayNotes(tab);
    return;
  }
  note.isDeleted = true;
  note.isPinned = false;
  note.isArchived = false;
  recordChange(note);
};

const changeNoteColor = (note, target, initColor, actualNote) => {
  if (target.className.includes("color ")) {
    let noteColor = note.color;
    initColor.innerHTML = "";

    actualNote.classList.remove(noteColor);
    note.color = target.className.slice(6);
    initColor = target;
    initColor.innerHTML = '<i class="fas fa-check"></i>';
    noteColor = note.color;
    actualNote.classList.add(noteColor);
    notes.splice(notes.indexOf(note), 1, note);
    localStorage.setItem("Notes", JSON.stringify(notes));
  }
  return initColor;
};

const openEdit = (record, target, note) => {
  if (record.querySelector(".buttonContainer").contains(target)) {
    return;
  }
  record.classList.add("open");
  const actualNote = record.querySelector(".note");
  const noteTitle = actualNote.querySelector(".noteTitle");
  const noteText = actualNote.querySelector(".noteText");
  if (noteTitle && noteText) {
    const editTitleInput = document.createElement("textarea");
    const editTextInput = document.createElement("textarea");
    let hiddenDiv = document.createElement("div");
    hiddenDiv.classList.add("addNoteInput");
    hiddenDiv.classList.add("hiddendiv");

    actualNote.appendChild(hiddenDiv);

    editTitleInput.classList.add("addNoteInput");
    editTitleInput.classList.add("titleArea");
    editTextInput.classList.add("addNoteInput");

    editTitleInput.addEventListener("keyup", ({ currentTarget }) =>
      inputAutoScale(currentTarget, hiddenDiv)
    );
    editTextInput.addEventListener("keyup", ({ currentTarget }) =>
      inputAutoScale(currentTarget, hiddenDiv)
    );

    noteTitle.replaceWith(editTitleInput);
    noteText.replaceWith(editTextInput);
    editTitleInput.placeholder = "Введите заголовок";
    editTextInput.placeholder = "Заметка...";
    editTitleInput.value = note.title;
    editTextInput.value = note.text;
    inputAutoScale(editTitleInput, hiddenDiv);
    inputAutoScale(editTextInput, hiddenDiv);
    editTextInput.focus();

    document.addEventListener(
      "click",
      closeEdit(record, noteTitle, noteText, note)
    );
  }
};

const inputAutoScale = (currentTarget, hiddenDiv) => {
  hiddenDiv.innerHTML = currentTarget.value;
  currentTarget.style.height = hiddenDiv.scrollHeight.toString() + "px";
};

const closeEdit = (record, noteTitle, noteText, note) => {
  return function q(e) {
    // debugger;
    if (e.target === noteTitle || e.target === noteText) {
      return;
    }
    const actualNote = record.querySelector(".note");
    const editTitleInput = record.querySelectorAll("textarea")[0];
    const editTextInput = record.querySelectorAll("textarea")[1];
    if (
      !actualNote.contains(e.target) ||
      (actualNote.querySelector(".buttonContainer").contains(e.target) &&
        !actualNote.querySelector(".colorPalette").contains(e.target))
    ) {
      console.log(`note`, note);
      console.log(`i'm here!`);
      record.classList.remove("open");
      note.title = editTitleInput.value;
      note.text = editTextInput.value;
      recordChange(note);
      editTitleInput.replaceWith(noteTitle);
      editTextInput.replaceWith(noteText);
      e.currentTarget.removeEventListener(e.type, q);
    }
  };
};
