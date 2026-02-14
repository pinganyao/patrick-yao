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

  // Remove existing thumbs from previous runs so only current gallery images have thumbs
  if (fs.existsSync(THUMBS_DIR)) {
    fs.readdirSync(THUMBS_DIR).forEach((f) => {
      const p = path.join(THUMBS_DIR, f);
      if (fs.statSync(p).isFile()) fs.unlinkSync(p);
    });
  }

  const files = fs.readdirSync(GALLERY_DIR).filter((f) => IMAGE_EXT.test(f) && !f.startsWith('.'));

  console.log(`Generating ${files.length} thumbnails in gallery/thumbs/ ...`);

  for (const file of files) {
    const srcPath = path.join(GALLERY_DIR, file);
    const ext = path.extname(file); // use actual extension so basename strips correctly (avoids .JPG → .JPG.jpg)
    const base = path.basename(file, ext);
    const destPath = path.join(THUMBS_DIR, base + '.jpg');

    try {
      await sharp(srcPath)
        .rotate() // Apply EXIF orientation so thumbs match how full-size displays
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
