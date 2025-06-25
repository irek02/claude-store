'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import ProductImage from './ProductImage'

interface ShoppingCartProps {
  storeId?: string
  storeTheme?: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
}

export default function ShoppingCart({ storeId, storeTheme }: ShoppingCartProps) {
  const { cart, removeFromCart, updateQuantity, getCartForStore } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  // Get items for current store if storeId is provided, otherwise show all items
  const cartItems = storeId ? getCartForStore(storeId) : cart.items
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId)
    } else {
      updateQuantity(cartItemId, newQuantity)
    }
  }

  const themeStyle = storeTheme ? {
    '--theme-primary': storeTheme.primaryColor,
    '--theme-secondary': storeTheme.secondaryColor,
    '--theme-accent': storeTheme.accentColor,
  } as React.CSSProperties : {}

  return (
    <div style={themeStyle}>
      <style jsx>{`
        .btn-theme { 
          background-color: var(--theme-primary, #007bff); 
          border-color: var(--theme-primary, #007bff); 
          color: white;
        }
        .btn-theme:hover { 
          background-color: var(--theme-accent, #0056b3); 
          border-color: var(--theme-accent, #0056b3); 
        }
        .text-theme {
          color: var(--theme-primary, #007bff);
        }
        .cart-badge {
          background-color: var(--theme-accent, #dc3545);
        }
      `}</style>

      {/* Cart Icon Button */}
      <div className="position-relative">
        <button
          className="btn btn-outline-light position-relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          🛒
          {itemCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Cart Sidebar */}
          <div 
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
            style={{ width: '400px', zIndex: 1050, maxWidth: '90vw' }}
          >
            <div className="d-flex flex-column h-100">
              {/* Header */}
              <div className="p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Shopping Cart ({itemCount})</h5>
                  <button
                    className="btn-close"
                    onClick={() => setIsOpen(false)}
                  ></button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-grow-1 overflow-auto p-3">
                {cartItems.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="card">
                        <div className="card-body p-3">
                          <div className="row align-items-center">
                            <div className="col-3">
                              <ProductImage
                                product={item.product}
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            </div>
                            <div className="col-6">
                              <h6 className="mb-1">{item.product.name}</h6>
                              <small className="text-muted">${item.product.price}</small>
                            </div>
                            <div className="col-3">
                              <div className="d-flex flex-column align-items-center gap-2">
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  >
                                    −
                                  </button>
                                  <span className="btn btn-outline-secondary" style={{ pointerEvents: 'none' }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Total and Checkout */}
              {cartItems.length > 0 && (
                <div className="p-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong>Total: <span className="text-theme">${total.toFixed(2)}</span></strong>
                  </div>
                  <div className="d-grid">
                    <button className="btn btn-theme">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}