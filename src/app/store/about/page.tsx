'use client'

import { useEffect, useState } from 'react'
import { Store } from '@/types/store'
import Link from 'next/link'

export default function AboutPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedStore = localStorage.getItem('generatedStore')
    if (savedStore) {
      try {
        setStore(JSON.parse(savedStore))
      } catch (error) {
        console.error('Error loading store:', error)
      }
    }
    setLoading(false)
  }, [])

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
            <h2>No Store Found</h2>
            <p className="text-muted mb-4">Please create a store first from the manager dashboard.</p>
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
        .navbar-theme {
          background-color: var(--theme-primary) !important;
        }
      `}</style>

      <div className="theme-bg min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark navbar-theme">
          <div className="container">
            <Link href="/store" className="navbar-brand">
              {store.name}
            </Link>
            <div className="navbar-nav ms-auto">
              <Link href="/store" className="nav-link">Home</Link>
              <Link href="/store/about" className="nav-link active">About</Link>
              <Link href="/store/contact" className="nav-link">Contact</Link>
            </div>
          </div>
        </nav>

        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h1 className="display-4 theme-primary mb-4">About {store.name}</h1>
              
              <div className="card border-0 shadow-sm mb-5">
                <div className="card-body p-5">
                  <p className="lead theme-text mb-4">{store.aboutContent}</p>
                  
                  <div className="row mt-5">
                    <div className="col-md-6">
                      <h4 className="theme-primary mb-3">Our Mission</h4>
                      <p className="theme-text">
                        We are committed to providing exceptional products and services that exceed our customers' expectations. Quality, innovation, and customer satisfaction are at the heart of everything we do.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h4 className="theme-primary mb-3">Why Choose Us</h4>
                      <ul className="list-unstyled theme-text">
                        <li className="mb-2">✓ Carefully curated product selection</li>
                        <li className="mb-2">✓ Exceptional customer service</li>
                        <li className="mb-2">✓ Fast and reliable shipping</li>
                        <li className="mb-2">✓ 100% satisfaction guarantee</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/store" className="btn btn-theme btn-lg me-3">
                  Shop Now
                </Link>
                <Link href="/store/contact" className="btn btn-outline-secondary btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        <footer className="navbar-theme text-white py-4 mt-5">
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