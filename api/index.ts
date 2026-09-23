import { VercelRequest, VercelResponse } from "@vercel/node";
import { NewsClient } from "../src/api/NewsClient";
import { HTMLBuilder } from "../src/builders/HTMLBuilder";
import { deduplicateArticles } from "../src/utils/deduplicate";
import { AppConfig } from "../src/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const config: AppConfig = {
      apiKey: process.env.NEWS_API_KEY || "",
      categories: ["business", "technology", "sports", "health", "science"],
      outputFile: "",
      country: "us",
      pageSize: 10,
      timeoutMs: 10000
    };

    if (!config.apiKey) {
      res.status(500).send("<h1>Error: NEWS_API_KEY environment variable is not set.</h1>");
      return;
    }

    const newsClient = new NewsClient(config);
    const htmlBuilder = new HTMLBuilder();
    const seenUrls = new Set<string>();

    htmlBuilder.addHeader("Daily News Digest");

    for (const category of config.categories) {
      const articles = await newsClient.fetchHeadlines(category);
      const uniqueArticles = deduplicateArticles(articles, seenUrls);
      htmlBuilder.addSection(category, uniqueArticles);
    }

    htmlBuilder.addFooter();
    const html = htmlBuilder.build();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).send(`<h1>Error generating digest</h1><p>${message}</p>`);
  }
}
