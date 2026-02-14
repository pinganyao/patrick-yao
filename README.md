# Patrick Yao — Personal website

Static personal site. Deploys to [yaopingan.com](https://yaopingan.com) via Vercel.

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. In [Vercel](https://vercel.com): New Project → Import the repo.
3. Set **Root Directory** to this folder if the repo root is above it (e.g. `patrick-yao`).
4. Deploy. Vercel runs `npm install` and `npm run thumbs` to generate gallery thumbnails.

No need to run anything locally before pushing. Thumbnails are built on Vercel.

## Local preview

- **Simple:** Open `index.html` in a browser. Use `about.html`, `works.html`, etc. (clean URLs like `/about` only work on Vercel.)
- **With thumbnails:** Run `npm install` then `npm run thumbs` so the gallery grid has images.
- **Like production:** `npx vercel dev` (clean URLs work locally).

## Tech

HTML, CSS, JS. No framework. Gallery images are resized at build time (Node + sharp).
