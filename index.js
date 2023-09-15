const taskAddIcon = document.querySelector(".task_adding_icon"); // 點擊新增按鈕
const newTask = document.querySelector(".task_container.new_task"); //整個表單
const taskList = document.querySelector(".task_list_container"); // 要渲染的區塊
const fileInput = document.querySelector("#file-upload"); // 選擇檔案
let tasks = JSON.parse(localStorage.getItem("items")) || [];

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 選擇檔案，渲染
function getFileDetail(e) {
  const selectedFile = e.target.files[0]; // 選取檔案物件
  const fileName = selectedFile.name;

  // 有拿到檔案渲染，所以判斷長度
  if (e.target.files.length) {
    const fileContainer = e.target.closest(".file_container");
    const fileUploaded = getCurrentDate();
    const file_detail = document.createElement("div");
    if (fileContainer.querySelector(".file_detail")) {
      fileContainer.querySelector(".file_detail").remove();
    }
    file_detail.classList.add("file_detail");
    file_detail.innerHTML = `
      <span class="file_name">${fileName}</span>
      <span class="file_time" data-time="${fileUploaded}">uploaded ${fileUploaded.replace(/-/g, "/")}</span>
    `;

    fileContainer.insertBefore(file_detail, fileContainer.firstChild);
  }
}

function addNewTask(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const statusDone = form.querySelector('input[name="isDone"]').checked;
  const statusImportant = form.querySelector('input[name="isImportant"]').checked;
  const fileNode = form.querySelector(".file_name");
  const fileName = fileNode ? fileNode.textContent : "";
  const uploadNode = form.querySelector(".file_time");
  const uploadDate = uploadNode ? uploadNode.dataset.time : "";

  const dataObj = {
    id: new Date().getTime(),
    isDone: statusDone,
    isImportant: statusImportant,
    title: formData.get("title"),
    date: formData.get("date"),
    time: formData.get("time"),
    file: fileName,
    fileUploaded: uploadDate,
    message: formData.get("message"),
  };

  tasks.push(dataObj);
  localStorage.setItem("items", JSON.stringify(tasks));
  renderForms(tasks, taskList);

  // 重置表單
  this.reset();
  if (form.querySelector(".file_detail")) form.querySelector(".file_detail").remove();

  const parentElement = e.target.parentElement;
  parentElement.classList.remove("adding");
}

function filterTasks(tasks) {
  if (window.location.href.includes("inProgress")) {
    return [...tasks].filter((task) => !task.isDone);
  } else if (window.location.href.includes("completed")) {
    return [...tasks].filter((task) => task.isDone);
  } else {
    return tasks;
  }
}

export function renderForms(tasks = [], tasksList) {
  const filteredTasks = filterTasks(tasks);
  tasksList.innerHTML = filteredTasks
    .map((task, index) => {
      // 判斷form的class
      const isFinished = task.isDone ? "finished" : "";
      const isImportant = task.isImportant ? "important" : "";
      // 判斷checkbox被點擊狀態
      const isFinishedChecked = task.isDone ? "checked" : "";
      const isImportantChecked = task.isImportant ? "checked" : "";
      // 判斷任務已完成 => 星星禁按、form禁拖曳
      const isDraggable = task.isDone ? "" : "draggable='true'";
      const isImportantDisabled = task.isDone ? "disabled" : "";
      return `
      <form class="task_container ${isFinished} ${isImportant}" ${isDraggable} data-index=${task.id}>
        <div class="task_title">
          <input type="checkbox" name="isDone" ${isFinishedChecked}/>
          <div class="task_title_dashboard">
            <div>
              <input type="text" name="title" value="${task.title}" disabled/>
              <input type="checkbox"  name="isImportant" ${isImportantChecked} ${isImportantDisabled}/>
              <button class="edit" type="button">
                <i class="fa-light fa-pen"></i>
              </button>
            </div>
            <div class="task_title_status">
              <span>
                <i class="fa-solid fa-calendar-days"></i>${task.date.replace(/-/g, "/")}
              </span>
              ${task.file === "" ? "" : '<i class="fa-light fa-file"></i>'}
              ${task.message === "" ? "" : '<i class="fa-regular fa-comment-dots"></i>'}
            </div>
          </div>
        </div>
        <div class="task_content">
          <div>
            <i class="fa-solid fa-calendar-days"></i>
            <div class="task_content_subtitle">
              <p>Deadline</p>
              <div class="date_container">
                <input
                  class="date"
                  type="date"
                  name="date"
                  value="${task.date}"
                  required
                />
                <input
                  class="time"
                  type="time"
                  name="time"
                  value="${task.time}"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <i class="fa-light fa-file"></i>
            <div class="task_content_subtitle">
              <p>File</p>
              <div class="file_container">
              ${
                task.file
                  ? `<div class="file_detail">
                  <span class="file_name">${task.file}</span>
                  <span class="file_time" data-time="${task.fileUploaded}">uploaded ${task.fileUploaded.replace(/-/g, "/")}</span>
                    </div>`
                  : ""
              }
                <label for="file-upload${index}" class="add_file">
                  <i class="fa-light fa-plus"></i>
                  <input id="file-upload${index}" type="file" />
                </label>
              </div>
            </div>
          </div>
          <div>
            <i class="fa-regular fa-comment-dots"></i>
            <div class="task_content_subtitle">
              <p>Comment</p>
              <textarea
                name="message"
                rows="5"
              >${task.message}</textarea>
            </div>
          </div>
        </div>
        <div class="task_control">
          <button type="reset">
            <i class="fa-light fa-xmark"></i>
            <span>Cancel</span>
          </button>
          <button type="submit">
            <i class="fa-light fa-plus"></i>
            <span>Save</span>
          </button>
        </div>
      </form>`;
    })
    .join("");

  const taskLeft = document.querySelector(".task_left");
  taskLeft.textContent = `${filteredTasks.length} task left`;
}

fileInput.addEventListener("input", getFileDetail);

taskAddIcon.addEventListener("click", (e) => {
  taskAddIcon.parentNode.classList.add("adding");
});
newTask.addEventListener("submit", addNewTask);
newTask.addEventListener("reset", (e) => {
  const parentElement = e.target.parentElement;
  parentElement.classList.remove("adding");
});

// ===== 監聽渲染form 的父層 =====
function toggleEdit(parentForm) {
  const inputField = parentForm.querySelector('input[name="title"]');
  if (parentForm.classList.contains("editing")) {
    parentForm.classList.remove("editing");
    inputField.disabled = true;
    renderForms(tasks, taskList);
  } else {
    parentForm.classList.add("editing");
    inputField.disabled = false;
  }
}

function toggleSubscribe(el) {
  const id = el.dataset.index;
  const index = tasks.findIndex((task) => +task.id === +id);
  tasks[index].isImportant = !tasks[index].isImportant;
  localStorage.setItem("items", JSON.stringify(tasks));
  tasks = JSON.parse(localStorage.getItem("items"));
  renderForms(tasks, taskList);
}

function toggleDone(el) {
  const id = el.dataset.index;
  const index = tasks.findIndex((task) => +task.id === +id);
  tasks[index].isDone = !tasks[index].isDone;
  if (tasks[index].isDone === true) {
    tasks[index].isImportant = false;
  }
  localStorage.setItem("items", JSON.stringify(tasks));
  tasks = JSON.parse(localStorage.getItem("items"));
  renderForms(tasks, taskList);
}

function handleTaskClick(e) {
  const el = e.target;
  const currentForm = el.closest(".task_container");

  if (el.classList.contains("fa-pen")) {
    e.preventDefault();
    toggleEdit(currentForm);
  }
  if (el.tagName === "INPUT" && el.name === "isImportant") {
    toggleSubscribe(currentForm);
  }
  if (el.tagName === "INPUT" && el.name === "isDone") {
    toggleDone(currentForm);
  }
}

taskList.addEventListener("click", handleTaskClick);

taskList.addEventListener("input", (e) => {
  const el = e.target;
  if (el.id.includes("file-upload")) {
    getFileDetail(e);
  }
});

taskList.addEventListener("submit", editTask);
taskList.addEventListener("reset", (e) => {
  const form = e.target;
  form.classList.remove("editing");
  renderForms(tasks, taskList);
});

function editTask(e) {
  e.preventDefault();
  const form = e.target.closest(".task_container");
  const formData = new FormData(form);
  const id = form.dataset.index;
  const index = tasks.findIndex((form) => +form.id === +id);
  const fileNode = form.querySelector(".file_name");
  const fileName = fileNode ? fileNode.textContent : "";
  const uploadNode = form.querySelector(".file_time");
  const uploadDate = uploadNode ? uploadNode.dataset.time : "";

  // 重新取得修改後資料
  tasks[index].title = formData.get("title");
  tasks[index].date = formData.get("date");
  tasks[index].time = formData.get("time");
  tasks[index].file = fileName;
  tasks[index].fileUploaded = uploadDate;
  tasks[index].message = formData.get("message");

  // 存到 localStorage
  localStorage.setItem("items", JSON.stringify(tasks));
  // 渲染
  renderForms(tasks, taskList);
}

// nav 選單
const nav = document.querySelector(".nav_container");
nav.addEventListener("click", (e) => {
  const currentLink = e.target;
  window.location.href = e.target.href;
  const links = nav.querySelectorAll("a");

  links.forEach((link) => {
    if (link !== currentLink) {
      link.classList.remove("active");
    }
  });

  if (!currentLink.classList.contains("active")) {
    currentLink.classList.add("active");
  }
  renderForms(tasks, taskList);
});

// 初始渲染
renderForms(tasks, taskList);

// 拖曳 from 監聽
taskList.addEventListener("drag", (e) => {
  // 拖曳時，原位置的元素
  e.target.style.opacity = 0;
});

taskList.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
  const dataIndex = e.target.dataset.index;
  e.dataTransfer.setData("text/plain", dataIndex); // 把當前拖曳中的元素id寫到e.dataTransfer
});

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
});

taskList.addEventListener("drop", (e) => {
  e.preventDefault();
  // 原拖曳的from (在dragstart時已經寫進e.dataTransfer保存)
  const originFormId = e.dataTransfer.getData("text/plain");

  // 拖放區form
  const dropzoneForm = e.target.closest(".task_container");
  if (dropzoneForm) {
    const dropzoneFormId = dropzoneForm.dataset.index;
    if (+originFormId === +dropzoneFormId) return;
    // 從id取得本身的index
    const originFormIndex = tasks.findIndex((form) => +form.id === +originFormId);
    const dropzoneFormIndex = tasks.findIndex((form) => +form.id === +dropzoneFormId);

    const insertForm = tasks[originFormIndex]; // 因為拖曳的form會在原陣列中刪除，所以要先暫存。
    // 删除拖曳的form
    tasks.splice(originFormIndex, 1);
    // 插入到目標位置
    tasks.splice(dropzoneFormIndex, 0, insertForm);
  }
});

taskList.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
  e.target.style.opacity = 1;
  localStorage.setItem("items", JSON.stringify(tasks));
  renderForms(tasks, taskList);
});
