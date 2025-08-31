import type { AppState } from "../../../types/App";
import { renameTreeItem } from "../../../utils/tree";
import { renderTree } from "../../sidebar/sidebar";

export const rename = (appState: AppState, projectTree: HTMLDivElement) => {
  if (!appState.selectedTreeItemId) {
    alert("Выберите элемент для переименования");
    return;
  }

  appState.editingTreeItemId = appState.selectedTreeItemId;
  renderTree(appState, projectTree);

  const input = projectTree.querySelector(
    ".tree-label-input"
  ) as HTMLInputElement;
  if (input) {
    input.focus();
    input.select();

    const saveRename = () => {
      const newLabel = input.value.trim();
      if (newLabel && newLabel !== appState.selectedTreeItemLabel) {
        const success = renameTreeItem(
          appState.treeItems,
          appState.selectedTreeItemId!,
          newLabel
        );
        if (success) {
          appState.selectedTreeItemLabel = newLabel;
        }
      }

      appState.editingTreeItemId = null;
      renderTree(appState, projectTree);
    };

    const cancelRename = () => {
      appState.editingTreeItemId = null;
      renderTree(appState, projectTree);
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveRename();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelRename();
      }
    });

    input.addEventListener("blur", () => {
      saveRename();
    });
  }
};
