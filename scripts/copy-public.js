import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, '..', 'public');
const dest = path.join(__dirname, '..', '.output', 'public');

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

const copyDir = (src, dest) => {
  fs.readdirSync(src).forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

copyDir(src, dest);
console.log('Public files copied to .output/public');
