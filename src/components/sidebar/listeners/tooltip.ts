import type { AppState, TreeItem } from "../../../types/App";
import { findTreeItemById } from "../../../utils/tree";

let currentTooltip: HTMLElement | null = null;

export const tooltip = (event: MouseEvent, appState: AppState) => {
  const target = event.target as HTMLElement;
  const treeItem = target.closest(".tree-item") as HTMLElement;

  if (treeItem && treeItem.classList.contains("has-description")) {
    const itemId = treeItem.getAttribute("data-id") || "";
    const fileItem = findTreeItemById(appState.treeItems, itemId);

    if (fileItem && fileItem.type === "file" && fileItem.description) {
      showTooltip(event, fileItem);
    }
  }
};

export function showTooltip(event: MouseEvent, item: TreeItem) {
  if (!item.description) return;

  hideTooltip();

  const tooltip = document.createElement("div");
  tooltip.className = "description-tooltip";
  tooltip.textContent = item.description;

  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;

  document.body.appendChild(tooltip);
  currentTooltip = tooltip;
}

export function hideTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
}
