import { HTMLBuilder } from "../src/builders/HTMLBuilder";
import { Article } from "../src/types";

describe("HTMLBuilder", () => {
  it("builds a full HTML document containing the title and articles", () => {
    const articles: Article[] = [
      { title: "Test <Story>", url: "https://example.com/1", source: "Example" }
    ];

    const html = new HTMLBuilder()
      .addHeader("My Digest")
      .addSection("technology", articles)
      .addFooter()
      .build();

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("My Digest");
    expect(html).toContain("Test &lt;Story&gt;"); // escaped, not raw
    expect(html).toContain("technology");
  });

  it("shows an empty-state message when a category has no articles", () => {
    const html = new HTMLBuilder()
      .addHeader("Empty Digest")
      .addSection("sports", [])
      .build();

    expect(html).toContain("No headlines available");
  });
});
