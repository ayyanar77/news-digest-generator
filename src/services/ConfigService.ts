import fs from "fs";
import path from "path";
import { AppConfig } from "../types";

export class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  // Private constructor -> nobody can do `new ConfigService()` from outside.
  private constructor() {
    const configPath = path.join(process.cwd(), "config.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(
        "config.json file not found. Copy config.json.example to config.json and add your API key."
      );
    }

    const fileContent = fs.readFileSync(configPath, "utf-8");
    this.config = JSON.parse(fileContent);

    this.validateConfig();
  }

  // The only way to get a ConfigService. First call creates it,
  // every later call returns the exact same object (Singleton pattern).
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private validateConfig(): void {
    if (!this.config.apiKey || this.config.apiKey === "YOUR_API_KEY") {
      throw new Error("A valid NewsAPI apiKey is required in config.json.");
    }

    if (
      !this.config.categories ||
      !Array.isArray(this.config.categories) ||
      this.config.categories.length === 0
    ) {
      throw new Error("At least one category is required in config.json.");
    }

    if (!this.config.outputFile) {
      throw new Error("outputFile path is required in config.json.");
    }
  }

  public getConfig(): AppConfig {
    return this.config;
  }
}
