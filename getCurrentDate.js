export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 選擇檔案，渲染
export function getFileDetail(e) {
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
