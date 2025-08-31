import type { AppState } from "../../../types/App";
import { openFileInTab } from "../../../utils/tab";
import { findTreeItemById, toggleTreeItemExpanded } from "../../../utils/tree";
import { updateEditor } from "../../editor";
import { renderTree } from "../sidebar";

export const doubleClick = (
  event: MouseEvent,
  appState: AppState,
  projectTree: HTMLDivElement
) => {
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
};
