export const logger = {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  },
  success(message: string): void {
    console.log(`[SUCCESS] ${message}`);
  },
  warn(message: string): void {
    console.warn(`[WARNING] ${message}`);
  },
  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
};
