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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-50">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide text-slate-600 shadow-sm backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h2 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {product.title}
        </h2>
        <p className="text-xs text-slate-500">{product.brand}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-slate-900">
            {currencyFormatter.format(product.price)}
          </span>
          <span
            className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600"
            aria-label={`Rating ${product.rating} out of 5`}
          >
            <span aria-hidden="true">★</span>
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  )
}
