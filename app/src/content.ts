import browser from "webextension-polyfill";
import { convertToMarkdown } from "./logic/markdown-converter";
import { downloadFile } from "./logic/file-downloader";

// メッセージリスナーが重複しないようにフラグで管理
const converterWindow = window as Window & {
  markdownConverterInitialized?: boolean;
};

if (!converterWindow.markdownConverterInitialized) {
  converterWindow.markdownConverterInitialized = true;

  browser.runtime.onMessage.addListener((request: unknown) => {
    // メッセージのコマンドを確認
    if (
      typeof request === "object" &&
      request !== null &&
      "command" in request &&
      request.command === "SAVE_MARKDOWN"
    ) {
      // HTMLをMarkdownに変換（Readabilityを使用）
      const result = convertToMarkdown();

      if (result.markdown) {
        downloadFile(`${result.title}.md`, result.markdown);
      }

      return Promise.resolve(true);
    }
  });
}
