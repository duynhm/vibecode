# Development Setup Guide

## Prerequisites

- Node.js 20+ (LTS)
- npm or pnpm
- Git
- VS Code (recommended)
- Odoo 18 instance with Inventory & Manufacturing modules installed

---

## Environment Variables

Create `.env.local` file:

```bash
# Odoo Configuration
NEXT_PUBLIC_ODOO_URL=https://your-odoo-instance.com
NEXT_PUBLIC_ODOO_DB=your_database_name
ODOO_USERNAME=admin
ODOO_PASSWORD=your_secure_password

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_key_here

# Optional: Redis for session storage (production)
REDIS_URL=redis://localhost:6379

# Optional: Sentry for error tracking
NEXT_PUBLIC_SENTRY_DSN=

# App Configuration
NEXT_PUBLIC_APP_NAME="Factory Management"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## Project Initialization

### 1. Create Next.js App

```bash
# Navigate to project root
cd /home/user/vibecode

# Create factory-frontend directory
npx create-next-app@latest factory-frontend --typescript --tailwind --app --src-dir=false --import-alias="@/*"

cd factory-frontend
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install next-auth@beta axios zustand @tanstack/react-query date-fns

# UI Components (shadcn/ui)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-avatar @radix-ui/react-accordion @radix-ui/react-tabs @radix-ui/react-alert-dialog
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Barcode scanning
npm install @zxing/browser @zxing/library

# Toast notifications
npm install sonner

# Forms & validation
npm install react-hook-form @hookform/resolvers zod

# Development dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
```

---

## Project Structure Setup

```bash
# Create directory structure
mkdir -p app/{api,\(auth\),\(dashboard\)}
mkdir -p components/{ui,layout,inventory,manufacturing}
mkdir -p lib/{odoo,auth,utils}
mkdir -p types/odoo
mkdir -p hooks
mkdir -p stores
mkdir -p public/images
```

---

## Configuration Files

### 1. `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [768, 1024, 1280],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-odoo-instance.com',
        pathname: '/web/image/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}

export default config
```

---

### 2. `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontSize: {
        base: '1rem', // 16px minimum for factory workers
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

### 3. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ],
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### 4. `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

---

### 5. `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## VS Code Settings

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

`.vscode/extensions.json`:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## Scripts

Update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Git Setup

`.gitignore`:
```
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

---

### 2. Code Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

---

## Odoo Connection Test

Create `lib/odoo/test-connection.ts`:

```typescript
export async function testOdooConnection() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_ODOO_URL}/web/database/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {},
    }),
  })

  const data = await response.json()
  console.log('Odoo databases:', data.result)
  return data
}
```

Test in `app/page.tsx`:
```typescript
import { testOdooConnection } from '@/lib/odoo/test-connection'

export default async function Home() {
  const odooTest = await testOdooConnection()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Factory Management</h1>
      <pre>{JSON.stringify(odooTest, null, 2)}</pre>
    </div>
  )
}
```

---

## Next Steps

1. ✅ Initialize git repository
2. ✅ Create initial commit
3. ✅ Setup shadcn/ui components
4. ✅ Implement Odoo API client
5. ✅ Setup NextAuth.js authentication
6. ✅ Create layout components
7. ✅ Implement Inventory module
8. ✅ Implement Manufacturing module

---

## Deployment (Optional for now)

### Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel
```

### Docker Deployment

`Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  factory-frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_ODOO_URL=${NEXT_PUBLIC_ODOO_URL}
      - NEXT_PUBLIC_ODOO_DB=${NEXT_PUBLIC_ODOO_DB}
      - ODOO_USERNAME=${ODOO_USERNAME}
      - ODOO_PASSWORD=${ODOO_PASSWORD}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    restart: unless-stopped
```

---

## Troubleshooting

### Issue: Cannot connect to Odoo
- Check Odoo URL and credentials
- Verify CORS settings in Odoo
- Check network/firewall rules

### Issue: Build errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Issue: TypeScript errors
- Run `npm run type-check` to see all errors
- Check `tsconfig.json` configuration
- Ensure all dependencies have type definitions

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Odoo 18 API Documentation](https://www.odoo.com/documentation/18.0/developer/reference/backend/web.html)
- [shadcn/ui Components](https://ui.shadcn.com)
- [NextAuth.js Guide](https://authjs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Ready to start implementation! 🚀
