import browser from "webextension-polyfill";
import { convertToMarkdown } from "./logic/markdown-converter";

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
      request.command === "GET_MARKDOWN"
    ) {
      // HTMLをMarkdownに変換（Readabilityを使用）
      const result = convertToMarkdown();

      // ページタイトルと変換結果を非同期で返す
      return Promise.resolve({
        title: result.title,
        markdown: result.markdown,
      });
    }
  });
}
