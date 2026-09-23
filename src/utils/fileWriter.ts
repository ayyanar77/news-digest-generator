import fs from "fs";
import path from "path";

export function writeFile(outputPath: string, content: string): void {
  const absolutePath = path.resolve(outputPath);
  const directory = path.dirname(absolutePath);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(absolutePath, content, "utf-8");
}
