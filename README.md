# Product Filter (React + TypeScript + Vite)

A responsive catalog explorer that fetches live product data from [DummyJSON](https://dummyjson.com/products), displays it in a card grid, and lets you filter by search term, category, and price range. The UI keeps the original handcrafted look-and-feel but is wired up with Tailwind CSS so you can comfortably extend styling with utilities later.

## Features

- **Live data fetching** – products load on mount with graceful loading/error/empty states.
- **Composable filters** – search, category select, and min/max price inputs work together via memoized logic.
- **Product cards** – show thumbnail, title, brand, category, rating, and price with responsive layout.
- **Styling stack** – bespoke CSS theme plus Tailwind utilities for incremental enhancement.

## Prerequisites

- **Node.js** ≥ 20.19.0 (Vite warns if you use older versions; 20.18.1 works but is not officially supported).
- **npm** ≥ 10 (bundled with current Node releases).

## Setup & Installation

1. **Clone the repo**
   ```bash
   git clone <your-fork-or-clone-url> product-filter
   cd product-filter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```
   - Vite prints a local URL (default `http://localhost:5173`).
   - Hot Module Replacement shows edits immediately.

4. **Build for production**
   ```bash
   npm run build
   ```
   - Runs TypeScript project references and Vite’s production bundler.
   - Outputs static assets to `dist/`.

5. **Preview the production build (optional)**
   ```bash
   npm run preview
   ```

6. **Lint the project (optional)**
   ```bash
   npm run lint
   ```

## Project Structure

- `src/App.tsx` – data fetching, filter state, derived lists, and layout.
- `src/components/ProductCard.tsx` – UI for each product card.
- `src/App.css` – handcrafted layout/card/filter styling.
- `src/index.css` – Tailwind entry + shared base styles/background.
- `tailwind.config.js` & `postcss.config.js` – Tailwind tooling configuration.

## Environment Notes

- Calls the DummyJSON public API directly—no API key required.
- Ensure outbound HTTPS to `https://dummyjson.com` is allowed in your runtime.
- Upgrade Node to ≥20.19.0 to silence Vite’s engine warning.

## Extending the UI

- Tailwind utilities are ready to use; gradually replace bespoke classes if desired.
- Add new filters (brand, rating, etc.) by extending the `Product` type and `filteredProducts` memo.
- When adding static assets, place them in `public/` and reference using `/asset-name.ext`.
