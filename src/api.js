const fs = acode.require("fs");
const toast = acode.require("toast");

const BetterSnippetsAPI = {
  SnippetsPath: `${DATA_STORAGE}/snippets`,

  getSessionMode(session) {
    return session.getMode().$id.split("/").pop();
  },

  async checkSnippetsDir() {
    const snippetsDir = fs(this.SnippetsPath);
    if (!(await snippetsDir.exists())) {
      await fs(DATA_STORAGE).createDirectory('snippets');
    }
  },

  async readSnippetsFile(lang) {
    await this.checkSnippetsDir();
    const snippetsFile = fs(`${this.SnippetsPath}/${lang.toLowerCase()}`);
    if (!(await snippetsFile.exists())) {
      await fs(this.SnippetsPath).createFile(lang.toLowerCase(), '[]');
      return [];
    }
    const snippetsContent = await snippetsFile.readFile('utf-8');
    return JSON.parse(snippetsContent);
  },

  async writeSnippetsFile(lang, snippets) {
    await fs(`${this.SnippetsPath}/${lang.toLowerCase()}`).writeFile(JSON.stringify(snippets));
  },

  async createSnippet(lang, { prefix, code, type = 'Snippet', description = '' }) {
    await this.checkSnippetsDir();
    const snippets = await this.readSnippetsFile(lang);
    snippets.push({ prefix, code, type, description });
    await this.writeSnippetsFile(lang, snippets);
    return true;
  },

  async updateSnippet(lang, { prefix, code, type = 'Snippet', description = '' }) {
    await this.checkSnippetsDir();
    const snippets = await this.readSnippetsFile(lang);
    const snippetIndex = snippets.findIndex(s => s.prefix === prefix);
    if (snippetIndex !== -1) {
      snippets[snippetIndex] = { prefix, code, type, description };
      await this.writeSnippetsFile(lang, snippets);
      return true;
    }
    return false;
  },

  async removeSnippet(lang, prefix) {
    await this.checkSnippetsDir();
    const snippets = await this.readSnippetsFile(lang);
    const filteredSnippets = snippets.filter(s => s.prefix !== prefix);
    if (filteredSnippets.length < snippets.length) {
      await this.writeSnippetsFile(lang, filteredSnippets);
      return true;
    }
    return false;
  },

  async getAllSnippets(lang) {
    await this.checkSnippetsDir();
    return this.readSnippetsFile(lang);
  }
};

export default BetterSnippetsAPI;