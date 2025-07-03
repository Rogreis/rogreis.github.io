import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  try {
    const files = await fs.readdir(__dirname); // current folder
    return {
      statusCode: 200,
      body: JSON.stringify(files),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error reading files: ${err}`,
    };
  }
};
