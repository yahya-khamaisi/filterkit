import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import { ProductCard } from './components/ProductCard'
import { ProductCardSkeleton } from './components/ProductCardSkeleton'

export type Product = {
  id: number
  title: string
  price: number
  brand: string
  category: string
  rating: number
  thumbnail: string
}

type ProductsResponse = {
  products: Product[]
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc'

const SORT_LABELS: Record<SortOption, string> = {
  default: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'rating-desc': 'Top Rated',
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 })
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=100')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: ProductsResponse = await response.json()

        if (isMounted) {
          const nextProducts = data.products ?? []
          const prices = nextProducts.map((product) => product.price)
          const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0
          const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0

          setProducts(nextProducts)
          setPriceBounds({ min: minPrice, max: maxPrice })
          setPriceRange({ min: minPrice, max: maxPrice })
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((product) => product.category)
    )
    return Array.from(uniqueCategories).sort()
  }, [products])

  const isFiltered =
    searchTerm.trim() !== '' ||
    selectedCategory !== '' ||
    priceRange.min !== priceBounds.min ||
    priceRange.max !== priceBounds.max

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()

    const result = products.filter((product) => {
      const matchesSearch = normalizedQuery
        ? product.title.toLowerCase().includes(normalizedQuery)
        : true
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max

      return matchesSearch && matchesCategory && matchesPrice
    })

    switch (sortOption) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price)
      case 'rating-desc':
        return [...result].sort((a, b) => b.rating - a.rating)
      default:
        return result
    }
  }, [products, searchTerm, selectedCategory, priceRange, sortOption])

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value)
    },
    []
  )

  const handleCategoryChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(event.target.value)
    },
    []
  )

  const handleSortChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setSortOption(event.target.value as SortOption)
    },
    []
  )

  const handlePriceChange = useCallback((key: 'min' | 'max', value: number) => {
    setPriceRange((prev) => {
      const next = {
        ...prev,
        [key]: Number.isNaN(value) ? prev[key] : value,
      }

      if (next.min > next.max) {
        if (key === 'min') {
          next.max = next.min
        } else {
          next.min = next.max
        }
      }

      next.min = Math.max(priceBounds.min, next.min)
      next.max = Math.min(priceBounds.max, next.max)

      return next
    })
  }, [priceBounds.max, priceBounds.min])

  const handleClearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedCategory('')
    setSortOption('default')
    setPriceRange(priceBounds)
  }, [priceBounds])

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Discover new arrivals
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            FilterKit
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            Browse the DummyJSON catalog and narrow it down by search,
            category, price, or rating — instantly, no reload needed.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20">
        <section
          aria-label="Product filters"
          className="sticky top-4 z-10 -mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-900/5 backdrop-blur sm:grid-cols-2 lg:grid-cols-5"
        >
          <label className="flex flex-col gap-1.5 lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Search
            </span>
            <input
              type="search"
              placeholder="Search by product title…"
              value={searchTerm}
              onChange={handleSearchChange}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Category
            </span>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sort by
            </span>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Price range
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                aria-label="Minimum price"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceRange.min}
                onChange={(event) =>
                  handlePriceChange('min', Number(event.target.value))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
              <span className="text-slate-300">–</span>
              <input
                type="number"
                aria-label="Maximum price"
                min={priceBounds.min}
                max={priceBounds.max}
                value={priceRange.max}
                onChange={(event) =>
                  handlePriceChange('max', Number(event.target.value))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {!loading && !error && (
              <>
                <span className="font-semibold text-slate-700">
                  {filteredProducts.length}
                </span>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'} found
              </>
            )}
          </p>
          {isFiltered && !loading && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
            <p className="font-medium">Failed to load products</p>
            <p className="mt-1 text-sm text-rose-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            <p className="text-lg font-medium text-slate-600">
              No products match your filters
            </p>
            <p className="mt-1 text-sm">Try widening your search or price range.</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <section
            aria-live="polite"
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
