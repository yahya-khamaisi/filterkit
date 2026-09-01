# FilterKit

A fast, filterable product catalog built with React, TypeScript, Vite, and Tailwind CSS. Products load live from [DummyJSON](https://dummyjson.com/products) and can be searched, filtered, and sorted entirely client-side.

## Features

- **Live data** — products fetched on load with dedicated loading (skeleton grid), error, and empty states.
- **Instant filtering** — search by title, filter by category, and constrain by price range, all combined via memoized logic.
- **Sorting** — order results by price (low→high, high→low) or by rating.
- **Clean UI** — sticky filter bar, responsive card grid, subtle hover interactions, accessible labels and live regions.
- **Typed end-to-end** — strict TypeScript across components and data models.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for dev server and bundling
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [DummyJSON](https://dummyjson.com/) as the public product data source (no API key required)

## Getting started

### Prerequisites

- Node.js ≥ 20.19
- npm ≥ 10

### Install and run

```bash
git clone https://github.com/yahya-khamaisi/filterkit.git
cd filterkit
npm install
npm run dev
```

Vite will print a local URL (default `http://localhost:5173`) with hot module replacement enabled.

### Other scripts

```bash
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Project structure

```
src/
├── App.tsx                        # data fetching, filter/sort state, layout
├── components/
│   ├── ProductCard.tsx            # product card UI
│   └── ProductCardSkeleton.tsx    # loading placeholder
└── index.css                      # Tailwind entry + base styles
```

## Extending it

- Add new filters (brand, min rating, etc.) by extending the `Product` type and the `filteredProducts` memo in `src/App.tsx`.
- Swap the data source by changing the `fetch` call — the rest of the UI is data-source agnostic as long as the shape matches `Product`.
- Static assets go in `public/` and are referenced as `/asset-name.ext`.
