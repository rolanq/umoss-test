import type { AppState } from "../types/App";
import {
  renderTabs,
  renderFileContent,
  closeTab,
  switchToTab,
} from "../utils/utils";

export function setupEditor(appState: AppState) {
  const tabsContainer = document.querySelector(".tabs") as HTMLDivElement;
  const editorContainer = document.querySelector(
    ".code-editor"
  ) as HTMLDivElement;

  if (!tabsContainer || !editorContainer) {
    console.error("Не найдены контейнеры для табов или редактора");
    return;
  }

  const updateEditor = () => {
    tabsContainer.innerHTML = renderTabs(appState);
    editorContainer.innerHTML = renderFileContent(appState);
    setupTabEventListeners();
  };

  const setupTabEventListeners = () => {
    const tabs = tabsContainer.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      const tabElement = tab as HTMLElement;
      const tabId = tabElement.getAttribute("data-tab-id");

      if (tabId) {
        tabElement.addEventListener("click", (e) => {
          e.stopPropagation();
          switchToTab(tabId, appState);
          updateEditor();
        });
      }
    });

    const closeButtons = tabsContainer.querySelectorAll(".tab-close");
    closeButtons.forEach((button) => {
      const buttonElement = button as HTMLElement;
      const tabId = buttonElement.getAttribute("data-tab-id");

      if (tabId) {
        buttonElement.addEventListener("click", (e) => {
          e.stopPropagation();
          closeTab(tabId, appState);
          updateEditor();
        });
      }
    });
  };

  (window as any).updateEditor = updateEditor;
  updateEditor();
}

export function updateEditor() {
  if ((window as any).updateEditor) {
    (window as any).updateEditor();
  }
}
