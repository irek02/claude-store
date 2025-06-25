export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  inStock: boolean
}

export interface StoreTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}

export interface Store {
  id: string
  name: string
  description: string
  category: string
  theme: StoreTheme
  products: Product[]
  aboutContent: string
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  createdAt: string
}

export interface StoreGenerationRequest {
  prompt: string
}