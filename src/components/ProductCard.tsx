import type { Product } from '../App'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h2>{product.title}</h2>
        <p className="product-card__brand">{product.brand}</p>
        <div className="product-card__meta">
          <span className="product-card__price">
            {currencyFormatter.format(product.price)}
          </span>
          <span
            className="product-card__rating"
            aria-label={`Rating ${product.rating} out of 5`}
          >
            ⭐ {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  )
}

