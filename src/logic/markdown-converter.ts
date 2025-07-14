import TurndownService from "turndown";
import { Readability } from "@mozilla/readability";

interface ExtractedContent {
  title: string;
  content: string;
  markdown: string;
}

/**
 * Readabilityを使用してページから記事コンテンツを抽出し、Markdownに変換する
 */
export function convertToMarkdown(html?: string): ExtractedContent {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    fence: "```",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
    linkReferenceStyle: "full",
  });

  // 相対URLを絶対URLに変換するためのルール追加
  turndownService.addRule("links", {
    filter: "a",
    replacement: (content, node) => {
      const href = (node as HTMLAnchorElement).getAttribute("href");
      if (!href) return content;

      // 相対URLを絶対URLに変換
      const absoluteUrl = new URL(href, window.location.href).href;
      return `[${content}](${absoluteUrl})`;
    },
  });

  turndownService.addRule("images", {
    filter: "img",
    replacement: (content, node) => {
      const src = (node as HTMLImageElement).getAttribute("src");
      const alt = (node as HTMLImageElement).getAttribute("alt") || "";
      if (!src) return "";

      // 相対URLを絶対URLに変換
      const absoluteUrl = new URL(src, window.location.href).href;
      return `![${alt}](${absoluteUrl})`;
    },
  });

  try {
    // HTMLが提供されていない場合は現在のドキュメントを使用
    const sourceDocument = html
      ? new DOMParser().parseFromString(html, "text/html")
      : document;

    // Readabilityを使用して記事コンテンツを抽出
    const reader = new Readability(sourceDocument.cloneNode(true) as Document, {
      debug: false,
      maxElemsToParse: 0, // 制限なし
      nbTopCandidates: 5,
      charThreshold: 500,
      classesToPreserve: ["highlight", "code", "pre"],
    });

    const article = reader.parse();

    if (article && article.content) {
      // 抽出されたコンテンツをMarkdownに変換
      const markdown = turndownService.turndown(article.content);

      return {
        title: article.title || document.title || "Untitled",
        content: article.content,
        markdown: `# ${
          article.title || document.title || "Untitled"
        }\n\n${markdown}`,
      };
    } else {
      // Readabilityで抽出できない場合はフォールバック処理
      console.warn(
        "Readability failed to extract content, falling back to body content"
      );
      return fallbackExtraction(turndownService);
    }
  } catch (error) {
    console.error("Readability extraction failed:", error);
    return fallbackExtraction(turndownService);
  }
}

/**
 * Readabilityが失敗した場合のフォールバック処理
 */
function fallbackExtraction(
  turndownService: TurndownService
): ExtractedContent {
  // 不要な要素を除去
  const cleanHtml = document.body.innerHTML
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
    .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, "")
    .replace(
      /<div[^>]*class="[^"]*(?:sidebar|menu|navigation|advertisement|ads)[^"]*"[^>]*>.*?<\/div>/gi,
      ""
    );

  const markdown = turndownService.turndown(cleanHtml);

  return {
    title: document.title || "Untitled",
    content: cleanHtml,
    markdown: `# ${document.title || "Untitled"}\n\n${markdown}`,
  };
}
