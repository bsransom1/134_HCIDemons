# ZotSwap — UCI Campus Marketplace

Frontend-only React app: peer-to-peer listings for UCI students. Data is seeded in-memory (React Context); there is no backend.

## Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS v3
- Leaflet + react-leaflet (campus map)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

The app opens on the **Feed** as Jordan Chen (demo persona). Use the bottom nav for Map, Trades, Profile, and **Sell** to post a listing.

## Deploy on Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Import** the repository.
3. Use the defaults: **Framework Preset** Vite, **Build Command** `npm run build`, **Output Directory** `dist`.
4. Deploy. The `vercel.json` **rewrites** rule sends unmatched paths to `index.html` so React Router works on refresh (Vercel still serves `/assets/*` from the build first).

## License

Private project.
