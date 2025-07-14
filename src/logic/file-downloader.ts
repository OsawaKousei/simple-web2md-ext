import browser from "webextension-polyfill";

export async function downloadFile(
  filename: string,
  content: string
): Promise<void> {
  try {
    // ファイル名から不正な文字を除去
    const safeFilename = filename.replace(/[\\?%*:|"<>]/g, "-");

    // BlobとしてMarkdownコンテンツを作成
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    // ダウンロードを実行
    await browser.downloads.download({
      url: url,
      filename: safeFilename,
      saveAs: false,
    });

    // メモリ解放
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("ファイルダウンロードエラー:", error);
    throw error;
  }
}
