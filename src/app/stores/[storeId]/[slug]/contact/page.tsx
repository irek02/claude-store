'use client'

import { useEffect, useState } from 'react'
import { Store } from '@/types/store'
import { StoreManager } from '@/services/storeManager'
import Link from 'next/link'

interface ContactPageProps {
  params: Promise<{ storeId: string; slug: string }>
}

export default function ContactPage({ params }: ContactPageProps) {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    params.then((resolvedParams) => {
      const storeData = StoreManager.getStore(resolvedParams.storeId)
      setStore(storeData)
      setLoading(false)
    })
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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

  const storeSlug = StoreManager.generateStoreSlug(store.name)

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
            <Link href={`/stores/${store.id}/${storeSlug}`} className="navbar-brand">
              {store.name}
            </Link>
            <div className="navbar-nav ms-auto">
              <Link href={`/stores/${store.id}/${storeSlug}`} className="nav-link">Home</Link>
              <Link href={`/stores/${store.id}/${storeSlug}/about`} className="nav-link">About</Link>
              <Link href={`/stores/${store.id}/${storeSlug}/contact`} className="nav-link active">Contact</Link>
            </div>
          </div>
        </nav>

        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h1 className="display-4 theme-primary mb-4">Contact Us</h1>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <h4 className="theme-primary mb-4">Get in Touch</h4>
                      
                      {submitMessage && (
                        <div className="alert alert-success">
                          {submitMessage}
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label theme-text">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label theme-text">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label theme-text">Message</label>
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows={4}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-theme" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <h4 className="theme-primary mb-4">Contact Information</h4>
                      
                      <div className="mb-4">
                        <h6 className="theme-secondary">Email</h6>
                        <p className="theme-text">{store.contactInfo.email}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="theme-secondary">Phone</h6>
                        <p className="theme-text">{store.contactInfo.phone}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="theme-secondary">Address</h6>
                        <p className="theme-text">{store.contactInfo.address}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h6 className="theme-secondary">Business Hours</h6>
                        <p className="theme-text">
                          Monday - Friday: 9:00 AM - 6:00 PM<br/>
                          Saturday: 10:00 AM - 4:00 PM<br/>
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-5">
                <Link href={`/stores/${store.id}/${storeSlug}`} className="btn btn-theme btn-lg">
                  Back to Store
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