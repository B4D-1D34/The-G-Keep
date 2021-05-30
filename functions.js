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
