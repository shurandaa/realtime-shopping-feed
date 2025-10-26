# How to Start the Frontend Application

## Quick Start

The frontend application is located in the `frontend/` directory.

### Development Mode (Recommended)

```bash
# From the root directory (realtime-shopping-feed/)
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

### Production Mode

```bash
# From the root directory
cd frontend
npm run build   # Build first (if not already built)
npm start       # Then start
```

Then open: **http://localhost:3000**

---

## Available Commands

Once you're in the `frontend/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Troubleshooting

### Error: "Cannot find package.json"

**Problem:** You're in the wrong directory

**Solution:**
```bash
pwd  # Check current directory
cd frontend  # Navigate to frontend directory
```

### Error: Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Error: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## First Time Setup

If this is your first time running the app:

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies (already done if you followed the setup)
npm install

# 3. Create environment file (optional)
cp .env.example .env.local

# 4. Start development server
npm run dev
```

---

## What to Expect

When you run `npm run dev`, you should see:

```
> frontend@1.0.0 dev
> next dev

   ▲ Next.js 16.0.0
   - Local:        http://localhost:3000

 ✓ Ready in 2.3s
```

Then visit **http://localhost:3000** in your browser!

---

## Features to Try

Once the app is running:

1. **Browse Products** - Homepage with infinite scroll
2. **Hover on Product Cards** - Wait 1+ second to see expansion animation
3. **Login** - Go to `/login` and enter any email/password
4. **Product Details** - Click any product card
5. **Shopping Cart** - Add items and manage cart
6. **Favorites** - Click heart icons to save favorites
7. **Checkout** - Test the checkout flow

---

## Directory Structure Reminder

```
realtime-shopping-feed/          ← You are here (root)
├── frontend/                    ← Next.js app is here
│   ├── package.json            ← npm commands work here
│   ├── pages/
│   ├── components/
│   └── ...
├── spring-backend/              ← Backend (separate)
└── README.md
```

**Always run `npm` commands from the `frontend/` directory!**
