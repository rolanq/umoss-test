import type { AppState } from "../../../types/App";
import { generateId } from "../../../utils/helpers";
import {
  findTreeItemById,
  addChildToTreeItem,
  deleteTreeItem,
} from "../../../utils/tree";
import { renderTree } from "../../sidebar/sidebar";

export const createFolder = (
  appState: AppState,
  projectTree: HTMLDivElement
) => {
  const newFolderId = generateId();
  const newFolder = {
    id: newFolderId,
    label: "Новая Папка",
    children: [],
    isExpanded: true,
    type: "folder" as const,
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
        newFolder
      );
      if (!success) {
        appState.treeItems.push(newFolder);
      }
    } else {
      appState.treeItems.push(newFolder);
    }
  } else {
    appState.treeItems.push(newFolder);
  }

  renderTree(appState, projectTree);
};

export const deleteFolder = (
  appState: AppState,
  projectTree: HTMLDivElement
) => {
  if (!appState.selectedTreeItemId) {
    alert("Выберите папку для удаления");
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

  if (selectedItem.type !== "folder") {
    alert(
      "Можно удалять только папки через эту кнопку. Для файлов используйте 'Удалить файл'"
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
    alert("Не удалось удалить папку");
  }
};
