'use client'

import { useEffect, useState } from 'react'
import { Store } from '@/types/store'
import { StoreManager } from '@/services/storeManager'
import { useCart } from '@/contexts/CartContext'
import ProductImage from '@/components/ProductImage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CheckoutPageProps {
  params: Promise<{ storeId: string; slug: string }>
}

interface CustomerInfo {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  zipCode: string
  country: string
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [storeId, setStoreId] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const { cart, getCartForStore, clearCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    params.then((resolvedParams) => {
      setStoreId(resolvedParams.storeId)
      const storeData = StoreManager.getStore(resolvedParams.storeId)
      setStore(storeData)
      setLoading(false)
    })
  }, [params])

  const cartItems = store ? getCartForStore(store.id) : []
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = cartItems.length > 0 ? 5.99 : 0
  const total = subtotal + tax + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setOrderComplete(true)
    setIsProcessing(false)
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart()
      router.push(`/stores/${store?.id}/${StoreManager.generateStoreSlug(store?.name || '')}`)
    }, 3000)
  }

  const isFormValid = () => {
    return customerInfo.email && customerInfo.firstName && customerInfo.lastName && 
           customerInfo.address && customerInfo.city && customerInfo.zipCode && 
           customerInfo.country && cartItems.length > 0
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

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center mt-5">
            <h2>Your Cart is Empty</h2>
            <p className="text-muted mb-4">Add some products to your cart before checking out.</p>
            <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}`} className="btn btn-primary">
              Continue Shopping
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

  if (orderComplete) {
    return (
      <div style={themeStyle}>
        <style jsx>{`
          .theme-bg { background-color: var(--theme-background); }
          .theme-primary { color: var(--theme-primary); }
          .theme-text { color: var(--theme-text); }
          .btn-theme { 
            background-color: var(--theme-primary); 
            border-color: var(--theme-primary); 
            color: white;
          }
          .navbar-theme {
            background-color: var(--theme-primary) !important;
          }
        `}</style>

        <div className="theme-bg min-vh-100">
          <nav className="navbar navbar-expand-lg navbar-dark navbar-theme">
            <div className="container">
              <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}`} className="navbar-brand">
                {store.name}
              </Link>
            </div>
          </nav>

          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center">
                <div className="mb-4">
                  <div className="display-1 text-success">✓</div>
                  <h2 className="theme-primary">Order Successful!</h2>
                  <p className="theme-text">Thank you for your purchase. Your order has been placed successfully.</p>
                  <div className="mt-4">
                    <p className="text-muted">Redirecting to store in 3 seconds...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={themeStyle}>
      <style jsx>{`
        .theme-bg { background-color: var(--theme-background); }
        .theme-primary { color: var(--theme-primary); }
        .theme-secondary { color: var(--theme-secondary); }
        .theme-text { color: var(--theme-text); }
        .btn-theme { 
          background-color: var(--theme-primary); 
          border-color: var(--theme-primary); 
          color: white;
        }
        .btn-theme:hover { 
          background-color: var(--theme-accent); 
          border-color: var(--theme-accent); 
        }
        .btn-theme:disabled {
          background-color: #6c757d;
          border-color: #6c757d;
        }
        .navbar-theme {
          background-color: var(--theme-primary) !important;
        }
        .form-control:focus {
          border-color: var(--theme-primary);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
      `}</style>

      <div className="theme-bg min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark navbar-theme">
          <div className="container">
            <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}`} className="navbar-brand">
              {store.name}
            </Link>
            <div className="navbar-nav ms-auto">
              <Link href={`/stores/${store.id}/${StoreManager.generateStoreSlug(store.name)}`} className="nav-link">
                ← Back to Store
              </Link>
            </div>
          </div>
        </nav>

        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h2 className="theme-primary mb-4">Checkout</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Customer Information</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="city" className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          value={customerInfo.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="zipCode"
                          name="zipCode"
                          value={customerInfo.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="country" className="form-label">Country *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          value={customerInfo.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="btn btn-theme btn-lg w-100"
                        disabled={!isFormValid() || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing Order...
                          </>
                        ) : (
                          `Place Order - $${total.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="d-flex align-items-center mb-3">
                        <ProductImage
                          product={item.product}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded me-3"
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{item.product.name}</h6>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>
                        <span className="fw-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span className="theme-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="alert alert-info">
                  <small>
                    <strong>Note:</strong> This is a demo checkout. No actual payment will be processed.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}