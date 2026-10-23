// Deterministic vector tracing of the approved silhouette; no image generation.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const { trace } = require('potrace');

async function main() {
    const root = path.resolve(__dirname, '..');
    // Trace opacity rather than RGB so transparent interior details remain holes.
    const mask = await sharp(path.join(root, 'assets/patrick-performing.png'))
        .extractChannel('alpha').negate().png().toBuffer();
    const svg = await new Promise((resolve, reject) => {
        trace(mask, {
            threshold: 128,
            turdSize: 2,
            alphaMax: 1,
            optCurve: true,
            optTolerance: 0.15,
            color: '#000000',
            background: 'transparent',
        }, (error, result) => error ? reject(error) : resolve(result));
    });
    // Keep retracing separate from the hand-edited production SVG.
    const output = path.join(root, 'assets/artwork/patrick-performing-trace.svg');
    await fs.writeFile(output, svg);
    console.log(`Wrote ${output} (${Buffer.byteLength(svg)} bytes)`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
