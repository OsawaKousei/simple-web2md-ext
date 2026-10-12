/**
 * サニタイズされたファイル名を生成
 */
function generateSafeFilename(title: string): string {
  // 基本的な文字の置換とクリーンアップ
  let safeName = title
    .replace(/[\\?%*:|"<>]/g, "-") // 無効な文字を置換
    .replace(/\//g, "-")
    .replace(/\s+/g, "_") // スペースをアンダースコアに
    .replace(/[^\w\-_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "") // 英数字、日本語のみ許可
    .replace(/^\.+|\.+$/g, "") // 先頭・末尾のピリオドを除去
    .replace(/_{2,}/g, "_") // 連続するアンダースコアを一つに
    .replace(/-{2,}/g, "-"); // 連続するハイフンを一つに

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
 * コンテンツスクリプトからブラウザ標準のダウンロード機能で保存する
 */
export function downloadFile(filename: string, content: string): void {
  const baseName = filename.replace(/\.md$/, "");
  const safeFilename = generateSafeFilename(baseName) + ".md";
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = safeFilename;
  link.style.display = "none";

  try {
    (document.body ?? document.documentElement).appendChild(link);
    link.click();
  } finally {
    link.remove();
    // ダウンロード開始前に URL を無効化しないよう、後で解放する
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  }
}
