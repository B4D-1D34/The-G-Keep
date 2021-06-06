const recordChange = (note, beforeChange = note) => {
  notes.splice(notes.indexOf(note), 1, beforeChange);
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
  note.notification = null;
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
  if (
    record.querySelector(".buttonContainer").contains(target) ||
    record.querySelector(".existNotification").contains(target)
    // ||
    // changeNotification.contains(target)
  ) {
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
    const existDate = record.querySelector(".existDate");
    const existTime = record.querySelector(".existTime");
    if (
      (!actualNote.contains(e.target) &&
        !changeNotification.contains(e.target)) ||
      (actualNote.querySelector(".buttonContainer").contains(e.target) &&
        !actualNote.querySelector(".colorBtnWrapper").contains(e.target) &&
        !actualNote.querySelector(".notificationBtnWrapper").contains(e.target))
    ) {
      console.log(`note`, note);
      console.log(`i'm here!`);
      record.classList.remove("open");
      note.title = editTitleInput.value;
      note.text = editTextInput.value;
      note.notification =
        existDate.value === "" || existTime.value === ""
          ? null
          : {
              date: existDate.value,
              time: existTime.value,
            };
      recordChange(note);
      restoreData["open"] = false;
      e.currentTarget.removeEventListener(e.type, q);
    }
  };
};

// NOTIFICATIONS

const helperNotificationInsert = (note, param) => {
  if (note.notification) {
    return note.notification[param];
  } else {
    return "";
  }
};

function viewNotificationEdit(
  e,
  notificationEdit,
  notificationButton,
  existNotification,
  deleteNotificationBtn
) {
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

      e.currentTarget.removeEventListener(e.type, qlose);
    }
  });
}

const saveNotification = (
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
) => {
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
  note.notification =
    existDate.value === "" || existTime.value === ""
      ? null
      : {
          date: existDate.value,
          time: existTime.value,
        };
  setNotificationTimer(note);
  notes.splice(notes.indexOf(note), 1, note);
  localStorage.setItem("Notes", JSON.stringify(notes));
};

const deleteNotification = (
  e,
  existTime,
  existDate,
  existNotification,
  note
) => {
  e.preventDefault();
  existTime.value = "";
  existDate.value = "";
  existNotification.classList.add("hidden");
  note.notification =
    existDate.value === "" || existTime.value === ""
      ? null
      : {
          date: existDate.value,
          time: existTime.value,
        };
  clearInterval(note.timer);
  notes.splice(notes.indexOf(note), 1, note);
  localStorage.setItem("Notes", JSON.stringify(notes));
};

const setNotificationTimer = (note) => {
  const time = new Date(note.notification.date + "T" + note.notification.time);
  console.log(time);
  const leftToNotify = time.getTime() - Date.now();
  if (note.timer) {
    clearInterval(note.timer);
  }
  note.timer = setTimeout(() => {
    alert(`${note.text} time is now!!!`);
  }, leftToNotify);
  console.log(note, leftToNotify);
  if (leftToNotify < 0) {
    clearInterval(note.timer);
  }
};

const restoreChange = ({ beforeChange, note, ...args }) => {
  if (args.notification && args.open) {
    args.notification.existNotification.classList.remove("hidden");
    args.notification.existTime.value = beforeChange.notification.time;
    args.notification.existDate.value = beforeChange.notification.date;
    note.notification = beforeChange.notification;
    setNotificationTimer(note);
    return;
  }

  recordChange(note, beforeChange);
};
