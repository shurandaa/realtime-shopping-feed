# Backend API Integration Guide

This document provides complete instructions for connecting the frontend to your backend API.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration](#configuration)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Step-by-Step Integration](#step-by-step-integration)
5. [TypeScript Interfaces](#typescript-interfaces)
6. [Testing Your Integration](#testing-your-integration)
7. [Error Handling](#error-handling)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Set the Backend URL

Create a `.env.local` file in the `frontend/` directory:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Replace Mock Functions

All API functions are in: **[`utils/api.ts`](utils/api.ts)**

Search for `TODO: Replace with actual API call` comments and replace mock implementations with real API calls.

### 3. Restart the Development Server

```bash
npm run dev
```

---

## Configuration

### Environment Variable

The backend URL is configured via an environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**Current code location:** [`utils/api.ts:6`](utils/api.ts#L6)

```typescript
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

### Default Value

If `NEXT_PUBLIC_API_URL` is not set, it defaults to `http://localhost:8080/api`

### Multiple Environments

You can create different `.env` files:

- `.env.local` - Local development
- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

---

## API Endpoints Reference

The frontend requires **4 API endpoints**. All mock implementations are in **[`utils/api.ts`](utils/api.ts)**.

### 1. User Login (Authentication)

**Endpoint:** `POST /auth/login`

**Function:** `loginUser(credentials: LoginCredentials)`

**Location:** [`utils/api.ts:15-31`](utils/api.ts#L15)

**Used by:**
- [`pages/login.tsx:28`](pages/login.tsx#L28) - Login page form submission

**Request:**

```typescript
// Type: LoginCredentials
{
  email: string;      // User's email address
  password: string;   // User's password
}
```

**Response:**

```typescript
// Type: AuthResponse
{
  token: string;      // JWT authentication token
  user: {
    id: string;       // User ID
    email: string;    // User's email
    name: string;     // User's display name
  }
}
```

**Example Request:**

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Example Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Example Implementation:**

```typescript
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

### 2. Get Products (Paginated List)

**Endpoint:** `GET /products?page={page}&limit={limit}`

**Function:** `getProducts(page: number, limit: number)`

**Location:** [`utils/api.ts:37-49`](utils/api.ts#L37)

**Used by:**
- [`pages/index.tsx:38`](pages/index.tsx#L38) - Main products page with infinite scroll

**Query Parameters:**

| Parameter | Type   | Required | Description                    | Default |
|-----------|--------|----------|--------------------------------|---------|
| `page`    | number | Yes      | Page number (1-indexed)        | 1       |
| `limit`   | number | Yes      | Number of products per page    | 8       |

**Response:**

```typescript
// Type: ProductsResponse
{
  products: Product[];  // Array of product objects (see Product interface below)
  hasMore: boolean;     // True if more products available
  total: number;        // Total number of products
}
```

**Example Request:**

```http
GET http://localhost:8080/api/products?page=1&limit=8
```

**Example Response:**

```json
{
  "products": [
    {
      "id": "product-1",
      "title": "Wireless Bluetooth Headphones",
      "description": "High-quality wireless headphones with noise cancellation...",
      "shortDescription": "Premium wireless headphones with great sound quality",
      "price": 79.99,
      "images": [
        "https://example.com/images/product-1-main.jpg",
        "https://example.com/images/product-1-alt1.jpg",
        "https://example.com/images/product-1-alt2.jpg",
        "https://example.com/images/product-1-alt3.jpg"
      ],
      "rating": 4.5,
      "reviewCount": 1234,
      "category": "Electronics",
      "inStock": true
    }
    // ... more products
  ],
  "hasMore": true,
  "total": 30
}
```

**Example Implementation:**

```typescript
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

**Note on Infinite Scroll:**
- The main page calls this with `page=1, limit=8` initially
- As user scrolls, it increments the page number
- Stops loading when `hasMore` is `false`

---

### 3. Get Product Details

**Endpoint:** `GET /products/{id}`

**Function:** `getProductById(id: string)`

**Location:** [`utils/api.ts:55-64`](utils/api.ts#L55)

**Used by:**
- [`pages/product/[id].tsx:33`](pages/product/[id].tsx#L33) - Product detail page

**URL Parameters:**

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| `id`      | string | Yes      | Unique product ID     |

**Response:**

```typescript
// Type: Product
{
  id: string;
  title: string;
  description: string;         // Full product description
  shortDescription: string;    // Brief description for cards
  price: number;
  images: string[];            // Array of image URLs (at least 1, recommend 4)
  rating: number;              // 0-5 star rating
  reviewCount: number;         // Number of reviews
  category: string;
  inStock: boolean;
}
```

**Example Request:**

```http
GET http://localhost:8080/api/products/product-1
```

**Example Response:**

```json
{
  "id": "product-1",
  "title": "Wireless Bluetooth Headphones with Noise Cancellation",
  "description": "Experience premium audio quality with our wireless Bluetooth headphones. Features active noise cancellation, 30-hour battery life, comfortable over-ear design, and premium sound quality. Perfect for travel, work, or leisure.",
  "shortDescription": "Premium wireless headphones with noise cancellation and 30hr battery",
  "price": 79.99,
  "images": [
    "https://example.com/images/product-1-main.jpg",
    "https://example.com/images/product-1-side.jpg",
    "https://example.com/images/product-1-detail.jpg",
    "https://example.com/images/product-1-package.jpg"
  ],
  "rating": 4.5,
  "reviewCount": 1234,
  "category": "Electronics",
  "inStock": true
}
```

**Example Implementation:**

```typescript
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

### 4. Get Recommended Products

**Endpoint:** `GET /products/{id}/recommended`

**Function:** `getRecommendedProducts(productId: string)`

**Location:** [`utils/api.ts:70-74`](utils/api.ts#L70)

**Used by:**
- [`pages/product/[id].tsx:34`](pages/product/[id].tsx#L34) - "Customers Also Bought" section

**URL Parameters:**

| Parameter | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `id`      | string | Yes      | Product ID to get recommendations  |

**Query Parameters (Optional):**

| Parameter | Type   | Required | Description                    | Default |
|-----------|--------|----------|--------------------------------|---------|
| `limit`   | number | No       | Number of recommendations      | 6       |

**Response:**

```typescript
// Type: Product[] (array of Product objects)
[
  {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    price: number;
    images: string[];
    rating: number;
    reviewCount: number;
    category: string;
    inStock: boolean;
  }
  // ... up to 6 products
]
```

**Example Request:**

```http
GET http://localhost:8080/api/products/product-1/recommended
```

**Example Response:**

```json
[
  {
    "id": "product-5",
    "title": "Wireless Mouse",
    "description": "Ergonomic wireless mouse...",
    "shortDescription": "Comfortable wireless mouse",
    "price": 29.99,
    "images": ["https://example.com/mouse.jpg"],
    "rating": 4.3,
    "reviewCount": 567,
    "category": "Electronics",
    "inStock": true
  }
  // ... 5 more products
]
```

**Example Implementation:**

```typescript
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

## Step-by-Step Integration

### Step 1: Set Up Environment

1. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit with your backend URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

### Step 2: Replace Login API

**File:** [`utils/api.ts`](utils/api.ts)

**Find:** Lines 15-31 (loginUser function)

**Replace with:**

```typescript
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};
```

### Step 3: Replace Products List API

**File:** [`utils/api.ts`](utils/api.ts)

**Find:** Lines 37-49 (getProducts function)

**Replace with:**

```typescript
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

### Step 4: Replace Product Details API

**File:** [`utils/api.ts`](utils/api.ts)

**Find:** Lines 55-64 (getProductById function)

**Replace with:**

```typescript
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

### Step 5: Replace Recommendations API

**File:** [`utils/api.ts`](utils/api.ts)

**Find:** Lines 70-74 (getRecommendedProducts function)

**Replace with:**

```typescript
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

### Step 6: Test Each Endpoint

See [Testing Your Integration](#testing-your-integration) section below.

---

## TypeScript Interfaces

All TypeScript interfaces are defined in the `types/` directory.

### Product Interface

**File:** [`types/product.ts`](types/product.ts)

```typescript
export interface Product {
  id: string;                  // Unique identifier
  title: string;               // Product name
  description: string;         // Full description (shown on detail page)
  shortDescription: string;    // Brief description (shown on cards)
  price: number;               // Price in USD
  images: string[];            // Array of image URLs (4 recommended)
  rating: number;              // Star rating (0-5)
  reviewCount: number;         // Number of customer reviews
  category: string;            // Product category
  inStock: boolean;            // Stock availability
}

export interface ProductsResponse {
  products: Product[];         // Array of products
  hasMore: boolean;            // True if more pages available
  total: number;               // Total product count
}
```

### User/Auth Interfaces

**File:** [`types/user.ts`](types/user.ts)

```typescript
export interface User {
  id: string;                  // Unique user identifier
  email: string;               // User's email address
  name: string;                // User's display name
}

export interface AuthResponse {
  token: string;               // JWT authentication token
  user: User;                  // User object
}

export interface LoginCredentials {
  email: string;               // Email for login
  password: string;            // Password for login
}
```

### Cart/Order Interfaces

**File:** [`types/cart.ts`](types/cart.ts)

```typescript
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;                // ISO date string
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

---

## Testing Your Integration

### 1. Test Login Endpoint

**Page:** http://localhost:3000/login

**Steps:**
1. Open login page
2. Enter email and password
3. Click "Login" button
4. Check browser DevTools Network tab for POST to `/auth/login`
5. Should receive token and redirect to home page

**Success Criteria:**
- Network request shows 200 OK
- Token stored in localStorage as 'authToken'
- User data stored in localStorage as 'user'
- Redirected to home page
- Header shows user email in account dropdown

### 2. Test Products List Endpoint

**Page:** http://localhost:3000

**Steps:**
1. Open main page
2. Check DevTools Network tab for GET to `/products?page=1&limit=8`
3. Scroll to bottom of page
4. Should load more products (page=2)

**Success Criteria:**
- Initial load shows 8 products
- Products display correctly with images, title, price
- Infinite scroll triggers page 2, 3, etc.
- Stops loading when hasMore is false

### 3. Test Product Details Endpoint

**Page:** http://localhost:3000/product/{id}

**Steps:**
1. Click on any product card
2. Check DevTools Network tab for GET to `/products/{id}`
3. Verify product details display

**Success Criteria:**
- Product detail page loads
- All product info displayed (title, price, description, images)
- Image gallery works with thumbnails
- Can add to cart

### 4. Test Recommendations Endpoint

**Page:** http://localhost:3000/product/{id}

**Steps:**
1. On product detail page, scroll to bottom
2. Check DevTools Network tab for GET to `/products/{id}/recommended`
3. Verify recommended products display

**Success Criteria:**
- "Customers Also Bought" section shows 6 products
- Each product card is clickable
- Products are different from current product

### Testing Checklist

- [ ] Login works and stores token
- [ ] Main page loads products
- [ ] Infinite scroll loads more products
- [ ] Product detail page loads correctly
- [ ] Recommended products display
- [ ] Error messages show for failed requests
- [ ] Loading states work during API calls
- [ ] Network requests use correct URL from env variable

---

## Error Handling

### Current Error Handling

The app currently shows toast notifications for errors. Ensure your backend returns appropriate HTTP status codes:

| Status | Meaning                | Frontend Behavior                    |
|--------|------------------------|--------------------------------------|
| 200    | Success                | Show data                            |
| 400    | Bad Request            | Show error toast                     |
| 401    | Unauthorized           | Redirect to login                    |
| 404    | Not Found              | Show "Product not found" message     |
| 500    | Server Error           | Show "Something went wrong" message  |

### Example Error Response Format

```json
{
  "error": true,
  "message": "Invalid credentials",
  "code": "AUTH_FAILED"
}
```

### Adding Authorization Headers

If your API requires JWT tokens for protected endpoints:

**Modify API calls to include token:**

```typescript
const token = getAuthToken();

const response = await fetch(`${BACKEND_API_URL}/products`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

---

## Troubleshooting

### Problem: CORS Errors

**Symptom:** Browser console shows "blocked by CORS policy"

**Solution:** Configure your backend to allow requests from `http://localhost:3000`

**Backend CORS Configuration (example for Spring Boot):**
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### Problem: 404 on API Calls

**Symptom:** Network tab shows 404 for API requests

**Checklist:**
1. Verify backend is running on correct port
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify backend routes match expected paths
4. Restart Next.js dev server after changing `.env.local`

### Problem: Token Not Sent

**Symptom:** Backend receives requests without authorization header

**Solution:** Check that token is stored:
1. Open DevTools → Application → Local Storage
2. Verify 'authToken' exists
3. Check token is passed in fetch headers

### Problem: Environment Variable Not Working

**Symptom:** Still using mock data after setting NEXT_PUBLIC_API_URL

**Solutions:**
1. Restart dev server: `npm run dev`
2. Verify file is named `.env.local` (not `.env`)
3. Check variable starts with `NEXT_PUBLIC_`
4. Clear Next.js cache: `rm -rf .next && npm run dev`

### Problem: Type Mismatches

**Symptom:** TypeScript errors after connecting to backend

**Solution:**
1. Ensure backend response matches TypeScript interfaces
2. Check field names match exactly (case-sensitive)
3. Verify data types (string vs number, etc.)

### Debug Mode

Add console logging to API functions:

```typescript
export const getProducts = async (page: number = 1, limit: number = 8): Promise<ProductsResponse> => {
  const url = `${BACKEND_API_URL}/products?page=${page}&limit=${limit}`;
  console.log('Fetching products:', url);

  const response = await fetch(url);
  console.log('Response status:', response.status);

  const data = await response.json();
  console.log('Response data:', data);

  return data;
};
```

---

## Summary

### Quick Reference

| Endpoint | Method | Function | Location |
|----------|--------|----------|----------|
| `/auth/login` | POST | `loginUser()` | `utils/api.ts:15` |
| `/products` | GET | `getProducts()` | `utils/api.ts:37` |
| `/products/:id` | GET | `getProductById()` | `utils/api.ts:55` |
| `/products/:id/recommended` | GET | `getRecommendedProducts()` | `utils/api.ts:70` |

### Files to Modify

1. **`.env.local`** - Set NEXT_PUBLIC_API_URL
2. **`utils/api.ts`** - Replace all 4 mock functions

### After Integration

Once connected, the frontend will:
- ✅ Authenticate users with your backend
- ✅ Load real product data
- ✅ Display product details from your database
- ✅ Show personalized recommendations
- ✅ Work with your existing API structure

### Need Help?

- Check browser DevTools Network tab to debug API calls
- Review TypeScript interfaces in `types/` directory
- Test with tools like Postman before integrating
- Ensure backend CORS is configured correctly

---

**Questions?** Review the example implementations above or test individual endpoints with curl/Postman first.
