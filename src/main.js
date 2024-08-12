import plugin from "../plugin.json";
import style from './style.css';

import BetterSnippetsAPI from './api.js';
import { handleError, createDialogHTML } from './utils.js';

const DialogBox = acode.require('dialogBox');
const toast = acode.require("toast");
const { activeFile, editor } = editorManager;
const { snippetManager } = ace.require("ace/snippets");

class BetterSnippets {
  #completer;
  #snippetCache = new Map();
  #fullSnippetHTML;
  #removeSnippetHTML;
  #styles;

  constructor() {
    acode.define('better-snippets', BetterSnippetsAPI);
    
    this.#setSnippetsVariables();
    this.#createDialogTemplates();
    this.#initCompleter();

    this.#styles = tag('style', {
      textContent: style
    });
    document.head.append(this.styles);
  }

  #setSnippetsVariables() {
    snippetManager.variables.FILE_NAME = () => {
      const activeFileName = activeFile.filename;
      return activeFileName.substring(0, activeFileName.lastIndexOf("."));
    };
  }

  #createDialogTemplates() {
    this.#fullSnippetHTML = createDialogHTML(
      { label: 'Language', require: true, placeholder: 'javascript' }, 
      { label: 'Prefix', require: true, placeholder: 'log' }, 
      { label: 'Description', placeholder: 'Snippet docHTML (optional)' }, 
      { label: 'Type', placeholder: 'Snippet meta (optional)' }, 
      { label: 'Code', require: true, type: 'textarea', placeholder: 'console.log(\${1:value})' }
    );

    this.#removeSnippetHTML = createDialogHTML(
      { label: 'Language', require: true, placeholder: 'javascript' }, 
      { label: 'Prefix', require: true, placeholder: 'log' }
    );
  };

  #initCompleter() {
    this.#completer = {
      getCompletions: this.#getCompletions.bind(this),
      identifierRegexps: [/.*/]
    };
    editor.completers.unshift(this.#completer);
  }

  async #getCompletions(editor, session, pos, prefix, callback) {
    try {
      const fileMode = BetterSnippetsAPI.getSessionMode(session);
      let snippets = this.#snippetCache.get(fileMode);

      if (!snippets) {
        snippets = await BetterSnippetsAPI.readSnippetsFile(fileMode);
        this.#snippetCache.set(fileMode, snippets);
      };

      const baseSnippets = snippets.map(({
        prefix,
        code,
        type = "Snippet",
        description = ""
      }) => ({
        caption: prefix,
        snippet: code,
        value: code,
        meta: type,
        type: "snippet",
        docHTML: description
      }));

      callback(null, baseSnippets);
    } catch (error) {
      handleError('Error fetching snippet completions', error);
      callback(null, []);
    }
  }

  async init() {
    await BetterSnippetsAPI.checkSnippetsDir();
    editor.commands.addCommand({
      name: "better-snippets:create_snippet",
      description: "Create Snippet",
      exec: this.createSnippet.bind(this)
    });
    editor.commands.addCommand({
      name: "better-snippets:update_snippet",
      description: "Update Snippet",
      exec: this.updateSnippet.bind(this)
    });
    editor.commands.addCommand({
      name: "better-snippets:remove_snippet",
      description: "Remove Snippet",
      exec: this.removeSnippet.bind(this)
    });
    editor.commands.addCommand({
      name: "better-snippets:clear_all_cache",
      description: "Clear All Snippets Cache",
      exec: this.clearSnippetsCache.bind(this, null)
    });
    editor.commands.addCommand({
      name: "better-snippets:clear_cache",
      description: "Clear This Snippets Cache",
      exec: this.clearSnippetsCache.bind(this, BetterSnippetsAPI.getSessionMode(editor.session))
    });
  }

  async createSnippet() {
    try {
      const dialog = DialogBox(
        'Create a new snippet',
        this.#fullSnippetHTML,
        'Create',
        'Cancel'
      );

      dialog.ok(() => {
        const [langInput, prefixInput, descInput] = document.querySelectorAll('.bs-dialog input');
        const code = document.querySelector('.bs-dialog textarea');

        if (langInput.value.trim() === '') return langInput.reportValidity();
        if (prefixInput.value.trim() === '') return prefixInput.reportValidity();
        if (code.value.trim() === '') return code.reportValidity();

        const result = BetterSnippetsAPI.createSnippet(langInput.value.trim(), {
          prefix: prefixInput.value.trim(),
          description: descInput.value.trim(),
          code: code.value.trim()
        });

        if (result) {
          this.#snippetCache.delete(langInput.value.toLowerCase().trim());
          toast('[BetterSnippets] Snippet created successfully');
        } else {
          toast('[BetterSnippets] Snippet creation failed');
        }
        dialog.hide();
      }).cancel(() => {
        toast('[BetterSnippets] Snippet creation cancelled');
        dialog.hide();
      }).onhide(() => {
        toast('[BetterSnippets] Snippet creation cancelled');
      });
    } catch (e) {
      handleError('Error during snippet creation', e);
    }
  }

  async updateSnippet() {
    try {
      const dialog = DialogBox(
        'Update a snippet',
        this.#fullSnippetHTML,
        'Update',
        'Cancel'
      );

      dialog.ok(() => {
        const [langInput, prefixInput, descInput] = document.querySelectorAll('.bs-dialog input');
        const code = document.querySelector('.bs-dialog textarea');

        if (langInput.value.trim() === '') return langInput.reportValidity();
        if (prefixInput.value.trim() === '') return prefixInput.reportValidity();
        if (code.value.trim() === '') return code.reportValidity();

        const result = BetterSnippetsAPI.updateSnippet(langInput.value.trim(), {
          prefix: prefixInput.value.trim(),
          description: descInput.value.trim(),
          code: code.value.trim()
        });

        if (result) {
          this.#snippetCache.delete(langInput.value.toLowerCase().trim());
          toast('[BetterSnippets] Snippet updated successfully');
        } else {
          toast('[BetterSnippets] Snippet updating failed');
        }
        dialog.hide();
      }).cancel(() => {
        toast('[BetterSnippets] Snippet updating canceled');
        dialog.hide();
      }).onhide(() => {
        toast('[BetterSnippets] Snippet updating canceled');
      });
    } catch (e) {
      handleError('Error during snippet updating', e);
    }
  }

  async removeSnippet() {
    try {
      const dialog = DialogBox(
        'Remove a snippet',
        this.#removeSnippetHTML,
        'Remove',
        'Cancel'
      );

      dialog.ok(() => {
        const [langInput, prefixInput] = document.querySelectorAll('.bs-dialog input');

        if (langInput.value.trim() === '') return langInput.reportValidity();
        if (prefixInput.value.trim() === '') return prefixInput.reportValidity();

        const result = BetterSnippetsAPI.removeSnippet(langInput.value.trim(), prefixInput.value.trim());
        if (result) {
          this.#snippetCache.delete(langInput.value.toLowerCase().trim());
          toast('[BetterSnippets] Snippet removed successfully');
        } else {
          toast('[BetterSnippets] Snippet removing failed');
        }
        dialog.hide();
      }).cancel(() => {
        toast('[BetterSnippets] Snippet removing canceled');
        dialog.hide();
      }).onhide(() => {
        toast('[BetterSnippets] Snippet removing canceled');
      });
    } catch (e) {
      handleError('Error during snippet removing', e);
    }
  }

  clearSnippetsCache(mode) {
    if (mode) {
      this.#snippetCache.delete(mode);
      toast(`[BetterSnippets] Snippet Cache in ${mode} mode cleared`);
    } else {
      this.#snippetCache.clear();
      toast(`[BetterSnippets] All Snippets Cache cleared`);
    }
  }

  destroy() {
    const index = editor.completers.indexOf(this.#completer);
    if (index !== -1) {
      editor.completers.splice(index, 1);
    }

    editor.commands.removeCommand('better-snippets:create_snippet');
    editor.commands.removeCommand('better-snippets:update_snippet');
    editor.commands.removeCommand('better-snippets:remove_snippet');
    editor.commands.removeCommand('better-snippets:clear_all_cache');
    editor.commands.removeCommand('better-snippets:clear_cache');

    document.head.removeChild(this.#styles);
  }
}

if (window.acode) {
  const acodePlugin = new BetterSnippets();

  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    acodePlugin.baseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });

  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}