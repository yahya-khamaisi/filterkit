import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import './App.css'
import { ProductCard } from './components/ProductCard'

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

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 })
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: ProductsResponse = await response.json()

        if (isMounted) {
          const nextProducts = data.products ?? []
          const prices = nextProducts.map((product) => product.price)
          const minPrice = prices.length ? Math.min(...prices) : 0
          const maxPrice = prices.length ? Math.max(...prices) : 0

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

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
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
  }, [products, searchTerm, selectedCategory, priceRange])

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

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <p className="eyebrow">Discover new arrivals</p>
          <h1>Product Catalog</h1>
          <p className="subtitle">
            Browse curated picks from the DummyJSON catalog and filter by what
            matters to you.
          </p>
        </div>
      </header>
      {!loading && !error && (
        <section className="filters" aria-label="Product filters">
          <label className="filter control">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search by product title"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>
          <label className="filter control">
            <span>Category</span>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <div className="filter filter--price">
            <span>Price range</span>
            <div className="filter__price-inputs">
              <label>
                Min
                <input
                  type="number"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceRange.min}
                  onChange={(event) =>
                    handlePriceChange('min', Number(event.target.value))
                  }
                />
              </label>
              <label>
                Max
                <input
                  type="number"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceRange.max}
                  onChange={(event) =>
                    handlePriceChange('max', Number(event.target.value))
                  }
                />
              </label>
            </div>
          </div>
        </section>
      )}
      {loading && (
        <div className="status status--loading">
          <span className="spinner" aria-hidden="true" />
          <p>Loading products…</p>
        </div>
      )}
      {error && (
        <div className="status status--error">
          <p>Failed to load products: {error}</p>
        </div>
      )}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="status status--muted">
          <p>No products match your filters. Try adjusting your search.</p>
        </div>
      )}
      {!loading && !error && filteredProducts.length > 0 && (
        <section className="products-grid" aria-live="polite">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  )
}

export default App
