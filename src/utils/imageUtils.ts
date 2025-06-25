export function generatePlaceholderImage(text: string, width: number = 300, height: number = 300): string {
  // Create a canvas element
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Generate a consistent color based on the text
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const hue = Math.abs(hash) % 360
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, `hsl(${hue}, 60%, 75%)`)
  gradient.addColorStop(1, `hsl(${hue + 30}, 60%, 65%)`)
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Add text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Wrap text if too long
  const maxWidth = width - 40
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0]
  
  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const testLine = currentLine + ' ' + word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  lines.push(currentLine)
  
  // Draw lines
  const lineHeight = 20
  const startY = (height - (lines.length - 1) * lineHeight) / 2
  
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight)
  })
  
  // Return as data URL
  return canvas.toDataURL('image/png')
}

export function getProductImageSrc(product: { name: string; imageUrl?: string }): string {
  // If there's a custom image URL and it's not a placeholder, use it
  if (product.imageUrl && 
      !product.imageUrl.includes('via.placeholder.com') && 
      !product.imageUrl.includes('placeholder')) {
    return product.imageUrl
  }
  
  // Return null to indicate we should generate a placeholder
  return ''
}

export function createProductPlaceholder(productName: string): string {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    // Server-side: return empty string
    return ''
  }
  
  return generatePlaceholderImage(productName)
}