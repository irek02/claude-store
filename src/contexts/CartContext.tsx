'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Cart, CartItem, Product } from '@/types/store'

interface CartContextType {
  cart: Cart
  addToCart: (product: Product, storeId: string, quantity?: number) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getCartForStore: (storeId: string) => CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; storeId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { cart: Cart } }

function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, storeId, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.storeId === storeId
      )

      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          product,
          quantity,
          storeId
        }
        newItems = [...state.items, newItem]
      }

      const { total, itemCount } = calculateCartTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.cartItemId)
      const { total, itemCount } = calculateCartTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter(item => item.id !== cartItemId)
        const { total, itemCount } = calculateCartTotals(newItems)
        return { items: newItems, total, itemCount }
      }

      const newItems = state.items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
      const { total, itemCount } = calculateCartTotals(newItems)
      return { items: newItems, total, itemCount }
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 }

    case 'LOAD_CART':
      return action.payload.cart

    default:
      return state
  }
}

const initialCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopping_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: { cart: parsedCart } })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  const addToCart = (product: Product, storeId: string, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, storeId, quantity } })
  }

  const removeFromCart = (cartItemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } })
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartForStore = (storeId: string): CartItem[] => {
    return cart.items.filter(item => item.storeId === storeId)
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartForStore
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}