# Web to Markdown

_[日本語版はこちら / Japanese version](README.md)_

A browser extension that saves web pages as Markdown format with just one click.

## 🌟 Features

- **One-Click Conversion**: Save current page as Markdown format by simply clicking the toolbar icon
- **High-Precision Extraction**: Accurately extract article content using Mozilla Readability
- **Automatic Download**: Automatically download converted Markdown files
- **Japanese Support**: Full support for Japanese content
- **Lightweight**: Simple and fast operation

## 📋 Requirements

- Google Chrome
- Microsoft Edge

## 🚀 Installation

1. Clone or download this repository

```bash
git clone https://github.com/OsawaKousei/simple-web2md-ext.git
cd simple-web2md-ext
```

2. Install dependencies

```bash
npm install
```

3. Build

```bash
npm run build
```

4. Load extension in Chrome/Edge
   - Navigate to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 📖 Usage

1. **Open a page**: Open the web page you want to save as Markdown
2. **Click extension**: Click the "Web to Markdown" icon in the toolbar
3. **Auto-save**: The page-title.md file will be saved to your downloads folder

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

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/OsawaKousei/simple-web2md-ext.git
cd simple-web2md-ext

# Install dependencies
npm install

# Production build
npm run build

# Create extension package
npm run package
```

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
