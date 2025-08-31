import type { AppState } from "../../types/App";
import { select } from "./listeners/selectItem";
import { doubleClick } from "./listeners/doubleClick";
import { contextMenu, hideContextMenu } from "./listeners/contextMent";
import { hideTooltip, tooltip } from "./listeners/tooltip";
import { renderTreeItems } from "../../utils/render";

export function setupSidebar(appState: AppState) {
  const projectTree = document.getElementById("project-tree") as HTMLDivElement;

  if (projectTree) {
    projectTree.addEventListener("click", (event) =>
      select(event, appState, projectTree)
    );

    projectTree.addEventListener("dblclick", (event) =>
      doubleClick(event, appState, projectTree)
    );

    projectTree.addEventListener("contextmenu", (event) => {
      contextMenu(event, appState, projectTree);
    });

    projectTree.addEventListener(
      "mouseenter",
      (event) => {
        tooltip(event, appState);
      },
      true
    );

    projectTree.addEventListener("mouseleave", () => {
      hideTooltip();
    });

    projectTree.addEventListener("click", () => {
      hideContextMenu();
      hideTooltip();
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
