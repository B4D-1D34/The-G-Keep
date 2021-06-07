const getNote = (note) => {
  return `
    <div class="note">
      <div class="noteTextWrapper">
        <p class="noteTitle">${note.title}</p>
        <p class="noteText">${note.text}</p>
        <div class="existNotificationWrapper">
          <div class="hidden formButton existNotification">
            <i class="fas fa-bell"></i>
            <div class="existDateDiv"></div>
            <div class="diminished existTimeDiv"></div>
            <button class="deleteNotification">
              <i class="fas fa-times"></i>
            </button>
            <input
              class="addNoteInput existDate"
              readonly
              hidden
              type="date"
              value="${helperNotificationInsert(note, "date")}"
            />
            <input
              class="addNoteInput existTime"
              readonly
              hidden
              type="time"
              value="${helperNotificationInsert(note, "time")}"
            />
          </div>
        </div>
      </div>
      <div class="buttonContainer">
        <div class="notificationBtnWrapper">
          <button class="notificationBtn formButton">
            <i class="fas fa-bell"></i>
            <!-- Создать напоминание -->
          </button>
          <div class="notificationEdit hidden">
            <p>Notification:</p>
            <input
              name="Дата"
              class="addNoteInput notificationDate"
              type="date"
              value="${helperNotificationInsert(note, "date")}"
            />
            <input
              name="Время"
              class="addNoteInput notificationTime"
              type="time"
              value="${helperNotificationInsert(note, "time")}"
            />
            <button class="saveNotificationBtn formButton">
              Сохранить
            </button>
          </div>
        </div>
        <div class="colorBtnWrapper">
            <button class="formButton">
                <i class="fas fa-palette"></i>
                <!-- Изменить цвет -->
            </button>
            <div class="colorPalette">
                <div class="color blank"></div>
                <div class="color red"></div>
                <div class="color green"></div>
                <div class="color yellow"></div>
                <div class="color blue"></div>
                <div class="color orange"></div>
                <div class="color violet"></div>
                <div class="color brown"></div>
                <div class="color pink"></div>
                <div class="color gray"></div>
            </div>
        </div>
        <button class="formButton archive"><i class="fas fa-archive"></i></button>
        <button class="formButton pin"><i class="fas fa-thumbtack"></i></button>
        <button class="formButton delete"><i class="far fa-times-circle"></i></button>
      </div>
    </div>
    `;
};

const getDeletedNote = (note) => {
  return `<div class="note">
  <div class="noteTextWrapper">
    <p class="noteTitle">${note.title}</p>
    <p class="noteText">${note.text}</p>
  </div>
  <div class="buttonContainer">
    <button class="formButton restore"><i class="fas fa-trash-restore"></i></button>
    <button class="formButton delete"><i class="far fa-times-circle"></i></button>
  </div>
</div>`;
};
