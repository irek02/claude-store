import OpenAI from 'openai'

class OpenAIService {
  private openai: OpenAI | null = null

  constructor() {
    // For client-side usage, we need NEXT_PUBLIC_ prefix
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    console.log('OpenAI API Key available:', !!apiKey)
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      })
    }
  }

  private isAvailable(): boolean {
    return this.openai !== null
  }

  async generateStoreContent(prompt: string): Promise<{
    storeName: string
    storeDescription: string
    aboutContent: string
    products: Array<{
      name: string
      description: string
      price: number
      category: string
    }>
  }> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that generates realistic store content based on user prompts. 
            You should respond with a JSON object containing:
            - storeName: A catchy store name
            - storeDescription: A brief store description (1-2 sentences)
            - aboutContent: A detailed about section (2-3 paragraphs)
            - products: Array of 15 products with name, description, price, and category
            
            Make sure all content is realistic and matches the store theme. Prices should be reasonable for the product type.
            Keep product descriptions concise but appealing (1-2 sentences).`
          },
          {
            role: 'user',
            content: `Generate store content for: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content generated from OpenAI')
      }

      try {
        return JSON.parse(content)
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content)
        throw new Error('Invalid response format from OpenAI')
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }

  async generateProductDetails(storeType: string, productName: string): Promise<{
    description: string
    price: number
    category: string
  }> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Generate realistic product details for a ${storeType} store. 
            Respond with JSON containing description (1-2 sentences), price (number), and category (string).
            Make prices reasonable for the product type.`
          },
          {
            role: 'user',
            content: `Product: ${productName}`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content generated from OpenAI')
      }

      return JSON.parse(content)
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }
}

export const openaiService = new OpenAIService()