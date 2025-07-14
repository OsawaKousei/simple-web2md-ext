import browser from "webextension-polyfill";
import { convertToMarkdown } from "./logic/markdown-converter";

// メッセージリスナーが重複しないようにフラグで管理
if (!(window as any).markdownConverterInitialized) {
  (window as any).markdownConverterInitialized = true;

  browser.runtime.onMessage.addListener((request: any) => {
    // メッセージのコマンドを確認
    if (request.command === "GET_MARKDOWN") {
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
