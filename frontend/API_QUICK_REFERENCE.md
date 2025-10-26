# API Quick Reference Card

Quick reference for backend API integration. For detailed documentation, see [API_INTEGRATION.md](API_INTEGRATION.md).

## Configuration

```bash
# 1. Create .env.local file
cp .env.example .env.local

# 2. Set your backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local

# 3. Restart dev server
npm run dev
```

## API Endpoints

### 1. Login
```
POST /auth/login
Location: utils/api.ts:15
Used by: pages/login.tsx
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 2. Get Products (Paginated)
```
GET /products?page={page}&limit={limit}
Location: utils/api.ts:37
Used by: pages/index.tsx (infinite scroll)
```

**Request:**
```
GET /products?page=1&limit=8
```

**Response:**
```json
{
  "products": [
    {
      "id": "product-1",
      "title": "Product Name",
      "description": "Full description...",
      "shortDescription": "Brief desc",
      "price": 79.99,
      "images": ["url1", "url2", "url3", "url4"],
      "rating": 4.5,
      "reviewCount": 1234,
      "category": "Electronics",
      "inStock": true
    }
  ],
  "hasMore": true,
  "total": 30
}
```

---

### 3. Get Product Details
```
GET /products/{id}
Location: utils/api.ts:55
Used by: pages/product/[id].tsx
```

**Request:**
```
GET /products/product-1
```

**Response:**
```json
{
  "id": "product-1",
  "title": "Product Name",
  "description": "Full description...",
  "shortDescription": "Brief desc",
  "price": 79.99,
  "images": ["url1", "url2", "url3", "url4"],
  "rating": 4.5,
  "reviewCount": 1234,
  "category": "Electronics",
  "inStock": true
}
```

---

### 4. Get Recommended Products
```
GET /products/{id}/recommended
Location: utils/api.ts:70
Used by: pages/product/[id].tsx (bottom section)
```

**Request:**
```
GET /products/product-1/recommended
```

**Response:**
```json
[
  {
    "id": "product-5",
    "title": "Related Product",
    // ... same Product structure
  }
  // ... up to 6 products
]
```

---

## Implementation Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` in `.env.local`
- [ ] Replace `loginUser()` in `utils/api.ts:15`
- [ ] Replace `getProducts()` in `utils/api.ts:37`
- [ ] Replace `getProductById()` in `utils/api.ts:55`
- [ ] Replace `getRecommendedProducts()` in `utils/api.ts:70`
- [ ] Test login flow
- [ ] Test product listing and infinite scroll
- [ ] Test product detail page
- [ ] Test recommendations
- [ ] Configure CORS on backend

---

## Example Implementation

```typescript
// utils/api.ts

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// 1. Login
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

// 2. Get Products
export const getProducts = async (page = 1, limit = 8): Promise<ProductsResponse> => {
  const response = await fetch(`${BACKEND_API_URL}/products?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

// 3. Get Product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${BACKEND_API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
};

// 4. Get Recommendations
export const getRecommendedProducts = async (productId: string): Promise<Product[]> => {
  const response = await fetch(`${BACKEND_API_URL}/products/${productId}/recommended`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  return response.json();
};
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Configure backend CORS for `http://localhost:3000` |
| 404 errors | Verify backend routes match exactly |
| Env var not working | Restart dev server after changing `.env.local` |
| Token not sent | Add `Authorization: Bearer ${token}` header if needed |

---

## Testing URLs

```bash
# Local development
http://localhost:3000

# Test pages
http://localhost:3000/login              # Test login
http://localhost:3000                    # Test product list
http://localhost:3000/product/product-1  # Test product detail
```

---

## TypeScript Types

All types are in `types/` directory:

- **Product** - `types/product.ts`
- **User, AuthResponse** - `types/user.ts`
- **CartItem, Order** - `types/cart.ts`

---

## Need More Info?

See [API_INTEGRATION.md](API_INTEGRATION.md) for:
- Complete examples
- Error handling
- Step-by-step guide
- Troubleshooting
- Authorization headers
