import type { TreeItem } from "../types/App";

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const openFileInTab = (fileItem: TreeItem, appState: any): boolean => {
  if (fileItem.type !== "file" || !fileItem.content) {
    return false;
  }

  const existingTab = appState.openTabs.find(
    (tab: any) => tab.fileId === fileItem.id
  );

  if (existingTab) {
    appState.activeTabId = existingTab.id;
    return true;
  }

  const newTab = {
    id: generateId(),
    label: fileItem.label,
    content: fileItem.content,
    fileId: fileItem.id,
  };

  appState.openTabs.push(newTab);
  appState.activeTabId = newTab.id;

  return true;
};

export const closeTab = (tabId: string, appState: any): void => {
  const tabIndex = appState.openTabs.findIndex((tab: any) => tab.id === tabId);

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

export const switchToTab = (tabId: string, appState: any): void => {
  const tab = appState.openTabs.find((tab: any) => tab.id === tabId);
  if (tab) {
    appState.activeTabId = tabId;
  }
};

export const renderTabs = (appState: any): string => {
  if (appState.openTabs.length === 0) {
    return "";
  }

  const tabsHtml = appState.openTabs
    .map((tab: any) => {
      const isActive = tab.id === appState.activeTabId;
      return `
      <div class="tab ${isActive ? "active" : ""}" data-tab-id="${tab.id}">
        <span class="tab-label">${tab.label}</span>
        <span class="tab-close" data-tab-id="${tab.id}">×</span>
      </div>
    `;
    })
    .join("");

  return tabsHtml;
};

export const renderFileContent = (appState: any): string => {
  if (!appState.activeTabId) {
    return "";
  }

  const activeTab = appState.openTabs.find(
    (tab: any) => tab.id === appState.activeTabId
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

const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

export const findTreeItemById = (
  items: TreeItem[],
  id: string
): TreeItem | null => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    const found = findTreeItemById(item.children, id);
    if (found) {
      return found;
    }
  }
  return null;
};

export const addChildToTreeItem = (
  items: TreeItem[],
  parentId: string,
  newChild: TreeItem
): boolean => {
  for (const item of items) {
    if (item.id === parentId) {
      item.children.push(newChild);
      return true;
    }
    if (addChildToTreeItem(item.children, parentId, newChild)) {
      return true;
    }
  }
  return false;
};

export const toggleTreeItemExpanded = (
  items: TreeItem[],
  itemId: string
): boolean => {
  for (const item of items) {
    if (item.id === itemId) {
      item.isExpanded = !item.isExpanded;
      return true;
    }
    if (toggleTreeItemExpanded(item.children, itemId)) {
      return true;
    }
  }
  return false;
};

export const deleteTreeItem = (items: TreeItem[], itemId: string): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      items.splice(i, 1);
      return true;
    }
    if (deleteTreeItem(items[i].children, itemId)) {
      return true;
    }
  }
  return false;
};

export const renameTreeItem = (
  items: TreeItem[],
  itemId: string,
  newLabel: string
): boolean => {
  for (const item of items) {
    if (item.id === itemId) {
      item.label = newLabel;
      return true;
    }
    if (renameTreeItem(item.children, itemId, newLabel)) {
      return true;
    }
  }
  return false;
};

export const renderTreeItems = (
  items: TreeItem[],
  level: number = 0,
  editingId?: string
): string => {
  return items
    .map((item) => {
      const hasChildren = item.children.length > 0;

      let icon = "📁";
      if (item.type === "file") {
        icon = "📄";
      } else if (hasChildren) {
        icon = item.isExpanded ? "📂" : "📁";
      }

      const childrenHtml =
        hasChildren && item.isExpanded
          ? renderTreeItems(item.children, level + 1, editingId)
          : "";

      const expandableClass = hasChildren ? " expandable" : "";
      const expandedClass = hasChildren && item.isExpanded ? " expanded" : "";
      const editingClass = editingId === item.id ? " editing" : "";
      const fileClass = item.type === "file" ? " file" : " folder";

      const labelContent =
        editingId === item.id
          ? `<input type="text" class="tree-label-input" value="${item.label}" data-id="${item.id}">`
          : `<span class="tree-label">${item.label}</span>`;

      return `
      <div class="tree-item tree-level-${level}${expandableClass}${expandedClass}${editingClass}${fileClass}" data-id="${
        item.id
      }">
        <div class="tree-item-content">
        ${
          item.type === "folder" && hasChildren
            ? `<span class="tree-toggle">▶</span>`
            : '<span class="tree-toggle-placeholder"></span>'
        }
        <span class="tree-icon">${icon}</span>
        ${labelContent}
        </div>
      </div>
      ${childrenHtml}
    `;
    })
    .join("");
};
