// import { getFileDetail, getCurrentDate } from "./getCurrentDate.js";
import { JSDOM } from "jsdom";

// 模拟DOM环境
const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
globalThis.document = jsdom.window.document;
globalThis.window = jsdom.window;

// 模拟事件对象
const createMockEvent = () => ({
  target: {
    files: [{ name: "example.txt" }], // 模拟文件上传
    closest: () => document.createElement("div"), // 模拟.closest方法
  },
});

// 在每个测试前重置DOM
beforeEach(() => {
  document.body.innerHTML = "";
});

// 编写测试用例
test("getFileDetail function renders file details correctly", () => {
  // 模拟一个包含文件的事件对象
  const event = createMockEvent();

  // 使用 jest.spyOn 来监视 getCurrentDate 函数的调用
  const getCurrentDateSpy = jest.spyOn(globalThis, "getCurrentDate").mockReturnValue("2023-09-14");

  // 调用 getFileDetail 函数
  getFileDetail(event);

  // 验证 getCurrentDate 是否被调用
  expect(getCurrentDateSpy).toHaveBeenCalled();

  // 验证是否创建了正确的文件细节元素
  const fileDetail = document.querySelector(".file_detail");
  expect(fileDetail).not.toBeNull();
  expect(fileDetail.querySelector(".file_name").textContent).toBe("example.txt");
  expect(fileDetail.querySelector(".file_time").getAttribute("data-time")).toBe("2023-09-14");

  // 恢复 getCurrentDate 函数的原始实现
  getCurrentDateSpy.mockRestore();
});
