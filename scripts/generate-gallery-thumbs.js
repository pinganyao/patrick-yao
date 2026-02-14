/**
 * Generates thumbnails for the gallery. Run: npm run thumbs
 * - Reads images from gallery/
 * - Writes resized images to gallery/thumbs/ (max 720px width, JPEG quality 82)
 * - Grid shows thumbs; lightbox loads full-size on click
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const GALLERY_DIR = path.join(__dirname, '..', 'gallery');
const THUMBS_DIR = path.join(GALLERY_DIR, 'thumbs');
const MAX_WIDTH = 720;
const JPEG_QUALITY = 82;

const IMAGE_EXT = /\.(jpg|jpeg|png|webp)$/i;

async function main() {
  if (!fs.existsSync(GALLERY_DIR)) {
    console.error('Gallery folder not found:', GALLERY_DIR);
    process.exit(1);
  }

  fs.mkdirSync(THUMBS_DIR, { recursive: true });

  const files = fs.readdirSync(GALLERY_DIR).filter((f) => IMAGE_EXT.test(f) && !f.startsWith('.'));

  console.log(`Generating ${files.length} thumbnails in gallery/thumbs/ ...`);

  for (const file of files) {
    const srcPath = path.join(GALLERY_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, ext);
    const destPath = path.join(THUMBS_DIR, base + '.jpg');

    try {
      await sharp(srcPath)
        .resize(MAX_WIDTH, null, { withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY })
        .toFile(destPath);
      console.log('  ', file, '->', base + '.jpg');
    } catch (err) {
      console.error('  Failed:', file, err.message);
    }
  }

  console.log('Done. Thumbnails saved to gallery/thumbs/');
}

main();
