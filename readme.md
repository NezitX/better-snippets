![Logo](https://raw.githubusercontent.com/NezitX/better-snippets/main/assets/logo.png)
# BetterSnippets

BetterSnippets is an advanced snippet management plugin for Acode, enhancing your coding experience with customizable and language-specific code snippets.

## Features

- Create, update, and remove snippets for different programming languages
- Language-specific snippet support
- Intelligent snippet suggestions as you type
- Easy-to-use dialog interface for managing snippets
- Efficient caching mechanism for improved performance

## Usage

![Screenshots](https://raw.githubusercontent.com/NezitX/better-snippets/main/assets/screenshots.png)

### Creating a Snippet

1. Open the command palette (Ctrl+Shift+P or Cmd+Shift+P)
2. Type "Create Snippet" and select the command
3. Fill in the required fields:
   - Language: The programming language for the snippet
   - Prefix: The trigger text for the snippet
   - Description: (Optional) A brief description of the snippet
   - Type: (Optional) Metadata for the snippet
   - Code: The actual snippet code

### Updating a Snippet

1. Open the command palette
2. Type "Update Snippet" and select the command
3. Fill in the fields with the updated information

### Removing a Snippet

1. Open the command palette
2. Type "Remove Snippet" and select the command
3. Enter the language and prefix of the snippet you want to remove

### Clearing Snippet Cache

- To clear cache for the current language: Use the "Clear This Snippets Cache" command
- To clear all cached snippets: Use the "Clear All Snippets Cache" command

## API

BetterSnippets provides an API for advanced users and plugin developers:

```javascript
const BetterSnippetsAPI = acode.require('better-snippets');
```

### Methods

- `getSessionMode(session)`: Get the current language mode
- `checkSnippetsDir()`: Ensure the snippets directory exists
- `readSnippetsFile(lang)`: Read snippets for a specific language
- `writeSnippetsFile(lang, snippets)`: Write snippets to a language file
- `createSnippet(lang, snippetData)`: Create a new snippet
- `updateSnippet(lang, snippetData)`: Update an existing snippet
- `removeSnippet(lang, prefix)`: Remove a snippet
- `getAllSnippets(lang)`: Get all snippets for a language

## Contributing

We welcome contributions to the BetterSnippets plugin! Here's how you can help:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with clear, descriptive messages
4. Push your changes to your fork
5. Submit a pull request with a detailed description of your changes

Please ensure your code follows the existing style and includes appropriate tests.

## License

[MIT License](LICENSE)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/NezitX/better-snippets/issues) on our GitHub repository.
