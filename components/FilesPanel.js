import d from '../other/dominant.js';
import { joinPath, loadman } from '../other/util.js';

class FilesPanel {
  render = () => d.html`
    <div class="FilesPanel flex flex-col bg-[#091017] text-neutral-100 w-96 border-r border-black/50" ${{
      'wf-disabled': () => state.app.tourDisable.has('FilesPanel'),
      onDragOver: ev => post('app.dragOverFile', ev),
      onDrop: ev => post('app.dropFile', ev),
    }}>
      <button class="FilesPanel-createBtn outline-none border-b border-black/50 transition-all h-12 text-xl bg-[#0071b2] transition-colors hover:bg-[#008ad9]" ${{
        onClick: () => post('app.createRootFolder'),
      }}>
        Create
      </button>
      <div class="FilesPanel-fileList flex flex-col gap-2 p-4 max-h-screen overflow-auto">
        ${d.if(() => loadman.has('app.selectSite'), d.html`
          <div class="flex items-center gap-3">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        `, d.map(() => state.app.files, ([name, path, isDir]) => d.html`
          <a href="#" class="FilesPanel-file flex items-center gap-3 rounded outline-none py-1 justify-between px-2" ${{
            class: [
              () => !state.app.expandedPath(path) && 'hidden',
              () => `ml-[${(path.split('/').length - 1) * 1.25}rem]`, () => state.app.currentFile === joinPath(path, name) && 'bg-black/70',
              () => joinPath(path, name) === 'pages/index.html' && 'FilesPanel-indexHtml',
            ],
            onClick: () => post('app.selectFile', joinPath(path, name), isDir),
            draggable: true,
            onDragStart: ev => post('app.dragStartFile', ev, joinPath(path, name)),
            onDragOver: ev => post('app.dragOverFile', ev),
            onDrop: ev => post('app.dropFile', ev, joinPath(path, name)),
          }}>
            <div class="max-w-[calc(100%_-_5rem)] flex items-center gap-3">
              <div class="nf p-2" ${{ class: () => `nf-fa-${isDir ? (state.app.expandedPath(path + name + '/.keep') ? 'folder_open' : 'folder') : 'file'}` }}></div>
              <div class="FilesPanel-fileName overflow-hidden text-ellipsis">${name}</div>
            </div>
            <div class="flex">
              ${d.if(() => isDir, d.html`
                <button class="FilesPanel-createInsideBtn outline-none nf p-2 nf-fa-plus" ${{ onClick: ev => { ev.stopPropagation(); post('app.createFile', joinPath(path, name), isDir) } }}></button>`
              )}
              ${d.if(() => !['components', 'controllers', 'images', 'pages'].includes(joinPath(path, name)), d.html`
                <button class="FilesPanel-renameBtn outline-none nf p-2 nf-fa-pencil" ${{ onClick: ev => { ev.stopPropagation(); post('app.renameFile', joinPath(path, name), isDir) } }}></button>
                <button class="FilesPanel-deleteBtn outline-none nf p-2 nf-fa-trash" ${{ onClick: ev => { ev.stopPropagation(); post('app.deleteFile', joinPath(path, name), isDir) } }}></button>
              `)}
            </div>
          </a>
        `))}
      </div>
    </div>
  `;
}

export default FilesPanel;
