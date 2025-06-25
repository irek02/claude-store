'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { StoreGenerator } from '@/services/storeGenerator'
import { StoreManager } from '@/services/storeManager'
import { Store } from '@/types/store'

export default function Manager() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [storePrompt, setStorePrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [stores, setStores] = useState<Store[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Load all stores
    const allStores = StoreManager.getAllStores()
    setStores(allStores)
    
    // If no stores exist, show create form by default
    if (allStores.length === 0) {
      setShowCreateForm(true)
    }
  }, [])

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

  const handleGenerateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!storePrompt.trim()) {
      setError('Please enter a store description')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const store = await StoreGenerator.generateStore(storePrompt)
      StoreManager.saveStore(store)
      const updatedStores = StoreManager.getAllStores()
      setStores(updatedStores)
      setShowCreateForm(false)
      setStorePrompt('')
    } catch (error) {
      console.error('Error generating store:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      if (errorMessage.includes('OpenAI API key not configured')) {
        setError('OpenAI API key not configured. Using template-based generation as fallback.')
        // Still try to generate with fallback
        try {
          const store = await StoreGenerator.generateStore(storePrompt)
          StoreManager.saveStore(store)
          const updatedStores = StoreManager.getAllStores()
          setStores(updatedStores)
          setShowCreateForm(false)
          setStorePrompt('')
        } catch (fallbackError) {
          setError('Failed to generate store. Please try again.')
        }
      } else {
        setError('Error generating store. Please check your API key and try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteStore = (storeId: string) => {
    if (confirm('Are you sure you want to delete this store?')) {
      StoreManager.deleteStore(storeId)
      const updatedStores = StoreManager.getAllStores()
      setStores(updatedStores)
    }
  }

  const handleViewStore = (store: Store) => {
    const storeUrl = StoreManager.getStoreUrl(store)
    router.push(storeUrl)
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

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Stores</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              Create New Store
            </button>
          </div>

          {showCreateForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">Create New Store</h3>
                <p className="card-text text-muted mb-4">
                  Describe your store and we'll generate a complete online store with products, branding, and pages.
                </p>

                <div className="mb-4">
                  <h6 className="text-muted">Quick Start - Try These Examples:</h6>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm w-100 text-start"
                        onClick={() => setStorePrompt('A cozy coffee shop selling premium organic coffee beans and brewing equipment')}
                      >
                        ☕ Coffee Shop
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm w-100 text-start"
                        onClick={() => setStorePrompt('Modern tech store specializing in the latest gadgets and electronics')}
                      >
                        📱 Tech Store
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm w-100 text-start"
                        onClick={() => setStorePrompt('Trendy fashion boutique with stylish clothing and accessories')}
                      >
                        👗 Fashion Boutique
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm w-100 text-start"
                        onClick={() => setStorePrompt('Independent bookstore with curated books across all genres')}
                      >
                        📚 Bookstore
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm w-100 text-start"
                        onClick={() => setStorePrompt('Organic food market with fresh produce and gourmet items')}
                      >
                        🥬 Organic Market
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-sm w-100 text-start"
                        onClick={() => setStorePrompt('Home decor store with beautiful furniture and interior design items')}
                      >
                        🏠 Home Decor
                      </button>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleGenerateStore}>
                  <div className="mb-3">
                    <label htmlFor="storePrompt" className="form-label">
                      Store Description
                    </label>
                    <textarea
                      className="form-control"
                      id="storePrompt"
                      rows={4}
                      value={storePrompt}
                      onChange={(e) => setStorePrompt(e.target.value)}
                      placeholder="Describe your store... (e.g., 'A cozy coffee shop selling premium organic coffee beans and brewing equipment')"
                      disabled={isGenerating}
                    ></textarea>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Generating Store with AI...
                        </>
                      ) : (
                        'Generate Store'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCreateForm(false)
                        setStorePrompt('')
                        setError('')
                      }}
                      disabled={isGenerating}
                    >
                      Cancel
                    </button>
                  </div>
                  
                  {isGenerating && (
                    <div className="mt-3">
                      <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: '100%'}}></div>
                      </div>
                      <small className="text-muted">
                        Using OpenAI to generate store name, description, about page, and 15 unique products...
                      </small>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {stores.length === 0 && !showCreateForm ? (
            <div className="text-center py-5">
              <h4>No stores created yet</h4>
              <p className="text-muted">Create your first store to get started!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Store
              </button>
            </div>
          ) : (
            <div className="row">
              {stores.map((store) => (
                <div key={store.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{store.name}</h5>
                      <p className="card-text flex-grow-1">{store.description}</p>
                      <div className="mb-3">
                        <small className="text-muted">
                          <strong>Category:</strong> {store.category}<br/>
                          <strong>Products:</strong> {store.products.length}<br/>
                          <strong>Created:</strong> {new Date(store.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewStore(store)}
                        >
                          View Store
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => router.push(`/manager/products/${store.id}`)}
                        >
                          Manage Products
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}