import type { TreeItem } from "../types/App";
import { escapeHtml } from "./helpers";

export const renderTreeItems = (
  items: TreeItem[],
  level: number = 0,
  editingId?: string
): string => {
  return items
    .map((item) => {
      const hasChildren = item.children.length > 0;

      let icon = "📁";
      if (item.type === "file") {
        icon = "📄";
      } else if (hasChildren) {
        icon = item.isExpanded ? "📂" : "📁";
      }

      const childrenHtml =
        hasChildren && item.isExpanded
          ? renderTreeItems(item.children, level + 1, editingId)
          : "";

      const expandableClass = hasChildren ? " expandable" : "";
      const expandedClass = hasChildren && item.isExpanded ? " expanded" : "";
      const editingClass = editingId === item.id ? " editing" : "";
      const fileClass = item.type === "file" ? " file" : " folder";
      const hasDescriptionClass = item.description ? " has-description" : "";

      const labelContent =
        editingId === item.id
          ? `<input type="text" class="tree-label-input" value="${escapeHtml(
              item.label
            )}" data-id="${item.id}">`
          : `<span class="tree-label">${escapeHtml(item.label)}</span>`;

      return `
      <div class="tree-item tree-level-${level}${expandableClass}${expandedClass}${editingClass}${fileClass}${hasDescriptionClass}" data-id="${
        item.id
      }">
        <div class="tree-item-content">
        ${
          item.type === "folder" && hasChildren
            ? `<span class="tree-toggle">▶</span>`
            : '<span class="tree-toggle-placeholder"></span>'
        }
        <span class="tree-icon">${icon}</span>
        ${labelContent}
        </div>
      </div>
      ${childrenHtml}
    `;
    })
    .join("");
};
