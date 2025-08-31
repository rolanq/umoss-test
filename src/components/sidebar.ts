import type { AppState } from "../types/App";
import {
  findTreeItemById,
  openFileInTab,
  renderTreeItems,
  toggleTreeItemExpanded,
} from "../utils/utils";
import { updateEditor } from "./editor";

export function setupSidebar(appState: AppState) {
  const projectTree = document.getElementById("project-tree") as HTMLDivElement;

  if (projectTree) {
    projectTree.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const treeItem = target.closest(".tree-item") as HTMLElement;

      if (target.classList.contains("tree-toggle")) {
        event.stopPropagation();
        if (treeItem) {
          const itemId = treeItem.getAttribute("data-id") || "";
          toggleTreeItemExpanded(appState.treeItems, itemId);
          renderTree(appState, projectTree);
        }
        return;
      }

      if (treeItem) {
        const label = treeItem.querySelector(".tree-label")?.textContent || "";
        const itemId = treeItem.getAttribute("data-id") || "";
        selectTreeItem(itemId, label, appState, projectTree);
      } else if (
        target === projectTree ||
        target.classList.contains("project-tree")
      ) {
        deselectAllItems(appState, projectTree);
      }
    });

    projectTree.addEventListener("dblclick", (event) => {
      const target = event.target as HTMLElement;
      const treeItem = target.closest(".tree-item") as HTMLElement;

      if (treeItem) {
        const itemId = treeItem.getAttribute("data-id") || "";
        const fileItem = findTreeItemById(appState.treeItems, itemId);

        if (fileItem) {
          if (fileItem.type === "file") {
            const success = openFileInTab(fileItem, appState);
            if (success) {
              updateEditor();
            }
          } else {
            toggleTreeItemExpanded(appState.treeItems, itemId);
            renderTree(appState, projectTree);
          }
        }
      }
    });
  }
}

export function renderTree(appState: AppState, projectTree: HTMLDivElement) {
  projectTree.innerHTML = renderTreeItems(
    appState.treeItems,
    0,
    appState.editingTreeItemId || undefined
  );
}

export function selectTreeItem(
  itemId: string,
  itemLabel: string,
  appState: AppState,
  projectTree: HTMLDivElement
) {
  const allTreeItems = projectTree.querySelectorAll(".tree-item");
  allTreeItems.forEach((item) => item.classList.remove("selected"));

  const targetElement = projectTree.querySelector(`[data-id="${itemId}"]`);
  if (targetElement) {
    targetElement.classList.add("selected");
  }

  appState.selectedTreeItemId = itemId;
  appState.selectedTreeItemLabel = itemLabel;
}

export function deselectAllItems(
  appState: AppState,
  projectTree: HTMLDivElement
) {
  const allTreeItems = projectTree.querySelectorAll(".tree-item");
  allTreeItems.forEach((item) => item.classList.remove("selected"));

  appState.selectedTreeItemId = null;
  appState.selectedTreeItemLabel = null;
}
