const taskAddIcon = document.querySelector(".task_adding_icon"); // 點擊新增按鈕
const newTask = document.querySelector(".task_container.new_task"); //整個表單

const taskList = document.querySelector(".task_list_container"); // 要渲染的區塊

const fileInput = document.querySelector("#file-upload"); // 選擇檔案
const fileContainer = document.querySelector(".file_container");

let tasks = JSON.parse(localStorage.getItem("items")) || [];

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
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
      <span class="file_time" data-time="${fileUploaded}">uploaded ${fileUploaded}</span>
    `;

    fileContainer.insertBefore(file_detail, fileContainer.firstChild);
  }
}

function addNewTask(e) {
  e.preventDefault();
  const form = e.target; // form
  const statusDone = form.querySelector('input[name="isDone"]').checked;
  const statusImportant = false;
  const title = form.querySelector('input[name="title"]').value;
  const date = form.querySelector('input[name="date"]').value;
  const time = form.querySelector('input[name="time"]').value;
  const fileNode = form.querySelector(".file_name");
  const fileName = fileNode ? fileNode.textContent : "";
  const uploadNode = form.querySelector(".file_time");
  const uploadDate = uploadNode ? uploadNode.dataset.time : "";
  const message = form.querySelector(".message").value;

  const dataObj = {
    isDone: statusDone,
    isImportant: statusImportant,
    title: title,
    date: date,
    time: time,
    file: fileName,
    fileUploaded: uploadDate,
    message: message,
  };

  tasks.push(dataObj);
  localStorage.setItem("items", JSON.stringify(tasks));
  renderItems(tasks, taskList);

  // 重置表單
  this.reset();
  if (form.querySelector(".file_detail")) form.querySelector(".file_detail").remove();

  const parentElement = e.target.parentElement;
  parentElement.classList.remove("adding");
}

function renderItems(takes = [], takesList) {
  takesList.innerHTML = takes
    .map((task, index) => {
      return `
      <form class="task_container ${task.isDone ? "finished" : ""} ${
        task.isImportant ? "important" : ""
      }"  draggable="true">
        <div class="task_title">
          <input type="checkbox" data-index=${index} ${task.isDone ? "checked" : ""} />
          <div class="task_title_dashboard">
            <div>
              <input type="text" name="title" value="${task.title}" disabled />
              <button class="subscribe" type="button">
                <i class="fa-regular fa-star" data-index=${index}></i>
              </button>
              <button class="edit" type="button">
                <i class="fa-light fa-pen"></i>
              </button>
            </div>
            <div class="task_title_status">
              <span>
                <i class="fa-solid fa-calendar-days"></i>${task.date}
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
                  type="text"
                  name="date"
                  value="${task.date}"
                  required
                />
                <input
                  class="time"
                  type="text"
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
                  <span class="file_time">uploaded ${task.fileUploaded}</span>
                    </div>
                    `
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
}

fileInput.addEventListener("input", getFileDetail);

taskAddIcon.addEventListener("click", (e) => {
  // const parentElement = e.target.parentElement;
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
  } else {
    parentForm.classList.add("editing");
    inputField.disabled = false;
  }
}

function toggleSubscribe(el) {
  console.log("e.target", el);

  const index = el.dataset.index;
  tasks[index].isImportant = !tasks[index].isImportant;
  localStorage.setItem("items", JSON.stringify(tasks));
  tasks = JSON.parse(localStorage.getItem("items"));
  renderItems(tasks, taskList);
}

function toggleDone(el) {
  const index = el.dataset.index;
  tasks[index].isDone = !tasks[index].isDone;
  localStorage.setItem("items", JSON.stringify(tasks));
  tasks = JSON.parse(localStorage.getItem("items"));
  renderItems(tasks, taskList);
}

function toggle(e) {
  const el = e.target;
  const parentForm = el.closest(".task_container");

  if (el.classList.contains("fa-pen")) {
    e.preventDefault();
    toggleEdit(parentForm);
  }
  if (el.classList.contains("fa-star")) {
    // e.preventDefault();
    toggleSubscribe(el);
  }
  if (el.tagName === "INPUT" && el.type === "checkbox") {
    toggleDone(el);
  }
}

taskList.addEventListener("click", toggle);

taskList.addEventListener("input", (e) => {
  const el = e.target;
  if (el.id.includes("file-upload")) {
    getFileDetail(e);
  }
});

taskList.addEventListener("submit", (e) => {
  e.preventDefault();
  editTask(e);
});
taskList.addEventListener("reset", (e) => {
  const form = e.target; // 整張表單
  form.classList.remove("editing");
  renderItems(tasks, taskList);
});

function editTask(e) {
  e.preventDefault();
  const form = e.target; // 整張表單
  const index = form.querySelector('input[type="checkbox"]').dataset.index;
  const formData = new FormData(form);
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
  renderItems(tasks, taskList);
}

// 拖曳 from 監聽
taskList.addEventListener("drag", (e) => {
  // 拖曳時，原位置的元素
  const from = e.target;
  from.style.opacity = 0;
});

taskList.addEventListener("dragstart", (e) => {
  // 拖曳中的元素
  const from = e.target;
  from.classList.add("dragging");
});

taskList.addEventListener("dragend", (e) => {
  const from = e.target;
  from.classList.remove("dragging");
  from.style.opacity = 1;
});

// 初始渲染
renderItems(tasks, taskList);
