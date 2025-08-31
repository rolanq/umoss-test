import "./style.css";
import { setupToolbar } from "./components/toolbar/toolbar";
import type { AppState } from "./types/App";
import { setupSidebar } from "./components/sidebar";
import { setupEditor } from "./components/editor";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="app-container">
    <div class="toolbar">
      <button class="toolbar-btn" id="create-folder">Создать Папку</button>
      <button class="toolbar-btn" id="delete-folder">Удалить Папку</button>
      <button class="toolbar-btn" id="upload-file">Загрузить файл</button>
      <button class="toolbar-btn" id="download-file">Скачать файл</button>
      <button class="toolbar-btn" id="delete-file">Удалить файл</button>
      <button class="toolbar-btn" id="rename-file">Переименовать</button>
    </div>
    
    <div class="main-content">
      <div class="sidebar">
        <div class="project-tree" id="project-tree">
          
        </div>
      </div>
      

      <div class="editor-area">
        <div class="tabs"></div>
        <div class="code-editor"></div>
      </div>
    </div>
  </div>
`;

const appState: AppState = {
  selectedTreeItemId: null,
  selectedTreeItemLabel: null,
  editingTreeItemId: null,
  openTabs: [],
  activeTabId: null,
  treeItems: [],
};

setupToolbar(appState);
setupSidebar(appState);
setupEditor(appState);
