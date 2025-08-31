export type TreeItem = {
  id: string;
  label: string;
  children: TreeItem[];
  isExpanded: boolean;
  type: "folder" | "file";
  content?: string;
  size?: number;
};

export type OpenTab = {
  id: string;
  label: string;
  content: string;
  fileId: string;
};

export type AppState = {
  selectedTreeItemId: null | string;
  selectedTreeItemLabel: null | string;
  editingTreeItemId: null | string;
  openTabs: OpenTab[];
  activeTabId: null | string;
  treeItems: TreeItem[];
};
