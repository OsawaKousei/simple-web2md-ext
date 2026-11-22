# Web to Markdown

For Safari macOS/iOS SSH builds, signing, upload, and notarization, see [SAFARI_BUILD.md](docs/SAFARI_BUILD.md) (Japanese).

_[日本語版はこちら / Japanese version](README.md)_

A browser extension that saves web pages as Markdown files. The Safari version supports Mac, iPhone, and iPad.

Learn more on the [product page](https://web2md.prj.kupac.co.jp/).

## 🌟 Features

- **One-Click Conversion**: Save current page as Markdown format by simply clicking the toolbar icon
- **High-Precision Extraction**: Accurately extract article content using Mozilla Readability
- **Automatic Download**: Automatically download converted Markdown files
- **Japanese Support**: Full support for Japanese content
- **Lightweight**: Simple and fast operation

## 📋 Environment

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari (macOS 13 or later, iOS / iPadOS 16 or later)

## 🚀 Installation

### Install from an official store

- **Google Chrome**: Open the [Chrome Web Store](https://chromewebstore.google.com/detail/web-to-markdown/kpobgdndklphhmkkjloefgmenidljpdh) and click "Add to Chrome".
- **Mozilla Firefox**: Open [Firefox Browser Add-ons](https://addons.mozilla.org/en-US/firefox/addon/web-to-markdown-extension/) and click "Add to Firefox".
- **Microsoft Edge**: Install from [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/web-to-markdown/fnadejhpnenfeejgcbfcoiepbiimpjon).
- **Safari (Mac / iPhone / iPad)**: Install the app from the [App Store](https://apps.apple.com/jp/app/web-to-markdown/id6828905022), then enable the Web to Markdown extension in Safari settings.

The same App Store listing provides the Safari app for Mac, iPhone, and iPad.

### Install manually

1. Download the ZIP for Chrome, Edge, or Firefox from [GitHub Releases](https://github.com/OsawaKousei/simple-web2md-ext/releases)

2. Extract the zip file

3. Load extension in your browser

**For Chrome/Edge:**

- Navigate to `chrome://extensions/` or `edge://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the extracted folder

**For Firefox:**

- Navigate to `about:debugging#/runtime/this-firefox`
- Click "Load Temporary Add-on"
- Select `manifest.json` in the extracted folder

### Install manually for Safari on Mac

- Download the DMG or app ZIP from [GitHub Releases](https://github.com/OsawaKousei/simple-web2md-ext/releases), then move the app to Applications
- Open the app, then enable Web to Markdown in Safari Settings → Extensions

## 📖 Usage

1. **Open a page**: Open the web page you want to save as Markdown
2. **Run the extension**: Use the toolbar icon or Safari's Extensions menu. If Safari asks for permission to access the site, allow it
3. **Auto-save**: A `.md` file named after the page title is saved on your device

## ❗ Limitations

- Some content may not be extracted from pages with heavy JavaScript dynamic content
- Does not work on special URLs like chrome:// or file://
- May not work on some websites due to Content Security Policy restrictions

## 🐛 Troubleshooting

### File not downloading

1. Check browser download settings
2. Verify popup blocker is not enabled
3. Check extension permissions

### Content not extracted correctly

1. Make sure the page is fully loaded before executing
2. For JavaScript-heavy sites, wait a moment and try again

## 📝 Development

For Mozilla source submission and reproducible build instructions, see [MOZILLA_REVIEW.md](docs/MOZILLA_REVIEW.md).

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/OsawaKousei/simple-web2md-ext.git
cd simple-web2md-ext

# Switch to the specified Node.js version
fnm use

# Install dependencies
npm install

# Create a file for the Chrome signing key path
cp .env.example .env

# Set CHROME_EXTENSION_PEM in .env to the absolute path of your PEM file

# Create distribution files for Chrome/Edge and Firefox
npm run build
```

ESLint, `npm audit`, and Prettier checks run before each browser build.
Run `npm run check` to check separately, or `npm run format:write` to apply formatting.

Output: `release/simple-web2md-ext-chrome.zip` and `release/simple-web2md-ext-firefox.zip`.
The Chrome build also creates `release/simple-web2md-ext-chrome.crx` using the key path from `.env`.
Git ignores `.env`. Keep the private key itself outside this repository.
Each ZIP contains the browser-specific `manifest.json` at its root.
To package one browser, run `npm run package:chrome` or `npm run package:firefox`.

Contact: **dev@kupac.co.jp**.

### Tech Stack

- **TypeScript**: Type-safe development
- **Webpack**: Bundling and build
- **Mozilla Readability**: Content extraction
- **Turndown**: HTML to Markdown conversion
- **WebExtension Polyfill**: Cross-browser compatibility

## 🙏 Acknowledgments

- [Mozilla Readability](https://github.com/mozilla/readability) - High-precision content extraction
- [Turndown](https://github.com/domchristie/turndown) - HTML to Markdown conversion
- [WebExtension Polyfill](https://github.com/mozilla/webextension-polyfill) - Cross-browser compatibility

---
