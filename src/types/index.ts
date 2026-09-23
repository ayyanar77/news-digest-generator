export interface Article {
  title: string;
  url: string;
  source: string;
  description?: string;
  imageUrl?: string;
  publishedAt?: string;
}

export interface NewsCategory {
  category: string;
  articles: Article[];
}

export interface AppConfig {
  apiKey: string;
  categories: string[];
  outputFile: string;
  country?: string;
  pageSize?: number;
  timeoutMs?: number;
}
