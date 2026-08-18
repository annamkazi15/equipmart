import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatPrice } from '../data/format'
import { ExpandableText } from './ExpandableText'

export function ProductCard({ product }: { product: Product }) {
  const specs = product.cardFields.slice(0, 4)

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__img-wrap">
        <img src={product.images[0]} alt={product.itemName} loading="lazy" />
      </Link>

      <div className="product-card__body">
        <div className="product-card__main">
          <div className="product-card__title-row">
            <Link to={`/product/${product.id}`} className="product-card__name">
              {product.itemName}
            </Link>
            <div className="product-card__price product-card__price--inline">
              {formatPrice(product.price, product.listingType)}
            </div>
          </div>

          {specs.length > 0 && (
            <table className="specs-mini">
              <tbody>
                {specs.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <ExpandableText text={s.label} />
                    </td>
                    <td>
                      <ExpandableText text={s.value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="supplier-block">
            <div className="supplier-block__company">{product.company}</div>
            <div className="supplier-block__meta">
              {product.companyLocation} — {product.yearsInBusiness} yrs
            </div>
            <span className="trust-badge">{product.trustBadge}</span>
          </div>
        </div>

        <aside className="product-card__aside">
          <div className="product-card__price product-card__price--aside">
            {formatPrice(product.price, product.listingType)}
          </div>
          <div className="contact-plain">
            <div>
              <span className="contact-plain__label">Email</span>
              <a href={`mailto:${product.contact}`}>{product.contact}</a>
            </div>
            <div>
              <span className="contact-plain__label">Phone</span>
              <a href={`tel:${product.vendorContact.replace(/\s/g, '')}`}>
                {product.vendorContact}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
