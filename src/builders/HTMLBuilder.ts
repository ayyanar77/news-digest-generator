import { Article } from "../types";

const CATEGORY_ICONS: Record<string, string> = {
  business: "💼",
  technology: "💻",
  sports: "🏆",
  health: "🩺",
  science: "🔬",
  entertainment: "🎬",
  general: "📰"
};

export class HTMLBuilder {
  private sections: string[] = [];
  private title = "News Digest";

  public addHeader(title: string): HTMLBuilder {
    this.title = title;
    return this;
  }

  public addSection(category: string, articles: Article[]): HTMLBuilder {
    const icon = CATEGORY_ICONS[category.toLowerCase()] || "📰";

    const cards =
      articles.length === 0
        ? `<p class="empty">No headlines available right now.</p>`
        : articles
            .map(
              (article) => `
      <article class="card">
        ${
          article.imageUrl
            ? `<div class="card-image" style="background-image:url('${this.escapeHtml(
                article.imageUrl
              )}')"></div>`
            : `<div class="card-image card-image--placeholder">${icon}</div>`
        }
        <div class="card-body">
          <h3><a href="${this.escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(
                article.title
              )}</a></h3>
          ${article.description ? `<p class="desc">${this.escapeHtml(article.description)}</p>` : ""}
          <div class="meta">
            <span class="source">${this.escapeHtml(article.source)}</span>
            ${article.publishedAt ? `<span class="dot">•</span><span class="time">${this.formatDate(article.publishedAt)}</span>` : ""}
          </div>
        </div>
      </article>`
            )
            .join("");

    this.sections.push(`
    <section class="category">
      <div class="category-header">
        <span class="category-icon">${icon}</span>
        <h2>${this.escapeHtml(category)}</h2>
        <span class="count">${articles.length} ${articles.length === 1 ? "story" : "stories"}</span>
      </div>
      <div class="card-grid">
        ${cards}
      </div>
    </section>`);

    return this;
  }

  public addFooter(): HTMLBuilder {
    // Footer content is rendered as part of build(); nothing to buffer here.
    return this;
  }

  public build(): string {
    const generatedOn = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short"
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${this.escapeHtml(this.title)}</title>
<style>
  :root {
    --bg: #f2f4f8;
    --card-bg: #ffffff;
    --text: #1a1d29;
    --muted: #6b7280;
    --accent: #6d5ef8;
    --accent-2: #ff6584;
    --border: #e6e8f0;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  .hero {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: white;
    padding: 56px 24px 64px;
    text-align: center;
  }

  .hero h1 {
    margin: 0 0 8px;
    font-size: 2.4rem;
    letter-spacing: -0.02em;
  }

  .hero p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }

  .container {
    max-width: 1100px;
    margin: -32px auto 0;
    padding: 0 20px 40px;
  }

  .category {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 10px 30px rgba(20, 20, 50, 0.06);
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }

  .category-header h2 {
    margin: 0;
    text-transform: capitalize;
    font-size: 1.3rem;
  }

  .category-icon { font-size: 1.5rem; }

  .count {
    margin-left: auto;
    font-size: 0.8rem;
    color: var(--muted);
    background: var(--bg);
    padding: 4px 10px;
    border-radius: 999px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .card {
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(20, 20, 50, 0.08);
  }

  .card-image {
    height: 140px;
    background-size: cover;
    background-position: center;
    background-color: #eceefc;
  }

  .card-image--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
  }

  .card-body {
    padding: 14px 16px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card-body h3 {
    margin: 0 0 8px;
    font-size: 1rem;
    line-height: 1.35;
  }

  .card-body h3 a {
    color: var(--text);
    text-decoration: none;
  }

  .card-body h3 a:hover { color: var(--accent); }

  .desc {
    margin: 0 0 10px;
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    margin-top: auto;
    font-size: 0.75rem;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .empty {
    color: var(--muted);
    font-style: italic;
  }

  footer {
    text-align: center;
    color: var(--muted);
    font-size: 0.8rem;
    padding: 24px;
  }

  @media (max-width: 480px) {
    .hero h1 { font-size: 1.8rem; }
  }
</style>
</head>
<body>

<div class="hero">
  <h1>${this.escapeHtml(this.title)}</h1>
  <p>Generated on ${this.escapeHtml(generatedOn)}</p>
</div>

<div class="container">
${this.sections.join("\n")}
</div>

<footer>
  Generated automatically by Automated News Digest Generator.
</footer>

</body>
</html>`;
  }

  private formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return iso;
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
