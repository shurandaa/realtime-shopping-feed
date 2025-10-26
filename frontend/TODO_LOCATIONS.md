# TODO Locations for Backend Integration

This file lists all locations in the code where you need to replace mock implementations with real backend API calls.

## Quick Overview

**File to modify:** [`utils/api.ts`](utils/api.ts)

**Number of functions to replace:** 4

**Search string:** `TODO: Replace with actual API call`

---

## All TODO Locations

### 1. Login API

**Location:** [`utils/api.ts:13-31`](utils/api.ts#L13)

**Current code:**
```typescript
/**
 * Login API call
 * TODO: Replace with actual API call to [BACKEND_API_URL]/auth/login
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(800);

  // Mock authentication - accept any email/password
  if (credentials.email && credentials.password) {
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      },
    };
  }

  throw new Error('Invalid credentials');
};
```

**Replace with:**
```typescript
/**
 * Login API call
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};
```

---

### 2. Get Products API

**Location:** [`utils/api.ts:35-49`](utils/api.ts#L35)

**Current code:**
```typescript
/**
 * Get products with pagination
 * TODO: Replace with actual API call to [BACKEND_API_URL]/products?page={page}&limit={limit}
 */
export const getProducts = async (page: number = 1, limit: number = 8): Promise<ProductsResponse> => {
  await delay(500);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const products = mockProducts.slice(startIndex, endIndex);

  return {
    products,
    hasMore: endIndex < mockProducts.length,
    total: mockProducts.length,
  };
};
```

**Replace with:**
```typescript
/**
 * Get products with pagination
 */
export const getProducts = async (page: number = 1, limit: number = 8): Promise<ProductsResponse> => {
  const response = await fetch(
    `${BACKEND_API_URL}/products?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};
```

---

### 3. Get Product by ID API

**Location:** [`utils/api.ts:53-64`](utils/api.ts#L53)

**Current code:**
```typescript
/**
 * Get single product by ID
 * TODO: Replace with actual API call to [BACKEND_API_URL]/products/{id}
 */
export const getProductById = async (id: string): Promise<Product> => {
  await delay(400);

  const product = getMockProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};
```

**Replace with:**
```typescript
/**
 * Get single product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${BACKEND_API_URL}/products/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Failed to fetch product');
  }

  return response.json();
};
```

---

### 4. Get Recommended Products API

**Location:** [`utils/api.ts:68-74`](utils/api.ts#L68)

**Current code:**
```typescript
/**
 * Get recommended products for a product
 * TODO: Replace with actual API call to [BACKEND_API_URL]/products/{id}/recommended
 */
export const getRecommendedProducts = async (productId: string): Promise<Product[]> => {
  await delay(400);

  return getMockRecommendedProducts(productId, 6);
};
```

**Replace with:**
```typescript
/**
 * Get recommended products for a product
 */
export const getRecommendedProducts = async (productId: string): Promise<Product[]> => {
  const response = await fetch(
    `${BACKEND_API_URL}/products/${productId}/recommended`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }

  return response.json();
};
```

---

## After Replacing

Once you've replaced all 4 functions, you can optionally remove unused imports:

**Remove these if no longer needed:**
```typescript
import { mockProducts, getMockProductById, getMockRecommendedProducts } from './mockData';
```

**Keep this:**
```typescript
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

---

## Testing Each Function

### Test 1: loginUser()
```bash
# Test login at http://localhost:3000/login
# Check DevTools Network tab for POST to /auth/login
```

### Test 2: getProducts()
```bash
# Test at http://localhost:3000
# Check DevTools Network tab for GET to /products?page=1&limit=8
# Scroll to trigger page 2
```

### Test 3: getProductById()
```bash
# Click any product card
# Check DevTools Network tab for GET to /products/{id}
```

### Test 4: getRecommendedProducts()
```bash
# On product detail page, scroll to "Customers Also Bought"
# Check DevTools Network tab for GET to /products/{id}/recommended
```

---

## Additional Helper Functions (No Changes Needed)

These functions don't need modification - they work with localStorage only:

- `getAuthToken()` - Line 79
- `isAuthenticated()` - Line 87
- `logoutUser()` - Line 94

---

## Complete File After Changes

After replacing all 4 functions, your `utils/api.ts` should look like this:

```typescript
import { LoginCredentials, AuthResponse } from '@/types/user';
import { Product, ProductsResponse } from '@/types/product';

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
  if (!response.ok) {
    if (response.status === 404) throw new Error('Product not found');
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

// 4. Get Recommendations
export const getRecommendedProducts = async (productId: string): Promise<Product[]> => {
  const response = await fetch(`${BACKEND_API_URL}/products/${productId}/recommended`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  return response.json();
};

// Helper functions (no changes needed)
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};
```

---

## Quick Command to Find All TODOs

```bash
cd frontend
grep -n "TODO.*API" utils/api.ts
```

**Output:**
```
13: * TODO: Replace with actual API call to [BACKEND_API_URL]/auth/login
35: * TODO: Replace with actual API call to [BACKEND_API_URL]/products?page={page}&limit={limit}
53: * TODO: Replace with actual API call to [BACKEND_API_URL]/products/{id}
68: * TODO: Replace with actual API call to [BACKEND_API_URL]/products/{id}/recommended
```

---

## Summary Table

| Line | Function | Endpoint | Status |
|------|----------|----------|--------|
| 15-31 | `loginUser()` | POST /auth/login | ⏳ TODO |
| 37-49 | `getProducts()` | GET /products | ⏳ TODO |
| 55-64 | `getProductById()` | GET /products/:id | ⏳ TODO |
| 70-74 | `getRecommendedProducts()` | GET /products/:id/recommended | ⏳ TODO |

Update this table as you complete each integration:
- ⏳ TODO
- 🚧 In Progress
- ✅ Done

---

## Related Documentation

- [API_INTEGRATION.md](API_INTEGRATION.md) - Complete guide
- [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md) - Quick reference
- [API_FLOW_DIAGRAM.md](API_FLOW_DIAGRAM.md) - Visual diagrams
- [.env.example](.env.example) - Environment config

---

**Pro Tip:** Work through the functions in order (1 → 2 → 3 → 4) so you can test each feature as you go:
1. Login first (can't test other features without auth)
2. Product list (main page functionality)
3. Product detail (depends on working product list)
4. Recommendations (enhance product detail page)
