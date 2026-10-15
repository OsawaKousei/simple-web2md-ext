import browser from "webextension-polyfill";

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

    // 2. Content Scriptで変換と保存を行う
    await browser.tabs.sendMessage(tab.id, { command: "SAVE_MARKDOWN" });
  } catch (error) {
    // ページによってはスクリプトを注入できない場合のエラーハンドリング
    console.error("処理中にエラーが発生しました:", error);
    // ここでユーザーにエラー通知を行うことも可能 (例: browser.notifications.create)
  }
});
