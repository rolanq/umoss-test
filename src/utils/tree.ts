import type { TreeItem } from "../types/App";

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
