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
