'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Manager() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
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

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
              <span className="navbar-brand">Store Manager</span>
              <button 
                className="btn btn-outline-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </nav>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Create Your Store</h2>
              <p className="card-text text-muted mb-4">
                Describe your store and we'll generate a complete online store with products, branding, and pages.
              </p>
              
              <form>
                <div className="mb-3">
                  <label htmlFor="storePrompt" className="form-label">
                    Store Description
                  </label>
                  <textarea
                    className="form-control"
                    id="storePrompt"
                    rows={4}
                    placeholder="Describe your store... (e.g., 'A cozy coffee shop selling premium organic coffee beans and brewing equipment')"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Generate Store
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}