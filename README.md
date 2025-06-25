# Claude Store Generator

AI-powered online store generator that creates custom stores from user prompts.

## Features Roadmap

### Creating and managing stores

- The store manager must login first
- Main page where store manager enters the prompt to create a store
- The app builds the store with products (including 15 sample products), about and contact pages
- Store appearance (colors, branding) matches the prompt theme
- The store manager can manage products (add, edit, delete)

### Browsing and purchasing

- User can browse the generated store without logging in
- Basic shopping cart to add/remove products
- Simple checkout page (no payment processing)

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and add your OpenAI API key:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Run the development server: `npm run dev`

## Approach

- Build features incrementally one by one
- After coding up a feature execute `npm run build` to ensure no errors
- Wait for the engineer to confirm that the feature works as expected
- Commit and push updated code
- Continue to the next feature
