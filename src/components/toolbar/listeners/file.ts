import type { AppState } from "../../../types/App";
import { generateId } from "../../../utils/helpers";
import {
  findTreeItemById,
  addChildToTreeItem,
  deleteTreeItem,
} from "../../../utils/tree";
import { renderTree } from "../../sidebar/sidebar";

export const uploadFile = (appState: AppState, projectTree: HTMLDivElement) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.style.display = "none";

  fileInput.addEventListener("change", (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const newFileId = generateId();
        const newFile = {
          id: newFileId,
          label: file.name,
          children: [],
          isExpanded: false,
          type: "file" as const,
          content: e.target?.result as string,
          size: file.size,
        };

        if (appState.selectedTreeItemId) {
          const selectedItem = findTreeItemById(
            appState.treeItems,
            appState.selectedTreeItemId
          );
          if (selectedItem && selectedItem.type === "folder") {
            const success = addChildToTreeItem(
              appState.treeItems,
              appState.selectedTreeItemId,
              newFile
            );
            if (!success) {
              appState.treeItems.push(newFile);
            }
          } else {
            appState.treeItems.push(newFile);
          }
        } else {
          appState.treeItems.push(newFile);
        }

        renderTree(appState, projectTree);
      };

      reader.readAsText(file);
    }
  });

  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
};

export const downloadFile = (appState: AppState) => {
  if (!appState.selectedTreeItemId) {
    alert("Выберите файл для скачивания");
    return;
  }

  const selectedItem = findTreeItemById(
    appState.treeItems,
    appState.selectedTreeItemId
  );

  if (!selectedItem) {
    alert("Файл не найден");
    return;
  }

  if (selectedItem.type !== "file") {
    alert("Можно скачивать только файлы");
    return;
  }

  if (!selectedItem.content) {
    alert("Файл пустой");
    return;
  }

  const blob = new Blob([selectedItem.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = selectedItem.label;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};

export const deleteFile = (appState: AppState, projectTree: HTMLDivElement) => {
  if (!appState.selectedTreeItemId) {
    alert("Выберите файл для удаления");
    return;
  }

  const selectedItem = findTreeItemById(
    appState.treeItems,
    appState.selectedTreeItemId
  );

  if (!selectedItem) {
    alert("Элемент не найден");
    return;
  }

  if (selectedItem.type !== "file") {
    alert(
      "Можно удалять только файлы через эту кнопку. Для папок используйте 'Удалить Папку'"
    );
    return;
  }

  const deleted = deleteTreeItem(
    appState.treeItems,
    appState.selectedTreeItemId
  );

  if (deleted) {
    appState.selectedTreeItemId = null;
    appState.selectedTreeItemLabel = null;

    renderTree(appState, projectTree);
  } else {
    alert("Не удалось удалить файл");
  }
};
