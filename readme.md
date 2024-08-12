![Logo](https://raw.githubusercontent.com/NezitX/better-snippets/main/assets/logo.png)

# BetterSnippets

BetterSnippets is a plugin for [Acode](https://acode.app/) that helps you manage and use code snippets more easily.

## Features

- Make, change, and delete snippets for different coding languages
- Snippets that work for specific languages
- Smart suggestions as you type
- Easy-to-use pop-up windows for managing snippets
- Fast loading with smart saving

## How to Use

![Screenshots](https://raw.githubusercontent.com/NezitX/better-snippets/main/assets/screenshots.png)

### Making a New Snippet

1. Open the command menu (Ctrl+Shift+P or Cmd+Shift+P)
2. Type "Create Snippet" and pick it
3. Fill in the boxes:
   - Language: What coding language it's for
   - Prefix: The short text that brings up the snippet
   - Description: (If you want) A short note about what it does
   - Type: (If you want) Extra info about the snippet
   - Code: The actual snippet code

### Changing a Snippet

1. Open the command menu
2. Type "Update Snippet" and pick it
3. Fill in the boxes with the new info

### Deleting a Snippet

1. Open the command menu
2. Type "Remove Snippet" and pick it
3. Type in the language and prefix of the snippet you want to delete

### Clearing Saved Snippets

- To clear saved snippets for the current language: Use "Clear This Snippets Cache"
- To clear all saved snippets: Use "Clear All Snippets Cache"

## For Advanced Users

BetterSnippets has tools for advanced users and plugin makers:

```javascript
const BetterSnippetsAPI = acode.require('better-snippets');
```

### What You Can Do

- `getSessionMode(session)`: Find out the current language
- `checkSnippetsDir()`: Make sure the snippet folder exists
- `readSnippetsFile(lang)`: Get snippets for a language
- `writeSnippetsFile(lang, snippets)`: Save snippets for a language
- `createSnippet(lang, snippetData)`: Make a new snippet
- `updateSnippet(lang, snippetData)`: Change an existing snippet
- `removeSnippet(lang, prefix)`: Delete a snippet
- `getAllSnippets(lang)`: Get all snippets for a language

## Where Snippets Are Stored

All your snippets are saved in the Acode [data storage](https://acode-plugin-docs.vercel.app/docs/global-apis/global-utilities#data-storage), in a folder called "snippets". Each language has its own file, named after the language (like "javascript" or "python"). These files are in [JSON](https://www.json.org) format, which means you can edit them directly if you want. Just be careful to keep the correct format when you make changes.

## Help Us Improve

We'd love your help to make BetterSnippets even better! Here's how:

1. Copy the project to your own GitHub account
2. Make a new branch for your changes
3. Make your changes and save them with clear messages
4. Send your changes to your copy
5. Ask us to add your changes to the main project

Please try to follow the way the code is written and add tests if you can.

## License

[MIT License](LICENSE)

## Need Help?

If you have problems or questions, please [tell us about it](https://github.com/NezitX/better-snippets/issues) on our GitHub page.