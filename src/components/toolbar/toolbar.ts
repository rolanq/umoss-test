import type { AppState } from "../../types/App";
import { renameTreeItem } from "../../utils/utils";
import { renderTree } from "../sidebar";
import { uploadFile, downloadFile, deleteFile } from "./components/file";
import { createFolder, deleteFolder } from "./components/folder";

export function setupToolbar(appState: AppState) {
  const createFolderButton = document.getElementById(
    "create-folder"
  ) as HTMLButtonElement;
  const deleteFolderButton = document.getElementById(
    "delete-folder"
  ) as HTMLButtonElement;
  const uploadFileButton = document.getElementById(
    "upload-file"
  ) as HTMLButtonElement;
  const downloadFileButton = document.getElementById(
    "download-file"
  ) as HTMLButtonElement;
  const deleteFileButton = document.getElementById(
    "delete-file"
  ) as HTMLButtonElement;
  const renameButton = document.getElementById(
    "rename-file"
  ) as HTMLButtonElement;
  const projectTree = document.getElementById("project-tree") as HTMLDivElement;

  if (createFolderButton && projectTree) {
    createFolderButton.addEventListener("click", () => {
      createFolder(appState, projectTree);
    });
  }

  if (deleteFolderButton && projectTree) {
    deleteFolderButton.addEventListener("click", () => {
      deleteFolder(appState, projectTree);
    });
  }

  if (uploadFileButton && projectTree) {
    uploadFileButton.addEventListener("click", () => {
      uploadFile(appState, projectTree);
    });
  }

  if (downloadFileButton && projectTree) {
    downloadFileButton.addEventListener("click", () => {
      downloadFile(appState);
    });
  }

  if (deleteFileButton && projectTree) {
    deleteFileButton.addEventListener("click", () => {
      deleteFile(appState, projectTree);
    });
  }

  if (renameButton && projectTree) {
    renameButton.addEventListener("click", () => {
      rename(appState, projectTree);
    });
  }
}

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
