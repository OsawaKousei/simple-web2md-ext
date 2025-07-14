import browser from "webextension-polyfill";

/**
 * サニタイズされたファイル名を生成
 */
function generateSafeFilename(title: string): string {
  // 基本的な文字の置換とクリーンアップ
  let safeName = title
    .replace(/[\\\/\?%*:|"<>]/g, "-") // 無効な文字を置換
    .replace(/\s+/g, "_") // スペースをアンダースコアに
    .replace(/[^\w\-_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "") // 英数字、日本語のみ許可
    .replace(/^\.+|\.+$/g, "") // 先頭・末尾のピリオドを除去
    .replace(/_{2,}/g, "_") // 連続するアンダースコアを一つに
    .replace(/\-{2,}/g, "-"); // 連続するハイフンを一つに

  // 長すぎる場合は切り詰め（Windows の制限を考慮）
  if (safeName.length > 100) {
    safeName = safeName.substring(0, 100);
  }

  // 空の場合はデフォルト名を使用
  if (!safeName) {
    safeName = "webpage";
  }

  return safeName;
}

/**
 * data URLをBlobに変換するヘルパー関数
 */
async function dataURLtoBlob(dataURL: string): Promise<Blob> {
  const res = await fetch(dataURL);
  const blob = await res.blob();
  return blob;
}

export async function downloadFile(
  filename: string,
  content: string
): Promise<void> {
  try {
    // ファイル名を安全に変換
    const baseName = filename.replace(/\.md$/, ""); // .md拡張子を一旦除去
    const safeFilename = generateSafeFilename(baseName) + ".md";

    // Data URLを作成
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(content);
    const binaryString = Array.from(uint8Array, (byte) =>
      String.fromCharCode(byte)
    ).join("");
    const encodedContent = btoa(binaryString);
    const dataUrl = `data:text/markdown;base64,${encodedContent}`;

    // URL.createObjectURLが使えるかチェック (Firefoxではtrue, ChromeのService Workerではfalse)
    if (typeof URL.createObjectURL === "function") {
      // Firefox向けの処理: data URLをBlobに変換してからblob URLを生成
      console.log("Firefox-style download: using Blob URL");
      const blob = await dataURLtoBlob(dataUrl);
      const blobUrl = URL.createObjectURL(blob);

      await browser.downloads.download({
        url: blobUrl,
        filename: safeFilename,
        saveAs: false,
      });
    } else {
      // Chrome (MV3) 向けの処理: data URLを直接ダウンロード
      console.log("Chrome-style download: using data: URL");
      await browser.downloads.download({
        url: dataUrl,
        filename: safeFilename,
        saveAs: false,
      });
    }
  } catch (error) {
    console.error("ファイルダウンロードエラー:", error);
    throw error;
  }
}
