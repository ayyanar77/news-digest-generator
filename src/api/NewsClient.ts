import axios from "axios";
import { Article, AppConfig } from "../types";

export class NewsClient {
  private readonly baseUrl = "https://newsapi.org/v2/top-headlines";

  constructor(private config: AppConfig) {}

  public async fetchHeadlines(category: string): Promise<Article[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          apiKey: this.config.apiKey,
          category,
          country: this.config.country || "us",
          pageSize: this.config.pageSize || 10
        },
        timeout: this.config.timeoutMs || 10000
      });

      return response.data.articles.map((article: any) => ({
        title: article.title || "Untitled",
        url: article.url,
        source: article.source?.name || "Unknown",
        description: article.description || "",
        imageUrl: article.urlToImage || undefined,
        publishedAt: article.publishedAt || undefined
      }));
    } catch (error) {
      console.error(`Failed to fetch "${category}" news.`, error instanceof Error ? error.message : error);
      return [];
    }
  }
}
