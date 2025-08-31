import type { AppState } from "../../types/App";
import { uploadFile, downloadFile, deleteFile } from "./listeners/file";
import { createFolder, deleteFolder } from "./listeners/folder";
import { rename } from "./listeners/rename";

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
