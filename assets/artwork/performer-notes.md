# Homepage performance artwork

Asset: `../patrick-performing.svg`

The homepage uses a deterministic Potrace SVG trace of the original approved PNG. Regenerate the unedited trace with `node scripts/trace-performer.js`; this writes `assets/artwork/patrick-performing-trace.svg` so it cannot overwrite the hand-edited production asset. The SVG contains paths only, no embedded bitmap. Shape overlap against the source alpha mask at 1024 × 1536 is 98.76% (intersection over union, threshold 128). The original PNG was AI-generated; vector tracing does not change that provenance. No new image generation was used for the SVG. The v2 correction is retained as an unused alternative.
Reference: `../gallery/DSC04632.JPG`
Created with the built-in imagegen tool. Transparent PNG, 1024 × 1536. CSS enforces pure black in light mode and pure white in dark mode while retaining transparency.

## Generation prompt

## Correction prompt (v2, built-in imagegen)

Use case: precise-object-edit. Image 1 is the existing transparent black silhouette artwork to edit; image 2 is the original performance photograph for strap anatomy reference only. Make exactly two local corrections to image 1 and preserve all other artwork, face, pose, clothing, guitar body, microphone, stand, cable, composition, dimensions and transparent negative spaces. (1) Remove the erroneous diagonal line that currently connects the microphone to the guitar neck. It is NOT a microphone boom. Replace it with a thin guitar strap that emerges from BEHIND the performer's shoulder near the base of the neck, travels toward the guitar, and ties at the nut where the headstock meets the fretboard (zero fret), just beyond the fretting hand. It must visibly originate at the shoulder, behind and separate from the microphone assembly; preserve the microphone on its vertical stand. Use the original photo to understand this old-fashioned headstock-tied strap. (2) Remove the capo-like protrusion at the very top end of the headstock and give the headstock a clean, conventional gently rounded acoustic-guitar top outline. Preserve all six tuning pegs and the rest of the neck. Output pure BLACK artwork on actual TRANSPARENT background, including all existing transparent interior cutouts. No white fill, no gray shading, no background, no other changes.

## Original generation prompt

Use case: style-transfer. Asset type: transparent monochrome silhouette for a personal website. Input image is the exact subject and pose reference. Extract the central man singing and playing acoustic guitar, including backward cap, exact head angle, hands, guitar shape and orientation, jeans, and microphone with stand. Preserve his actual silhouette and proportions faithfully. Remove all background, architecture, people and scenery. Create a sophisticated flat solid BLACK silhouette on genuinely transparent background, with sparse transparent negative-space cutouts defining guitar soundhole, arm against guitar, cap and facial profile so the performance remains legible. One ink color only: pure black; no gray shading, no photographic texture, no white filled areas. Include the visible body down to shoes, microphone stand, guitar cable if clean. Upright portrait composition tightly fitted around subject with small transparent margins. No text, no border, no backdrop. This should feel like an elegant screenprinted concert poster cutout of this specific photograph, not a generic guitarist.

## Direct SVG corrections

The production SVG has two local manual vector edits: a luminance mask removes the false diagonal microphone connection, with separate `guitar-strap` and `strap-tie` paths running from the shoulder to the nut; a short section of the headstock contour replaces the capo protrusion with a smooth top. The mask preserves transparency in both themes. No image generation was used. At native resolution, comparison against the pre-edit SVG found 4,110 changed alpha pixels inside the strap/headstock regions and zero changed pixels elsewhere.

## Checkerboard body strap (current)

Replaced the added headstock strap and tie with a conventional shoulder strap on the viewer-left side of the shirt. The checker pattern and thin edge details are hand-authored vector cutouts in the existing luminance mask, clipped where the strap passes behind the strumming arm. This supersedes the headstock-tied strap described above; the cleaned headstock contour remains. Transparency makes the checks adapt to both themes. Pixel comparison against the preceding SVG found 8,189 changed alpha pixels within the old/new strap regions and zero outside those regions.

### Anatomical side correction

Moved the checkerboard strap to the performer’s anatomical LEFT shoulder (viewer-right), beside the microphone stand and down to the guitar. Restored the viewer-left shirt area. Direct SVG edits only; pixel comparison confirms no changes outside the old and new shoulder-strap regions.

### Strap fit refinement

Straightened the anatomical-left strap, extended the checkers up to the sloping shoulder seam, and retained a narrow dark edge along that seam so the strap reads as continuing over the shoulder. The lower end still disappears behind the guitar. SVG-only edit; rendered comparison confirms no changed alpha pixels outside the strap region.

### Shoulder entry refinement

Adjusted the strap to a slight, controlled bend and cleared the old dark shoulder-seam segment beneath its top entry. The checker pattern now meets the shoulder silhouette directly without a separate black bar. SVG-only edit; alpha comparison found no changes outside the shoulder-entry area.

