import fs from 'fs';
import path from 'path';

// Remove package-lock.json and yarn.lock if they exist
['package-lock.json', 'yarn.lock'].forEach(file => {
  try {
    fs.unlinkSync(path.join(process.cwd(), file));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Failed to remove ${file}:`, err.message);
    }
  }
});

// Check if run with pnpm
const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.startsWith('pnpm/')) {
  console.error('Use pnpm instead');
  process.exit(1);
}
