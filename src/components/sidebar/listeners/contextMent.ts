import type { AppState, TreeItem } from "../../../types/App";
import { findTreeItemById } from "../../../utils/tree";
import { renderTree } from "../sidebar";

let currentContextMenu: HTMLElement | null = null;

export function showContextMenu(
  event: MouseEvent,
  itemId: string,
  appState: AppState,
  projectTree: HTMLDivElement
) {
  event.preventDefault();
  hideContextMenu();

  const item = findTreeItemById(appState.treeItems, itemId);
  if (!item || item.type !== "file") return;

  const menu = document.createElement("div");
  menu.className = "context-menu";
  menu.innerHTML = `
      <div class="context-menu-item" data-action="edit-description">
        Редактировать описание
      </div>
    `;
  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;

  document.body.appendChild(menu);
  currentContextMenu = menu;

  menu.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const menuItem = target.closest(".context-menu-item") as HTMLElement;

    if (menuItem) {
      const action = menuItem.getAttribute("data-action");
      handleContextMenuAction(action, itemId, appState, projectTree);
      hideContextMenu();
    }
  });

  setTimeout(() => {
    document.addEventListener("click", hideContextMenu, { once: true });
  }, 0);
}

export function hideContextMenu() {
  if (currentContextMenu) {
    currentContextMenu.remove();
    currentContextMenu = null;
  }
}

function handleContextMenuAction(
  action: string | null,
  itemId: string,
  appState: AppState,
  projectTree: HTMLDivElement
) {
  const item = findTreeItemById(appState.treeItems, itemId);
  if (!item) return;

  switch (action) {
    case "edit-description":
      editDescriptionWithPrompt(item, appState, projectTree);
      break;
  }
}

export const contextMenu = (
  event: MouseEvent,
  appState: AppState,
  projectTree: HTMLDivElement
) => {
  const target = event.target as HTMLElement;
  const treeItem = target.closest(".tree-item") as HTMLElement;

  if (treeItem) {
    const itemId = treeItem.getAttribute("data-id") || "";
    const fileItem = findTreeItemById(appState.treeItems, itemId);

    if (fileItem && fileItem.type === "file") {
      showContextMenu(event, itemId, appState, projectTree);
    }
  }
};

function editDescriptionWithPrompt(
  item: TreeItem,
  appState: AppState,
  projectTree: HTMLDivElement
) {
  const currentDescription = item.description || "";
  const newDescription = prompt(
    `Редактировать описание для файла "${item.label}":`,
    currentDescription
  );

  if (newDescription !== null) {
    if (newDescription.trim()) {
      item.description = newDescription.trim();
    } else {
      delete item.description;
    }
    renderTree(appState, projectTree);
  }
}
