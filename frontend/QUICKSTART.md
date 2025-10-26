# Quick Start Guide

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Features to Try

### 1. Browse Products
- Visit the home page to see the product grid
- Scroll down to trigger infinite scroll (loads 8 more products)
- **HOVER over a product card for 1+ second** to see the expansion animation (key feature!)

### 2. Login
- Go to `/login` or click the account icon
- Enter any email and password (demo mode)
- Example: email: `demo@test.com`, password: `password123`

### 3. Product Details
- Click on any product card to view details
- See image gallery with thumbnails
- Adjust quantity and add to cart
- View recommended products at the bottom

### 4. Shopping Cart
- Click the cart icon in the header
- Adjust quantities with +/- buttons
- Remove items with the X button
- See the order summary with tax calculation
- Click "Proceed to Checkout"

### 5. Favorites
- Click the heart icon on any product card
- View all favorites at `/favorites`
- Add to cart directly from favorites
- Remove items from favorites

### 6. Checkout
- Fill in shipping address (required fields marked with *)
- Choose payment method (Credit Card or PayPal - UI mockup)
- Review order summary
- Click "Place Order" to complete (clears cart and redirects to account)

### 7. Account Page
- View profile information
- Check order history (mock data)
- Navigate between tabs: Profile, Orders, Addresses, Settings
- Logout from the account menu

## Key Animations to Notice

1. **Product Card Hover Expansion** - Hover for 1 second on any product card
2. **Add to Cart Animation** - Button press has a scale effect
3. **Toast Notifications** - Appear in top-right for all actions
4. **Smooth Scrolling** - Custom scrollbar styling
5. **Loading States** - Skeleton screens during data loading
6. **Responsive Grid** - Resize browser to see 4→2→1 column layout

## Mock Data

The app uses 30 mock products with:
- Categories: Electronics, Clothing, Home & Garden, Books, Sports, Toys
- Ratings: 3.0 - 5.0 stars
- Prices: $10 - $210
- Reviews: 10 - 5000+ reviews

## State Management

All state is stored in localStorage:
- `cart` - Shopping cart items
- `favorites` - Favorite product IDs
- `authToken` - JWT token (mock)
- `user` - User data

Clear localStorage to reset the app state.

## Backend Integration

The app is ready for backend integration. Look for TODO comments in the code:

```typescript
// TODO: Replace with actual API call to [BACKEND_API_URL]/auth/login
```

API endpoints needed:
- `POST /auth/login` - Authentication
- `GET /products?page=1&limit=8` - Product list
- `GET /products/:id` - Product details
- `GET /products/:id/recommended` - Recommendations

Set the backend URL in environment variable:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Troubleshooting

**Build fails**: Make sure you're using Node.js 16+

**Styles not loading**: Clear `.next` cache and rebuild
```bash
rm -rf .next
npm run build
```

**Images not loading**: Check that you have internet connection (uses placehold.co)

## Project Structure

```
frontend/
├── pages/              # All pages (Next.js routing)
├── components/         # Reusable components
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── utils/              # Helper functions and mock data
└── styles/             # Global CSS with Tailwind
```

## Color Scheme

- **Header**: #131921 (Amazon navy)
- **Primary**: #FF9900 (Amazon orange)
- **Backgrounds**: White, light grays
- **Text**: Gray-900, Gray-700, Gray-600

Enjoy exploring the application!
