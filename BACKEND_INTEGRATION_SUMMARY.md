# Backend API Integration - Documentation Summary

Complete documentation has been created to help you connect the frontend to your backend API.

## 📚 Documentation Files Created

All files are located in the [`frontend/`](frontend/) directory:

### 1. **[.env.example](frontend/.env.example)**
Environment variable template with instructions.

**What it contains:**
- Template for `NEXT_PUBLIC_API_URL` configuration
- Examples for different environments (dev, staging, production)
- Usage instructions
- Optional configuration variables

**How to use:**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your backend URL
```

---

### 2. **[API_INTEGRATION.md](frontend/API_INTEGRATION.md)** ⭐ Main Guide
Complete, comprehensive integration guide (most detailed).

**What it contains:**
- Quick start instructions
- Detailed documentation for all 4 API endpoints
- Request/response formats with TypeScript types
- Example implementations
- Step-by-step integration instructions
- TypeScript interface reference
- Testing checklist
- Error handling guidelines
- Troubleshooting guide
- CORS configuration help

**Perfect for:** First-time integration, detailed reference

---

### 3. **[API_QUICK_REFERENCE.md](frontend/API_QUICK_REFERENCE.md)** 📋 Cheat Sheet
One-page quick reference card.

**What it contains:**
- Quick configuration steps
- All 4 endpoints with examples
- Implementation checklist
- Code snippets ready to copy
- Common issues and solutions
- Testing URLs

**Perfect for:** Quick lookups, copy-paste code

---

### 4. **[API_FLOW_DIAGRAM.md](frontend/API_FLOW_DIAGRAM.md)** 📊 Visual Guide
Visual diagrams showing how everything connects.

**What it contains:**
- Architecture overview
- User flow diagrams for each feature
- Token authentication flow
- Protected route flow
- Complete shopping journey
- Data flow patterns
- Environment variable flow
- File location diagram

**Perfect for:** Understanding the big picture, visual learners

---

## 🔗 API Endpoints to Implement

Your backend needs to implement these 4 endpoints:

| # | Endpoint | Method | Purpose | Documented In |
|---|----------|--------|---------|---------------|
| 1 | `/auth/login` | POST | User authentication | All docs |
| 2 | `/products` | GET | Get product list (paginated) | All docs |
| 3 | `/products/:id` | GET | Get single product details | All docs |
| 4 | `/products/:id/recommended` | GET | Get related products | All docs |

**Base URL:** `http://localhost:8080/api` (configurable via environment variable)

---

## 📍 Code Locations

All API integration code is centralized:

| File | Purpose | Lines |
|------|---------|-------|
| [`frontend/utils/api.ts`](frontend/utils/api.ts) | All API functions | 15-74 |
| [`frontend/types/product.ts`](frontend/types/product.ts) | Product types | All |
| [`frontend/types/user.ts`](frontend/types/user.ts) | Auth types | All |
| [`frontend/types/cart.ts`](frontend/types/cart.ts) | Cart/Order types | All |

**Search for:** `TODO: Replace with actual API call` to find all integration points.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Backend URL

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Step 2: Replace API Functions

Open [`frontend/utils/api.ts`](frontend/utils/api.ts) and replace the 4 mock functions:

1. `loginUser()` - Line 15
2. `getProducts()` - Line 37
3. `getProductById()` - Line 55
4. `getRecommendedProducts()` - Line 70

See [API_INTEGRATION.md](frontend/API_INTEGRATION.md#step-by-step-integration) for example implementations.

### Step 3: Test

```bash
npm run dev
```

Visit http://localhost:3000 and test each feature:
- Login at `/login`
- Product list at `/`
- Product detail at `/product/[id]`

---

## 📝 Request/Response Formats

### 1. Login Request
```json
POST /auth/login
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

### 2. Products List Request
```http
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
      "shortDescription": "Brief description",
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

### 3. Product Detail Request
```http
GET /products/product-1
```

**Response:** Same as Product object above

### 4. Recommendations Request
```http
GET /products/product-1/recommended
```

**Response:** Array of Product objects (up to 6)

Complete details in [API_INTEGRATION.md](frontend/API_INTEGRATION.md#api-endpoints-reference).

---

## 🔍 Where Each Endpoint is Used

| Endpoint | Frontend File | Component/Page |
|----------|---------------|----------------|
| `/auth/login` | `pages/login.tsx` | Login form submission |
| `/products` | `pages/index.tsx` | Main page, infinite scroll |
| `/products/:id` | `pages/product/[id].tsx` | Product detail page |
| `/products/:id/recommended` | `pages/product/[id].tsx` | "Customers Also Bought" section |

---

## ✅ Integration Checklist

Use this checklist to track your progress:

- [ ] Read [API_INTEGRATION.md](frontend/API_INTEGRATION.md)
- [ ] Create `.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Implement backend endpoint: `POST /auth/login`
- [ ] Implement backend endpoint: `GET /products`
- [ ] Implement backend endpoint: `GET /products/:id`
- [ ] Implement backend endpoint: `GET /products/:id/recommended`
- [ ] Replace `loginUser()` in `utils/api.ts`
- [ ] Replace `getProducts()` in `utils/api.ts`
- [ ] Replace `getProductById()` in `utils/api.ts`
- [ ] Replace `getRecommendedProducts()` in `utils/api.ts`
- [ ] Configure CORS on backend for `http://localhost:3000`
- [ ] Test login functionality
- [ ] Test product listing and infinite scroll
- [ ] Test product detail page
- [ ] Test recommendations section
- [ ] Handle authentication errors (401)
- [ ] Handle not found errors (404)
- [ ] Handle server errors (500)
- [ ] Add Authorization header if needed
- [ ] Test with real data
- [ ] Deploy and update `NEXT_PUBLIC_API_URL` for production

---

## 🔧 TypeScript Support

All request/response types are fully typed:

```typescript
// Defined in types/user.ts
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Defined in types/product.ts
interface Product {
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

interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
}
```

Your backend should match these exact interfaces for seamless integration.

---

## 🐛 Common Issues

### CORS Errors
**Problem:** Browser shows "blocked by CORS policy"

**Solution:** Configure your backend to allow `http://localhost:3000`

**Spring Boot example:**
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### 404 Errors
**Problem:** API calls return 404

**Checklist:**
- ✓ Backend is running
- ✓ `NEXT_PUBLIC_API_URL` is correct in `.env.local`
- ✓ Backend routes match exactly (`/auth/login`, `/products`, etc.)
- ✓ Restarted Next.js dev server after changing `.env.local`

### Environment Variable Not Working
**Problem:** Still using mock data

**Solution:**
```bash
# 1. Verify file name is .env.local (not .env)
# 2. Verify variable starts with NEXT_PUBLIC_
# 3. Restart dev server
rm -rf .next
npm run dev
```

See [API_INTEGRATION.md - Troubleshooting](frontend/API_INTEGRATION.md#troubleshooting) for more.

---

## 📖 Recommended Reading Order

1. **First time?** Start with [API_INTEGRATION.md](frontend/API_INTEGRATION.md)
2. **Visual learner?** Check out [API_FLOW_DIAGRAM.md](frontend/API_FLOW_DIAGRAM.md)
3. **Need quick reference?** Use [API_QUICK_REFERENCE.md](frontend/API_QUICK_REFERENCE.md)
4. **Setting up environment?** Copy [.env.example](frontend/.env.example)

---

## 🎯 Summary

You now have **complete documentation** for backend integration:

✅ **4 detailed guides** covering every aspect
✅ **All 4 API endpoints** fully documented
✅ **Request/response examples** with TypeScript types
✅ **Step-by-step instructions** for implementation
✅ **Visual diagrams** showing data flow
✅ **Troubleshooting guide** for common issues
✅ **Environment configuration** template
✅ **Testing checklist** to verify integration

Everything you need is in the [`frontend/`](frontend/) directory.

---

## 📞 Need Help?

1. Check [API_INTEGRATION.md](frontend/API_INTEGRATION.md#troubleshooting) troubleshooting section
2. Review [API_FLOW_DIAGRAM.md](frontend/API_FLOW_DIAGRAM.md) for visual understanding
3. Verify TypeScript types match in `types/` directory
4. Test endpoints with Postman/curl before integrating
5. Check browser DevTools Network tab for API calls

---

## 🎉 Next Steps

1. Read the documentation
2. Set up your backend API endpoints
3. Configure environment variables
4. Replace mock functions
5. Test thoroughly
6. Deploy!

Happy coding! 🚀
