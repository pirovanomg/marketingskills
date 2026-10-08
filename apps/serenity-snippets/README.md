# Serenity Snippets

A simple snippet library for Serenity Home Healthcare staff writing client notes in Axiscare, or anywhere else: emails, texts, documents.

- **166 pre-written snippets** in 14 categories (Client Profile & Matching, Personal Care, Mobility & Fall Prevention, Meals, Mood & Behavior, Safety & Incidents, and more)
- **Click to copy**, then paste with Ctrl+V (Cmd+V on Mac)
- **Search with suggestions as you type**. Use the arrow keys and press Enter to copy.
- **Favorites** (star) and **Recently used** sections at the top
- **My Snippets**: write your own, or make your own version of any built-in snippet
- **Keyboard shortcuts**: assign a combo like Alt+Shift+1 to any snippet
- `{date}` and `{time}` in a snippet are filled in automatically when it's copied
- **Back up / restore**, for moving your snippets to a new computer or sharing a set with coworkers

It does not connect to Axiscare or anything else. Everything stays in the browser on that computer.

## Sharing it with staff

Run `node build.js` to create two files in `dist/` that you can email, put on a shared drive, or copy to a USB stick. Nobody needs a GitHub or Claude account.

- **`Serenity Snippets.html`**: a single file. Staff save it (for example to their Desktop) and double-click it.
- **`serenity-snippets-extension.zip`**: the browser extension. Staff unzip it and follow "Install the extension" below.

## Two ways to use it

| | Browser extension (recommended) | Web page |
|---|---|---|
| Install | One-time install in Chrome or Edge | None. Just open `index.html`. |
| Open it | Click the toolbar icon, or press **Alt+Shift+S** on any page | Keep the page open in a tab |
| Click to copy, search, favorites, My Snippets | Yes | Yes |
| Keyboard shortcuts | **Type the snippet straight into the text box you're in** on any website (Axiscare, Gmail, Outlook, …) | Copy the snippet only while the Serenity Snippets tab is in front |

### Install the extension (Chrome or Microsoft Edge)

1. Save `serenity-snippets-extension.zip` and unzip it (right-click → Extract All). Keep the unzipped folder somewhere it won't be deleted, like Documents.
2. Open **chrome://extensions** (in Edge: **edge://extensions**).
3. Turn on **Developer mode** (top-right in Chrome, left side in Edge).
4. Click **Load unpacked** and choose the unzipped folder (the one containing `manifest.json`).
5. Click the puzzle-piece icon in the toolbar and **pin** Serenity Snippets.

To change the Alt+Shift+S "open" shortcut, go to **chrome://extensions/shortcuts**.

During install, Chrome will say the extension can "read and change your data on all websites." That access is what lets a shortcut type a snippet into whatever text box you're in. The extension makes no network requests, and your snippets never leave the computer.

### Use it as a web page

Double-click `Serenity Snippets.html` (or `index.html` in this folder) to open it in a browser. Bookmark it to make it easy to find again. Your snippets, favorites, and shortcuts are saved in that browser on that computer.

## Using keyboard shortcuts

1. Click the keyboard icon on any snippet.
2. Click the box and press a combination, such as **Alt+Shift+1** (Option+Shift+1 on Mac).
3. Click **Save**.
4. In Axiscare (or an email), click into the note box and press the shortcut. The snippet is typed where your cursor is. If no text box is selected, it is copied to the clipboard instead.

Shortcuts need Ctrl, Alt, or Cmd plus a letter or number, or an F-key on its own. The app warns you if a combination clashes with a common browser shortcut like Ctrl+C.

## Privacy note for staff

Built-in snippets use [brackets] for details you fill in after pasting. If you write your own snippets, keep client names and health details out of them. They are meant to be reusable, and backups can be shared.

## For whoever maintains this

- **Edit the built-in snippets** in `snippets.js`. Each snippet is `[title, text]` inside a category. Titles must be unique, because each snippet's ID comes from its title. Renaming a title resets favorites and shortcuts for that one snippet.
- No dependencies. It's plain HTML, CSS, and JavaScript; `build.js` only packages the files for sharing.
- Files: `index.html` / `app.js` / `styles.css` (the app), `shared.js` (storage, shortcuts, copy), `content.js` (types snippets into web pages; extension only), `manifest.json` (extension config).
- **Easier installs for staff:** publish to the Chrome Web Store as an *unlisted* item (one-time $5 developer fee). Staff then install with one click from a private link and get updates automatically. Upload `dist/serenity-snippets-extension.zip` from `node build.js`.
- After editing snippets or code, run `node build.js` again and re-share the new files.
- For a company-managed Google Workspace or Microsoft 365, IT can force-install the extension on every staff browser.
