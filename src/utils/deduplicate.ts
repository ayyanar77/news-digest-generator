import { Article } from "../types";

export function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
    const pathname = parsedUrl.pathname.replace(/\/$/, "");
    return `${hostname}${pathname}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function deduplicateArticles(
  articles: Article[],
  seenUrls: Set<string>
): Article[] {
  const uniqueArticles: Article[] = [];

  for (const article of articles) {
    const normalizedUrl = normalizeUrl(article.url);

    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      uniqueArticles.push(article);
    }
  }

  return uniqueArticles;
}
