import { deduplicateArticles, normalizeUrl } from "../src/utils/deduplicate";
import { Article } from "../src/types";

describe("normalizeUrl", () => {
  it("removes protocol differences and trailing slashes consistently", () => {
    expect(normalizeUrl("https://www.example.com/story/")).toBe(
      normalizeUrl("http://example.com/story")
    );
  });
});

describe("deduplicateArticles", () => {
  it("removes articles that share a normalized URL", () => {
    const seen = new Set<string>();
    const articles: Article[] = [
      { title: "A", url: "https://example.com/a", source: "X" },
      { title: "A duplicate", url: "https://www.example.com/a/", source: "Y" },
      { title: "B", url: "https://example.com/b", source: "X" }
    ];

    const result = deduplicateArticles(articles, seen);

    expect(result).toHaveLength(2);
    expect(result.map((a) => a.title)).toEqual(["A", "B"]);
  });

  it("keeps a running seenUrls set across multiple calls", () => {
    const seen = new Set<string>();
    deduplicateArticles(
      [{ title: "A", url: "https://example.com/a", source: "X" }],
      seen
    );

    const second = deduplicateArticles(
      [{ title: "A again", url: "https://example.com/a", source: "X" }],
      seen
    );

    expect(second).toHaveLength(0);
  });
});
