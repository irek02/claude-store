'use client'

import { useEffect, useState } from 'react'
import { Store } from '@/types/store'
import { StoreManager } from '@/services/storeManager'
import ProductImage from '@/components/ProductImage'
import Link from 'next/link'

interface StorePageProps {
  params: Promise<{ storeId: string; slug: string }>
}

export default function StorePage({ params }: StorePageProps) {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [storeId, setStoreId] = useState<string>('')

  useEffect(() => {
    params.then((resolvedParams) => {
      setStoreId(resolvedParams.storeId)
      const storeData = StoreManager.getStore(resolvedParams.storeId)
      setStore(storeData)
      setLoading(false)
    })
  }, [params])

  if (loading) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center mt-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center mt-5">
            <h2>Store Not Found</h2>
            <p className="text-muted mb-4">The store you're looking for doesn't exist or has been removed.</p>
            <Link href="/login" className="btn btn-primary">
              Go to Manager Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const themeStyle = {
    '--theme-primary': store.theme.primaryColor,
    '--theme-secondary': store.theme.secondaryColor,
    '--theme-background': store.theme.backgroundColor,
    '--theme-text': store.theme.textColor,
    '--theme-accent': store.theme.accentColor,
  } as React.CSSProperties

  return (
    <div style={themeStyle}>
      <style jsx>{`
        .theme-bg { background-color: var(--theme-background); }
        .theme-primary { color: var(--theme-primary); }
        .theme-secondary { color: var(--theme-secondary); }
        .theme-text { color: var(--theme-text); }
        .theme-accent { color: var(--theme-accent); }
        .btn-theme { 
          background-color: var(--theme-primary); 
          border-color: var(--theme-primary); 
          color: white;
        }
        .btn-theme:hover { 
          background-color: var(--theme-accent); 
          border-color: var(--theme-accent); 
        }
        .card-theme {
          border-color: var(--theme-secondary);
        }
        .navbar-theme {
          background-color: var(--theme-primary) !important;
        }
        .hero-section {
          background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
          color: white;
          padding: 4rem 0;
        }
      `}</style>

      <div className="theme-bg min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark navbar-theme">
          <div className="container">
            <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}`} className="navbar-brand">
              {store.name}
            </Link>
            <div className="navbar-nav ms-auto">
              <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}`} className="nav-link">Home</Link>
              <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}/about`} className="nav-link">About</Link>
              <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}/contact`} className="nav-link">Contact</Link>
            </div>
          </div>
        </nav>

        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="display-4 fw-bold mb-4">{store.name}</h1>
                <p className="lead mb-4">{store.description}</p>
                <button className="btn btn-light btn-lg">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-5 theme-primary">Featured Products</h2>
            <div className="row">
              {store.products.slice(0, 8).map((product) => (
                <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                  <div className="card h-100 card-theme">
                    <ProductImage
                      product={product}
                      className="card-img-top" 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title theme-text">{product.name}</h5>
                      <p className="card-text text-muted flex-grow-1">{product.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 theme-primary mb-0">${product.price}</span>
                        <button className="btn btn-theme btn-sm">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}/products`} className="btn btn-theme">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        <footer className="navbar-theme text-white py-4">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h5>{store.name}</h5>
                <p>{store.description}</p>
              </div>
              <div className="col-md-6">
                <h5>Contact Info</h5>
                <p>
                  Email: {store.contactInfo.email}<br/>
                  Phone: {store.contactInfo.phone}<br/>
                  Address: {store.contactInfo.address}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}