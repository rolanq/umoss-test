import type { AppState, OpenTab, TreeItem } from "../types/App";
import { generateId } from "./helpers";
import { escapeHtml } from "./helpers";

export const openFileInTab = (
  fileItem: TreeItem,
  appState: AppState
): boolean => {
  if (fileItem.type !== "file" || !fileItem.content) {
    return false;
  }

  const existingTab = appState.openTabs.find(
    (tab: OpenTab) => tab.fileId === fileItem.id
  );

  if (existingTab) {
    appState.activeTabId = existingTab.id;
    return true;
  }

  const newTab: OpenTab = {
    id: generateId(),
    label: fileItem.label,
    content: fileItem.content,
    fileId: fileItem.id,
  };

  appState.openTabs.push(newTab);
  appState.activeTabId = newTab.id;

  return true;
};

export const closeTab = (tabId: string, appState: AppState): void => {
  const tabIndex = appState.openTabs.findIndex(
    (tab: OpenTab) => tab.id === tabId
  );

  if (tabIndex === -1) return;

  appState.openTabs.splice(tabIndex, 1);

  if (appState.activeTabId === tabId) {
    if (appState.openTabs.length > 0) {
      const newIndex = Math.min(tabIndex, appState.openTabs.length - 1);
      appState.activeTabId = appState.openTabs[newIndex].id;
    } else {
      appState.activeTabId = null;
    }
  }
};

export const switchToTab = (tabId: string, appState: AppState): void => {
  const tab = appState.openTabs.find((tab: OpenTab) => tab.id === tabId);
  if (tab) {
    appState.activeTabId = tabId;
  }
};

export const renderTabs = (appState: AppState): string => {
  if (appState.openTabs.length === 0) {
    return "";
  }

  const tabsHtml = appState.openTabs
    .map((tab: OpenTab) => {
      const isActive = tab.id === appState.activeTabId;
      return `
      <div class="tab ${isActive ? "active" : ""}" data-tab-id="${tab.id}">
        <span class="tab-label">${escapeHtml(tab.label)}</span>
        <span class="tab-close" data-tab-id="${tab.id}">×</span>
      </div>
    `;
    })
    .join("");

  return tabsHtml;
};

export const renderFileContent = (appState: AppState): string => {
  if (!appState.activeTabId) {
    return "";
  }

  const activeTab = appState.openTabs.find(
    (tab: OpenTab) => tab.id === appState.activeTabId
  );

  if (!activeTab) {
    return '<div class="no-content">Файл не найден</div>';
  }

  return `
    <div class="file-content">
      <div class="file-viewer">
        <pre><code>${escapeHtml(activeTab.content)}</code></pre>
      </div>
    </div>
  `;
};
