// 使用一个立即执行的异步函数来包装所有代码
(async () => {
  console.log("WeRead Enhancement content script initializing...");

  let assistantElement: HTMLDivElement | null = null;
  let isDragging = false;
  let startY = 0;
  let startTop = 0;
  let observer: MutationObserver | null = null;

  // 更新页面颜色
  function updateColors(bgColor: string) {
    // 移除旧的背景色类
    document.body.classList.remove("weread-custom-bg");

    // 如果是透明色或关闭背景色，移除样式标签
    if (bgColor === "transparent") {
      const style = document.getElementById("weread-custom-styles");
      if (style) {
        style.remove();
      }
      return;
    }

    // 添加新的样式到 head
    let style = document.getElementById("weread-custom-styles");
    if (!style) {
      style = document.createElement("style");
      style.id = "weread-custom-styles";
      document.head.appendChild(style);
    }

    // 更新样式规则
    style.textContent = `
      .weread-custom-bg,
      .weread-custom-bg .app_content,
      .weread-custom-bg .readerChapterContent,
      .weread-custom-bg .readerChapterContent_container,
      .weread-custom-bg .readerTopBar {
        background-color: ${bgColor} !important;
      }
    `;

    // 添加类名到 body
    document.body.classList.add("weread-custom-bg");
  }

  // 初始化 MutationObserver
  function initObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLCanvasElement) {
              node.style.position = "relative";
              node.style.zIndex = "0";
            }
          });
        }
      });
    });

    // 确保 body 存在后再开始观察
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      console.log("Started observing DOM mutations");
    }
  }

  // 创建或更新注意力助手元素
  function updateAssistant(config: { enabled: boolean; height: number; width: number; color: string }) {
    console.log("Updating assistant with config:", config);

    if (!config.enabled) {
      assistantElement?.remove();
      assistantElement = null;
      return;
    }

    if (!assistantElement) {
      assistantElement = document.createElement("div");
      assistantElement.id = "weread-attention-assistant";

      // 从存储中恢复位置
      chrome.storage.sync.get(["assistantPosition"], result => {
        if (result.assistantPosition) {
          assistantElement!.style.top = `${result.assistantPosition}px`;
        }
      });

      // 添加拖动功能
      assistantElement.addEventListener("mousedown", e => {
        isDragging = true;
        startY = e.clientY;
        startTop = parseInt(assistantElement!.style.top) || 0; // 确保有一个有效的初始值

        // 添加鼠标样式
        assistantElement!.style.cursor = "grabbing";
      });

      document.addEventListener("mousemove", e => {
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        const newTop = startTop + deltaY;

        // 限制在视口范围内
        const maxTop = window.innerHeight - 10; // 允许拖动到页面底部
        const boundedTop = Math.max(0, Math.min(newTop, maxTop));

        assistantElement!.style.top = `${boundedTop}px`;
        assistantElement!.style.cursor = "grabbing"; // 保持为 grabbing

        assistantElement!.style.transform = "translateX(-50%)";
      });

      document.addEventListener("mouseup", () => {
        if (!isDragging) return;

        isDragging = false;
        assistantElement!.style.cursor = "grab";

        // 保存位置
        const currentTop = parseInt(assistantElement!.style.top);
        chrome.storage.sync.set({ assistantPosition: currentTop });
      });

      document.body.appendChild(assistantElement);
    }

    Object.assign(assistantElement.style, {
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      height: `${config.height}px`,
      width: `${config.width}px`,
      backgroundColor: config.color,
      zIndex: "9999",
      cursor: "grab",
      userSelect: "none",
    });

    // 如果还没有设置位置，设置默认位置
    if (!assistantElement.style.top) {
      assistantElement.style.top = "50%";
      assistantElement.style.transform = "translate(-50%, -50%)";
    }
  }

  // 监听来自 popup 的消息
  chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (response?: any) => void) => {
    console.log("Content script received message:", message);

    if (message.type === "UPDATE_ASSISTANT") {
      updateAssistant(message.config);
      sendResponse({ success: true });
    } else if (message.type === "UPDATE_COLORS") {
      updateColors(message.bgColor);
      sendResponse({ success: true });
    } else if (message.type === "RESET_ASSISTANT_POSITION") {
      if (assistantElement) {
        assistantElement.style.position = "fixed";
        assistantElement.style.left = "50%";
        assistantElement.style.top = "50%";
        assistantElement.style.transform = "translate(-50%, -50%)"; // 确保助手居中
      }
      sendResponse({ success: true });
    }

    return true;
  });

  // 等待 DOM 加载完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initObserver();

      const marker = document.createElement("div");
      marker.id = "weread-enhancement-marker";
      marker.style.position = "fixed";
      marker.style.top = "10px";
      marker.style.right = "10px";
      marker.style.width = "10px";
      marker.style.height = "10px";
      marker.style.backgroundColor = "green";
      marker.style.borderRadius = "50%";
      marker.style.zIndex = "9999";
      document.body.appendChild(marker);

      // 初始化时应用保存的颜色设置
      chrome.storage.sync.get(["bgColor"], result => {
        if (result.bgColor) {
          updateColors(result.bgColor);
        }
      });

      console.log("WeRead Enhancement ready for use");
    });
  } else {
    // 如果 DOM 已经加载完成，直接初始化
    initObserver();
    console.log("WeRead Enhancement initialized (DOM already loaded)");
  }

  console.log("WeRead Enhancement content script initialized successfully");
})();
