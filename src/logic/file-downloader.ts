import browser from "webextension-polyfill";

export async function downloadFile(
  filename: string,
  content: string
): Promise<void> {
  try {
    // ファイル名から不正な文字を除去（パス区切り文字も含む）
    const safeFilename = filename.replace(/[\\\/\?%*:|"<>]/g, "-");

    // Data URLを作成（Service Workerでも動作）
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    const dataUrl = `data:text/markdown;base64,${encodedContent}`;

    // ダウンロードを実行
    await browser.downloads.download({
      url: dataUrl,
      filename: safeFilename,
      saveAs: false,
    });
  } catch (error) {
    console.error("ファイルダウンロードエラー:", error);
    throw error;
  }
}
