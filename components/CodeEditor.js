import d from '../other/dominant.js';

class CodeEditor {
  onAttach = () => {
    let { currentSite, currentFile } = state.app;
    if (!currentSite || !currentFile) { return }
    Object.assign(this, { currentSite, currentFile });
    this.editor = ace.edit(this.root);
    this.editor.setFontSize('16px');
    this.editor.setTheme('ace/theme/monokai');
    let mode = { css: 'css', js: 'javascript', md: 'markdown' }[this.currentFile.split('.').pop()];
    mode && this.editor.session.setMode(`ace/mode/${mode}`);
    this.editor.session.setTabSize(2);
    this.editor.session.setValue(state.app.editorText);
    this.onChange = this.onChange.bind(this);
    this.editor.session.on('change', this.onChange);
    this.editor.focus();
  };

  onDetach = () => this.editor?.session?.off?.('change', this.onChange);
  onChange = debounce(() => post('editor.changeCodeEditor', this.currentSite, this.currentFile, this.editor.session.getValue()), 200);
  render = () => this.root = d.html`<div class="CodeEditor flex-1" ${{ onAttach: this.onAttach, onDetach: this.onDetach }}></div>`;
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default CodeEditor;
