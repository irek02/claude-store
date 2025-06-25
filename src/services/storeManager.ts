import { Store } from '@/types/store'

export class StoreManager {
  private static STORES_KEY = 'claude_stores'

  static getAllStores(): Store[] {
    try {
      const storesJson = localStorage.getItem(this.STORES_KEY)
      return storesJson ? JSON.parse(storesJson) : []
    } catch (error) {
      console.error('Error loading stores:', error)
      return []
    }
  }

  static getStore(storeId: string): Store | null {
    const stores = this.getAllStores()
    return stores.find(store => store.id === storeId) || null
  }

  static saveStore(store: Store): void {
    const stores = this.getAllStores()
    const existingIndex = stores.findIndex(s => s.id === store.id)
    
    if (existingIndex >= 0) {
      stores[existingIndex] = store
    } else {
      stores.push(store)
    }
    
    localStorage.setItem(this.STORES_KEY, JSON.stringify(stores))
  }

  static deleteStore(storeId: string): void {
    const stores = this.getAllStores()
    const filteredStores = stores.filter(store => store.id !== storeId)
    localStorage.setItem(this.STORES_KEY, JSON.stringify(filteredStores))
  }

  static generateStoreSlug(storeName: string): string {
    return storeName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  static getStoreUrl(store: Store): string {
    const slug = this.generateStoreSlug(store.name)
    return `/stores/${store.id}/${slug}`
  }
}