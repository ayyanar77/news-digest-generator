import { ConfigService } from "./services/ConfigService";
import { NewsClient } from "./api/NewsClient";
import { HTMLBuilder } from "./builders/HTMLBuilder";
import { deduplicateArticles } from "./utils/deduplicate";
import { writeFile } from "./utils/fileWriter";
import { logger } from "./utils/logger";

async function main(): Promise<void> {
  try {
    logger.info("Starting Automated News Digest Generator...");

    const configService = ConfigService.getInstance();
    const config = configService.getConfig();

    logger.info(`Fetching headlines for ${config.categories.length} categories.`);

    const newsClient = new NewsClient(config);
    const htmlBuilder = new HTMLBuilder();
    const seenUrls = new Set<string>();

    htmlBuilder.addHeader("Daily News Digest");

    let totalArticles = 0;

    for (const category of config.categories) {
      logger.info(`Fetching ${category} news...`);

      const articles = await newsClient.fetchHeadlines(category);
      const uniqueArticles = deduplicateArticles(articles, seenUrls);

      totalArticles += uniqueArticles.length;

      logger.info(`${uniqueArticles.length} unique article(s) found for ${category}.`);

      htmlBuilder.addSection(category, uniqueArticles);
    }

    htmlBuilder.addFooter();

    const html = htmlBuilder.build();
    writeFile(config.outputFile, html);

    logger.success(`Digest generated successfully with ${totalArticles} unique articles.`);
    logger.success(`Output: ${config.outputFile}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error("An unknown error occurred.");
    }
    process.exitCode = 1;
  }
}

main();
