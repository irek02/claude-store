'use client'

import { useState, useEffect } from 'react'
import { getProductImageSrc, createProductPlaceholder } from '@/utils/imageUtils'

interface ProductImageProps {
  product: { name: string; imageUrl?: string }
  className?: string
  style?: React.CSSProperties
  alt?: string
}

export default function ProductImage({ product, className, style, alt }: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const customImageSrc = getProductImageSrc(product)
    if (customImageSrc) {
      setImageSrc(customImageSrc)
      setImageError(false)
    } else {
      // Generate placeholder
      const placeholder = createProductPlaceholder(product.name)
      setImageSrc(placeholder)
      setImageError(false)
    }
  }, [product.name, product.imageUrl])

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      // Generate placeholder as fallback
      const placeholder = createProductPlaceholder(product.name)
      setImageSrc(placeholder)
    }
  }

  if (!imageSrc) {
    // Loading state - show a simple gray placeholder
    return (
      <div 
        className={className}
        style={{
          ...style,
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d'
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      className={className}
      style={style}
      alt={alt || product.name}
      onError={handleImageError}
    />
  )
}