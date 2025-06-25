'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { StoreManager } from '@/services/storeManager'
import { Store, Product } from '@/types/store'
import ProductImage from '@/components/ProductImage'
import Link from 'next/link'

interface ProductManagementProps {
  params: Promise<{ storeId: string }>
}

export default function ProductManagement({ params }: ProductManagementProps) {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    inStock: true
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    params.then((resolvedParams) => {
      const storeData = StoreManager.getStore(resolvedParams.storeId)
      setStore(storeData)
      setLoading(false)
    })
  }, [params])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      inStock: true
    })
    setEditingProduct(null)
    setShowAddForm(false)
    setError('')
    setSuccess('')
  }

  const clearForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      inStock: true
    })
    setError('')
    setSuccess('')
  }

  const handleAddProduct = () => {
    setShowAddForm(true)
    setEditingProduct(null)
    clearForm()
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock
    })
    setShowAddForm(true)
    setError('')
    setSuccess('')
  }

  const handleDeleteProduct = (productId: string) => {
    if (!store || !confirm('Are you sure you want to delete this product?')) return

    const updatedProducts = store.products.filter(p => p.id !== productId)
    const updatedStore = { ...store, products: updatedProducts }
    
    StoreManager.saveStore(updatedStore)
    setStore(updatedStore)
    setSuccess('Product deleted successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim() || !formData.description.trim() || !formData.price.trim() || !formData.category.trim()) {
      setError('Please fill in all required fields')
      return
    }

    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price')
      return
    }

    if (!store) return

    const productData = {
      id: editingProduct?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: price,
      category: formData.category.trim(),
      imageUrl: formData.imageUrl.trim() || '',
      inStock: formData.inStock
    }

    let updatedProducts
    if (editingProduct) {
      updatedProducts = store.products.map(p => p.id === editingProduct.id ? productData : p)
      setSuccess('Product updated successfully!')
    } else {
      updatedProducts = [...store.products, productData]
      setSuccess('Product added successfully!')
    }

    const updatedStore = { ...store, products: updatedProducts }
    StoreManager.saveStore(updatedStore)
    setStore(updatedStore)
    resetForm()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (isLoading || loading) {
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

  if (!store) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center mt-5">
            <h2>Store Not Found</h2>
            <p className="text-muted mb-4">The store you're trying to manage doesn't exist.</p>
            <Link href="/manager" className="btn btn-primary">
              Back to Manager Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
              <span className="navbar-brand">Product Management - {store.name}</span>
              <div className="d-flex gap-2">
                <Link href="/manager" className="btn btn-outline-secondary btn-sm">
                  Back to Stores
                </Link>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    logout()
                    router.push('/')
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Products ({store.products.length})</h2>
              <p className="text-muted">Manage products for {store.name}</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleAddProduct}
            >
              Add New Product
            </button>
          </div>

          {showAddForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h4>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Product Name *</label>
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
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="price" className="form-label">Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">Image URL (optional)</label>
                        <input
                          type="url"
                          className="form-control"
                          id="imageUrl"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inStock"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="inStock">
                        In Stock
                      </label>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row">
            {store.products.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h4>No products yet</h4>
                <p className="text-muted">Add your first product to get started!</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddProduct}
                >
                  Add First Product
                </button>
              </div>
            ) : (
              store.products.map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <ProductImage
                      product={product}
                      className="card-img-top" 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text flex-grow-1">{product.description}</p>
                      <div className="mb-3">
                        <small className="text-muted">
                          <strong>Category:</strong> {product.category}<br/>
                          <strong>Price:</strong> ${product.price}<br/>
                          <strong>Status:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </small>
                      </div>
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}