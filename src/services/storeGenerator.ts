import { Store, Product, StoreTheme } from '@/types/store'
import { openaiService } from './openaiService'

export class StoreGenerator {
  static async generateStore(prompt: string): Promise<Store> {
    try {
      // Try to use OpenAI for content generation
      const aiContent = await openaiService.generateStoreContent(prompt)
      const storeType = this.extractStoreType(prompt)
      const theme = this.generateTheme(storeType, prompt)
      
      // Convert AI-generated products to our Product format
      const products: Product[] = aiContent.products.map(product => ({
        id: crypto.randomUUID(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: '', // No placeholder URL, will be generated client-side
        inStock: Math.random() > 0.1
      }))

      return {
        id: crypto.randomUUID(),
        name: aiContent.storeName,
        description: aiContent.storeDescription,
        category: storeType,
        theme,
        products,
        aboutContent: aiContent.aboutContent,
        contactInfo: {
          email: 'info@' + aiContent.storeName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 12345'
        },
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to generate store with AI, falling back to template:', error)
      
      // Fallback to template-based generation
      const storeType = this.extractStoreType(prompt)
      const theme = this.generateTheme(storeType, prompt)
      const products = this.generateProducts(storeType, prompt)
      
      return {
        id: crypto.randomUUID(),
        name: this.generateStoreName(storeType, prompt),
        description: this.generateStoreDescription(storeType, prompt),
        category: storeType,
        theme,
        products,
        aboutContent: this.generateAboutContent(storeType, prompt),
        contactInfo: {
          email: 'info@' + this.generateStoreName(storeType, prompt).toLowerCase().replace(/\s+/g, '') + '.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, City, State 12345'
        },
        createdAt: new Date().toISOString()
      }
    }
  }

  private static extractStoreType(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('coffee') || lowerPrompt.includes('cafe')) return 'coffee'
    if (lowerPrompt.includes('book') || lowerPrompt.includes('library')) return 'books'
    if (lowerPrompt.includes('clothing') || lowerPrompt.includes('fashion') || lowerPrompt.includes('apparel')) return 'clothing'
    if (lowerPrompt.includes('tech') || lowerPrompt.includes('electronic') || lowerPrompt.includes('gadget')) return 'electronics'
    if (lowerPrompt.includes('food') || lowerPrompt.includes('grocery') || lowerPrompt.includes('organic')) return 'food'
    if (lowerPrompt.includes('home') || lowerPrompt.includes('furniture') || lowerPrompt.includes('decor')) return 'home'
    if (lowerPrompt.includes('beauty') || lowerPrompt.includes('cosmetic') || lowerPrompt.includes('skincare')) return 'beauty'
    if (lowerPrompt.includes('sport') || lowerPrompt.includes('fitness') || lowerPrompt.includes('outdoor')) return 'sports'
    
    return 'general'
  }

  private static generateStoreName(storeType: string, prompt: string): string {
    const names = {
      coffee: ['Brew & Bean', 'Coffee Corner', 'Roasted Dreams', 'The Daily Grind', 'Bean There Coffee'],
      books: ['Page Turner Books', 'The Reading Nook', 'Literary Haven', 'Book Sanctuary', 'Chapter & Verse'],
      clothing: ['Style Studio', 'Fashion Forward', 'Wardrobe Essentials', 'Trendy Threads', 'Chic Boutique'],
      electronics: ['Tech Hub', 'Digital World', 'Gadget Galaxy', 'Electronic Essentials', 'Tech Trends'],
      food: ['Fresh Market', 'Gourmet Goods', 'Organic Harvest', 'Foodie Paradise', 'Farm to Table'],
      home: ['Home Haven', 'Cozy Corner', 'Interior Inspirations', 'House & Home', 'Living Spaces'],
      beauty: ['Beauty Bliss', 'Glow & Grace', 'Radiant Beauty', 'Pure Elegance', 'Beauty Boutique'],
      sports: ['Active Gear', 'Sports Central', 'Fitness First', 'Athletic Edge', 'Outdoor Adventures'],
      general: ['Premium Store', 'Quality Goods', 'The Marketplace', 'Elite Shop', 'Prime Products']
    }
    
    const storeNames = names[storeType as keyof typeof names] || names.general
    return storeNames[Math.floor(Math.random() * storeNames.length)]
  }

  private static generateStoreDescription(storeType: string, prompt: string): string {
    const descriptions = {
      coffee: 'Premium coffee beans and brewing equipment for the perfect cup every time.',
      books: 'Curated collection of books across all genres for every type of reader.',
      clothing: 'Stylish and comfortable clothing for modern fashion enthusiasts.',
      electronics: 'Latest technology and electronic devices for your digital lifestyle.',
      food: 'Fresh, organic, and gourmet food products for conscious consumers.',
      home: 'Beautiful home decor and furniture to create your perfect living space.',
      beauty: 'Premium beauty and skincare products for your self-care routine.',
      sports: 'High-quality sports and fitness equipment for active lifestyles.',
      general: 'Carefully selected products for discerning customers.'
    }
    
    return descriptions[storeType as keyof typeof descriptions] || descriptions.general
  }

  private static generateTheme(storeType: string, prompt: string): StoreTheme {
    const themes = {
      coffee: { primaryColor: '#8B4513', secondaryColor: '#D2691E', backgroundColor: '#FFF8DC', textColor: '#2F1B14', accentColor: '#CD853F' },
      books: { primaryColor: '#2F4F4F', secondaryColor: '#708090', backgroundColor: '#F5F5DC', textColor: '#2F4F4F', accentColor: '#8B4513' },
      clothing: { primaryColor: '#FF1493', secondaryColor: '#FFB6C1', backgroundColor: '#FFF0F5', textColor: '#2F2F2F', accentColor: '#FF69B4' },
      electronics: { primaryColor: '#4169E1', secondaryColor: '#87CEEB', backgroundColor: '#F0F8FF', textColor: '#2F2F2F', accentColor: '#1E90FF' },
      food: { primaryColor: '#228B22', secondaryColor: '#90EE90', backgroundColor: '#F0FFF0', textColor: '#2F2F2F', accentColor: '#32CD32' },
      home: { primaryColor: '#A0522D', secondaryColor: '#D2B48C', backgroundColor: '#FDF5E6', textColor: '#2F2F2F', accentColor: '#CD853F' },
      beauty: { primaryColor: '#DA70D6', secondaryColor: '#DDA0DD', backgroundColor: '#FFF0FF', textColor: '#2F2F2F', accentColor: '#FF69B4' },
      sports: { primaryColor: '#FF4500', secondaryColor: '#FF7F50', backgroundColor: '#FFF8DC', textColor: '#2F2F2F', accentColor: '#FF6347' },
      general: { primaryColor: '#4682B4', secondaryColor: '#87CEEB', backgroundColor: '#F8F8FF', textColor: '#2F2F2F', accentColor: '#5F9EA0' }
    }
    
    return themes[storeType as keyof typeof themes] || themes.general
  }

  private static generateProducts(storeType: string, prompt: string): Product[] {
    const productTemplates = {
      coffee: [
        { name: 'Ethiopian Single Origin', description: 'Rich, fruity coffee with notes of blueberry and chocolate', price: 24.99, category: 'Coffee Beans' },
        { name: 'Colombian Medium Roast', description: 'Smooth, balanced coffee with caramel undertones', price: 19.99, category: 'Coffee Beans' },
        { name: 'French Press', description: 'Classic 34oz French press for perfect coffee extraction', price: 39.99, category: 'Brewing Equipment' },
        { name: 'Pour Over Dripper', description: 'Ceramic dripper for precise pour-over brewing', price: 29.99, category: 'Brewing Equipment' },
        { name: 'Coffee Grinder', description: 'Burr grinder for consistent coffee grounds', price: 149.99, category: 'Brewing Equipment' },
        { name: 'Travel Mug', description: 'Insulated stainless steel travel mug', price: 24.99, category: 'Accessories' },
        { name: 'Espresso Blend', description: 'Bold espresso blend with crema-rich extraction', price: 22.99, category: 'Coffee Beans' },
        { name: 'Cold Brew Concentrate', description: 'Smooth cold brew concentrate, just add water', price: 14.99, category: 'Ready to Drink' },
        { name: 'Coffee Filters', description: 'Premium paper filters for drip coffee', price: 8.99, category: 'Accessories' },
        { name: 'Milk Frother', description: 'Electric milk frother for lattes and cappuccinos', price: 34.99, category: 'Accessories' },
        { name: 'Guatemalan Dark Roast', description: 'Full-bodied dark roast with smoky finish', price: 21.99, category: 'Coffee Beans' },
        { name: 'Coffee Scale', description: 'Digital scale for precise coffee measurements', price: 49.99, category: 'Brewing Equipment' },
        { name: 'Ceramic Mug Set', description: 'Set of 4 artisan ceramic coffee mugs', price: 36.99, category: 'Accessories' },
        { name: 'Decaf Brazil', description: 'Smooth decaffeinated coffee with chocolate notes', price: 18.99, category: 'Coffee Beans' },
        { name: 'Coffee Subscription Box', description: 'Monthly delivery of premium coffee beans', price: 29.99, category: 'Subscriptions' }
      ],
      books: [
        { name: 'The Art of Fiction', description: 'Masterclass in creative writing techniques', price: 16.99, category: 'Writing' },
        { name: 'Digital Marketing Guide', description: 'Complete guide to modern marketing strategies', price: 24.99, category: 'Business' },
        { name: 'Mindfulness Journal', description: 'Guided journal for daily mindfulness practice', price: 14.99, category: 'Self-Help' },
        { name: 'Classic Literature Set', description: 'Collection of 10 timeless literary classics', price: 89.99, category: 'Classics' },
        { name: 'Science Fiction Anthology', description: 'Award-winning sci-fi short stories', price: 19.99, category: 'Science Fiction' },
        { name: 'Cookbook Collection', description: 'International recipes from around the world', price: 32.99, category: 'Cooking' },
        { name: 'History of Art', description: 'Comprehensive guide to art movements and masters', price: 45.99, category: 'Art' },
        { name: 'Programming for Beginners', description: 'Learn to code with practical examples', price: 29.99, category: 'Technology' },
        { name: 'Mystery Novel Bundle', description: 'Thrilling mystery novels by bestselling authors', price: 24.99, category: 'Mystery' },
        { name: 'Travel Photography', description: 'Stunning photography from around the globe', price: 34.99, category: 'Photography' },
        { name: 'Philosophy Essentials', description: 'Introduction to fundamental philosophical concepts', price: 22.99, category: 'Philosophy' },
        { name: 'Gardening Handbook', description: 'Complete guide to home gardening', price: 18.99, category: 'Gardening' },
        { name: 'Biography Collection', description: 'Inspiring biographies of influential figures', price: 27.99, category: 'Biography' },
        { name: 'Poetry Anthology', description: 'Beautiful collection of contemporary poetry', price: 15.99, category: 'Poetry' },
        { name: 'Business Strategy Guide', description: 'Strategic thinking for modern business leaders', price: 31.99, category: 'Business' }
      ],
      general: [
        { name: 'Premium Product A', description: 'High-quality product with exceptional features', price: 49.99, category: 'Premium' },
        { name: 'Essential Item B', description: 'Must-have item for everyday use', price: 24.99, category: 'Essentials' },
        { name: 'Luxury Collection C', description: 'Exclusive luxury item with premium materials', price: 199.99, category: 'Luxury' },
        { name: 'Practical Solution D', description: 'Practical and efficient solution for daily needs', price: 34.99, category: 'Practical' },
        { name: 'Innovation E', description: 'Cutting-edge innovation with modern design', price: 79.99, category: 'Innovation' },
        { name: 'Classic Choice F', description: 'Timeless classic that never goes out of style', price: 44.99, category: 'Classic' },
        { name: 'Eco-Friendly G', description: 'Sustainable and environmentally conscious option', price: 29.99, category: 'Eco-Friendly' },
        { name: 'Professional H', description: 'Professional-grade quality for serious users', price: 149.99, category: 'Professional' },
        { name: 'Compact I', description: 'Space-saving compact design without compromise', price: 39.99, category: 'Compact' },
        { name: 'Versatile J', description: 'Multi-purpose item with various applications', price: 54.99, category: 'Versatile' },
        { name: 'Premium Bundle K', description: 'Complete bundle with everything you need', price: 99.99, category: 'Bundles' },
        { name: 'Limited Edition L', description: 'Exclusive limited edition with unique features', price: 89.99, category: 'Limited' },
        { name: 'Starter Kit M', description: 'Perfect starter kit for beginners', price: 19.99, category: 'Starter' },
        { name: 'Advanced N', description: 'Advanced features for experienced users', price: 129.99, category: 'Advanced' },
        { name: 'Value Pack O', description: 'Great value pack with multiple items', price: 64.99, category: 'Value' }
      ]
    }

    const templates = productTemplates[storeType as keyof typeof productTemplates] || productTemplates.general
    
    return templates.map((template, index) => ({
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      price: template.price,
      category: template.category,
      imageUrl: '', // No placeholder URL, will be generated client-side
      inStock: Math.random() > 0.1
    }))
  }

  private static generateAboutContent(storeType: string, prompt: string): string {
    const aboutTemplates = {
      coffee: 'Welcome to our coffee haven! We are passionate about bringing you the finest coffee beans from around the world. Our journey began with a simple mission: to share the perfect cup of coffee with fellow enthusiasts. From single-origin beans to expertly crafted blends, every product in our collection is chosen for its exceptional quality and unique character.',
      books: 'Our bookstore is a sanctuary for readers and knowledge seekers. We believe in the power of books to transform lives, spark imagination, and connect us to different worlds. Our carefully curated collection spans every genre and interest, from timeless classics to contemporary bestsellers, ensuring there is something special for every reader.',
      general: 'We are dedicated to providing exceptional products that enhance your daily life. Our commitment to quality, customer satisfaction, and innovation drives everything we do. Each item in our collection is carefully selected to meet the highest standards of excellence and value.'
    }

    return aboutTemplates[storeType as keyof typeof aboutTemplates] || aboutTemplates.general
  }
}