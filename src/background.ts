import browser from "webextension-polyfill";
import { downloadFile } from "./logic/file-downloader";

// メッセージレスポンスの型定義
interface MarkdownResponse {
  title: string;
  markdown: string;
}

// ツールバーアイコンがクリックされた時の処理
browser.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url) {
    console.error("アクティブなタブが見つかりません。");
    return;
  }

  try {
    // 1. Content Scriptを動的に注入
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    // 2. Content Scriptにメッセージを送信し、応答を待つ
    const response = (await browser.tabs.sendMessage(tab.id, {
      command: "GET_MARKDOWN",
    })) as MarkdownResponse;

    if (response && response.markdown) {
      // 3. 応答を受け取ったらダウンロード処理を実行
      const safeTitle = response.title.replace(/[\\?%*:|"<>]/g, "-");
      await downloadFile(`${safeTitle}.md`, response.markdown);
    }
  } catch (error) {
    // ページによってはスクリプトを注入できない場合のエラーハンドリング
    console.error("処理中にエラーが発生しました:", error);
    // ここでユーザーにエラー通知を行うことも可能 (例: browser.notifications.create)
  }
});
