import type { AppState } from "../../../types/App";
import { toggleTreeItemExpanded } from "../../../utils/tree";
import { renderTree } from "../sidebar";

export const select = (
  event: MouseEvent,
  appState: AppState,
  projectTree: HTMLDivElement
) => {
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
};

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
