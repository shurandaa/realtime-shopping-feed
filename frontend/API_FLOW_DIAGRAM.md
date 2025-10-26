# API Flow Diagrams

Visual representation of how the frontend interacts with backend API endpoints.

## Overview Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
│                                                                  │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Pages     │───▶│  utils/api.ts│───▶│  .env.local  │      │
│  │ (React)     │    │  (API Layer) │    │   (Config)   │      │
│  └─────────────┘    └──────────────┘    └──────────────┘      │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ HTTP Requests
                               │ (fetch API)
                               ▼
                ┌──────────────────────────────┐
                │   Backend API Server         │
                │   (Spring Boot / Node.js)    │
                │                              │
                │   Base URL:                  │
                │   http://localhost:8080/api  │
                └──────────────────────────────┘
```

---

## 1. Login Flow

```
User Actions                Frontend                    Backend API
─────────────              ────────────                ────────────

1. User enters
   email/password
   on login page
       │
       ▼
2. Clicks "Login"  ───▶  pages/login.tsx
   button                      │
                               │ calls loginUser()
                               ▼
                        utils/api.ts:15
                               │
                               │ POST /auth/login
                               │ Body: { email, password }
                               │
                               ▼
                        ┌──────────────────┐
                        │  Backend Server  │
                        │  /auth/login     │
                        │                  │
                        │  1. Validate     │
                        │  2. Generate JWT │
                        │  3. Return token │
                        └──────────────────┘
                               │
                               │ Response:
                               │ { token, user }
                               ▼
                        utils/api.ts
                               │
                               │ stores token in
                               │ localStorage
                               ▼
                        hooks/useAuth.ts
                               │
                               │ updates auth state
                               ▼
3. Redirected to    ◀─────  pages/login.tsx
   home page                   │
                               ▼
4. Header shows              Layout/Header.tsx
   user email                (shows user in dropdown)
```

**Code Locations:**
- Form submission: `pages/login.tsx:28`
- API call: `utils/api.ts:15-31`
- Auth hook: `hooks/useAuth.ts`
- Token storage: localStorage key `authToken`

---

## 2. Product Listing Flow (Infinite Scroll)

```
User Actions                Frontend                      Backend API
─────────────              ────────────                  ────────────

1. User visits
   home page
       │
       ▼
2. Page loads      ───▶  pages/index.tsx
                               │
                               │ useEffect on mount
                               ▼
                          loadProducts(page=1)
                               │
                               │ calls getProducts(1, 8)
                               ▼
                        utils/api.ts:37
                               │
                               │ GET /products?page=1&limit=8
                               │
                               ▼
                        ┌──────────────────┐
                        │  Backend Server  │
                        │  /products       │
                        │                  │
                        │  1. Query DB     │
                        │  2. Paginate     │
                        │  3. Return       │
                        └──────────────────┘
                               │
                               │ Response:
                               │ { products: [...], hasMore: true, total: 30 }
                               ▼
                        pages/index.tsx
                               │
                               │ setState(products)
                               ▼
3. 8 products       ◀─────  ProductGrid
   displayed                  │
       │                      │ renders ProductCard for each
       │                      ▼
       │               ProductCard × 8
       │                      │
4. User scrolls              │
   to bottom                 │
       │                     │
       ▼                     ▼
5. IntersectionObserver  ───▶ detects scroll
   triggers                   │
       │                      │ calls loadProducts(page=2)
       │                      ▼
       │                utils/api.ts:37
       │                      │
       │                      │ GET /products?page=2&limit=8
       │                      ▼
       │                [Backend processes...]
       │                      │
       │                      │ Response: { products: [...], hasMore: true }
       │                      ▼
6. 8 more products  ◀───── pages/index.tsx
   appended                   │
                              │ appends to existing products
                              ▼
7. Process repeats until hasMore = false
```

**Code Locations:**
- Page component: `pages/index.tsx:38`
- API call: `utils/api.ts:37-49`
- Intersection Observer: `pages/index.tsx:28-40`
- Grid rendering: `components/ProductGrid.tsx`

---

## 3. Product Detail Flow

```
User Actions                Frontend                      Backend API
─────────────              ────────────                  ────────────

1. User clicks on
   product card
       │
       ▼
2. Navigate to     ───▶  pages/product/[id].tsx
   /product/123              │
                             │ useEffect with router.query.id
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
           getProductById(id)    getRecommendedProducts(id)
                │                         │
                ▼                         ▼
         utils/api.ts:55          utils/api.ts:70
                │                         │
                │                         │
                │ GET /products/123       │ GET /products/123/recommended
                │                         │
                ▼                         ▼
        ┌────────────────┐        ┌────────────────┐
        │ Backend Server │        │ Backend Server │
        │ /products/:id  │        │ /recommended   │
        │                │        │                │
        │ 1. Find by ID  │        │ 1. Find related│
        │ 2. Return data │        │ 2. Return list │
        └────────────────┘        └────────────────┘
                │                         │
                │ Response:                │ Response:
                │ { id, title, ... }       │ [{ product }, ...]
                │                         │
                └────────────┬────────────┘
                             ▼
                      pages/product/[id].tsx
                             │
                             │ setState for both
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    3. Product details         4. Recommended section
       displayed                  displayed
       - Images                   - 6 product cards
       - Title/Price              - "Customers Also Bought"
       - Description              - Each clickable
       - Add to Cart
       - Quantity selector
```

**Code Locations:**
- Page component: `pages/product/[id].tsx`
- Product API: `utils/api.ts:55-64`
- Recommendations API: `utils/api.ts:70-74`
- Data loading: `pages/product/[id].tsx:28-40`

---

## 4. Authentication Token Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Token Lifecycle                          │
└─────────────────────────────────────────────────────────────────┘

1. Login Success
   ───────────────────────────────────────────────────────────────
   POST /auth/login
        │
        ▼
   Response: { token: "jwt-token-here", user: {...} }
        │
        ▼
   localStorage.setItem('authToken', token)
   localStorage.setItem('user', JSON.stringify(user))


2. Token Retrieval
   ───────────────────────────────────────────────────────────────
   utils/api.ts:getAuthToken()
        │
        ▼
   return localStorage.getItem('authToken')


3. Using Token (If Required by Backend)
   ───────────────────────────────────────────────────────────────
   fetch(url, {
     headers: {
       'Authorization': `Bearer ${getAuthToken()}`,
       'Content-Type': 'application/json'
     }
   })


4. Token Validation
   ───────────────────────────────────────────────────────────────
   On app load → hooks/useAuth.ts
        │
        ▼
   Check if token exists in localStorage
        │
        ├──▶ Token exists → Set user as authenticated
        │
        └──▶ No token → User not authenticated


5. Logout
   ───────────────────────────────────────────────────────────────
   utils/api.ts:logoutUser()
        │
        ▼
   localStorage.removeItem('authToken')
   localStorage.removeItem('user')
        │
        ▼
   hooks/useAuth.ts → setIsAuthenticated(false)
        │
        ▼
   Redirect to /login
```

---

## 5. Protected Route Flow

```
User tries to access protected page (e.g., /checkout)
       │
       ▼
pages/checkout.tsx
       │
       │ useEffect checks authentication
       ▼
hooks/useAuth.ts:isAuthenticated
       │
       │ checks for token in localStorage
       │
   ┌───┴───┐
   │       │
   ▼       ▼
Token    No Token
exists
   │       │
   │       └──▶ toast.error('Please login')
   │            router.push('/login')
   │
   └──▶ Render checkout page
        User can proceed
```

**Code Locations:**
- Auth check: `pages/checkout.tsx:38-46`
- Auth hook: `hooks/useAuth.ts`
- Token storage: localStorage

---

## 6. Complete User Journey

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Full Shopping Flow                             │
└──────────────────────────────────────────────────────────────────────┘

Step 1: Login
────────────────────────────────────────────────────────────────
/login  ────POST /auth/login────▶  Backend  ────Response────▶  Token stored


Step 2: Browse Products
────────────────────────────────────────────────────────────────
/  ────GET /products?page=1────▶  Backend  ────Response────▶  Display 8 products
│
└──(scroll)──GET /products?page=2───▶  Backend  ────Response────▶  Display 8 more


Step 3: View Product
────────────────────────────────────────────────────────────────
/product/123  ────GET /products/123────────────▶  Backend  ────Response────▶  Show details
              ────GET /products/123/recommended─▶  Backend  ────Response────▶  Show 6 related


Step 4: Add to Cart
────────────────────────────────────────────────────────────────
Click "Add to Cart"  ────▶  hooks/useCart.ts  ────▶  localStorage  ────▶  Cart updated
                                                                            Header badge +1


Step 5: View Cart
────────────────────────────────────────────────────────────────
/cart  ────▶  Read localStorage  ────▶  Display cart items
                                         Calculate total


Step 6: Checkout
────────────────────────────────────────────────────────────────
/checkout  ────Check auth────▶  hooks/useAuth  ────Verified────▶  Show form
                │
                └──(if not auth)──▶  Redirect to /login


Step 7: Place Order
────────────────────────────────────────────────────────────────
Click "Place Order"  ────▶  Process (mock)  ────▶  Clear cart  ────▶  Redirect to /account
                                                     localStorage
```

---

## API Call Summary

```
┌──────────────────┬─────────┬──────────────────────────┬────────────────────┐
│ Endpoint         │ Method  │ Function                 │ Used By            │
├──────────────────┼─────────┼──────────────────────────┼────────────────────┤
│ /auth/login      │ POST    │ loginUser()              │ pages/login.tsx    │
│ /products        │ GET     │ getProducts()            │ pages/index.tsx    │
│ /products/:id    │ GET     │ getProductById()         │ pages/product/[id] │
│ /products/:id/   │ GET     │ getRecommendedProducts() │ pages/product/[id] │
│ recommended      │         │                          │                    │
└──────────────────┴─────────┴──────────────────────────┴────────────────────┘
```

---

## Data Flow Patterns

### Pattern 1: Simple Fetch
```
Component ──calls──▶ API Function ──fetch──▶ Backend ──response──▶ API Function
                                                                         │
                                                                         ▼
Component ◀──returns── API Function
```

### Pattern 2: With State
```
Component ──calls──▶ API Function ──fetch──▶ Backend
    │                                            │
    │ useState loading                           │ response
    ▼                                            ▼
Loading...                               API Function
                                                 │
                                                 ▼
Component ◀──setState(data)── API Function
    │
    ▼
Display Data
```

### Pattern 3: With Error Handling
```
Component ──calls──▶ API Function ──fetch──▶ Backend
                           │                     │
                           │                     ▼
                           │              ┌──Success──┐
                           │              │           │
                           │              ▼           ▼
                           │         Return Data   Show Toast
                           │              │
                           │              ▼
                           └──try/catch── Component
                                  │
                                  ▼ on error
                            toast.error()
                            Show error message
```

---

## Environment Variable Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  Environment Variable Usage                      │
└─────────────────────────────────────────────────────────────────┘

.env.local file
     │
     │ NEXT_PUBLIC_API_URL=http://localhost:8080/api
     │
     ▼
Next.js Build Process
     │
     │ Reads .env.local
     │ Injects into process.env
     ▼
utils/api.ts
     │
     │ const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL
     │                      || 'http://localhost:8080/api'
     ▼
All API calls use BACKEND_API_URL
     │
     ├──▶ fetch(`${BACKEND_API_URL}/auth/login`, ...)
     ├──▶ fetch(`${BACKEND_API_URL}/products`, ...)
     ├──▶ fetch(`${BACKEND_API_URL}/products/${id}`, ...)
     └──▶ fetch(`${BACKEND_API_URL}/products/${id}/recommended`, ...)
```

---

## Quick Reference

### All API Endpoints at a Glance

```
Backend Base URL: http://localhost:8080/api
                  └─────────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
         POST /auth/login  GET /products  GET /products/:id
                                               │
                                               └──▶ GET /products/:id/recommended
```

### File Locations

```
frontend/
├── .env.local                    ◀── Set NEXT_PUBLIC_API_URL here
├── utils/api.ts                  ◀── All API functions (4 endpoints)
├── types/
│   ├── product.ts                ◀── Product, ProductsResponse types
│   └── user.ts                   ◀── User, AuthResponse types
├── pages/
│   ├── login.tsx                 ◀── Uses loginUser()
│   ├── index.tsx                 ◀── Uses getProducts()
│   └── product/[id].tsx          ◀── Uses getProductById(), getRecommendedProducts()
└── hooks/
    ├── useAuth.ts                ◀── Auth state management
    └── useCart.ts                ◀── Cart state (localStorage only)
```

---

For detailed implementation instructions, see [API_INTEGRATION.md](API_INTEGRATION.md)
