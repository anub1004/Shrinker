# URL Shortener Frontend - Quick Start Guide

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend running on `http://localhost:8080`

### Setup Steps

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Start development server
npm run dev

# App opens at http://localhost:5173
```

## 🏃 Development Workflow

### Start Dev Server
```bash
npm run dev
# Hot reload enabled - changes appear instantly
```

### Build for Production
```bash
npm run build
# Optimized bundle in dist/ folder
npm run preview
# Test production build locally
```

### Type Checking
```bash
npm run type-check
# Verify TypeScript types without building
```

### Linting
```bash
npm run lint
# Check code style
```

## 🎯 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component, Redux provider |
| `src/pages/HomePage.tsx` | Main dashboard page |
| `src/store/slices/shortenSlice.ts` | Redux logic for URL shortening |
| `src/services/urlService.ts` | Backend API calls |
| `src/constants/index.ts` | API endpoints, config |
| `src/types/index.ts` | TypeScript interfaces |

## 📝 Adding a New Feature

### Example: Add Analytics Dashboard

1. **Create Type** (`src/types/index.ts`)
```typescript
export interface UrlAnalytics {
  shortCode: string;
  clickCount: number;
  lastClicked: string;
}
```

2. **Create Service** (`src/services/analyticsService.ts`)
```typescript
export const analyticsService = {
  getAnalytics: async (shortCode: string) => {
    return httpClient.get(`/api/analytics/${shortCode}`);
  }
};
```

3. **Create Component** (`src/pages/AnalyticsDashboard.tsx`)
```typescript
export const AnalyticsDashboard: React.FC = () => {
  // Component logic here
};
```

4. **Add Route** (`src/routes/index.tsx`)
```typescript
<Route path="/analytics" element={<AnalyticsDashboard />} />
```

5. **Style with TailwindCSS**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Charts here */}
</div>
```

## 🐛 Debugging

### Check Redux State
1. Install [Redux DevTools Extension](https://redux-devtools-extension.github.io/)
2. Open browser DevTools → Redux tab
3. See all state changes and actions

### Check API Calls
1. Open browser DevTools → Network tab
2. Filter by XHR/Fetch
3. Click on requests to see request/response bodies

### Check Validation Errors
1. Open browser Console
2. Fill form and submit
3. See validation error stack traces

## 🔗 Backend Integration

### Verify Backend is Running
```bash
# Should return "Vite + React"
curl http://localhost:8080/

# Test CORS
curl -i http://localhost:8080/api/shorten \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json"
```

### Test Shortening a URL
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://google.com", "customCode": null, "customExpiry": null}'
```

## 📱 Responsive Testing

```bash
# Test on mobile
npm run dev
# Go to http://localhost:5173 on mobile or DevTools device mode
```

## 🚀 Deployment

### Deploy to Vercel
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy frontend"
git push origin main

# 2. Vercel auto-deploys (connected repo)
# 3. Add VITE_API_URL in Vercel dashboard
```

## 📚 Component Examples

### Using Redux
```typescript
import { useAppDispatch } from '../hooks/useRedux';
import { shortenUrl } from '../store/slices/shortenSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  const handleClick = async (url: string) => {
    await dispatch(shortenUrl({ longUrl: url }));
  };
};
```

### Using Validation
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shortenUrlSchema } from '../utils/validation';

const MyForm = () => {
  const { register, errors, handleSubmit } = useForm({
    resolver: zodResolver(shortenUrlSchema),
  });
};
```

### Using Utilities
```typescript
import { isValidUrl, formatDate, timeUntilExpiry } from '../utils';

const formatted = formatDate('2025-12-31T00:00:00Z');
const remaining = timeUntilExpiry('2025-12-31T00:00:00Z');
```

## ✅ Checklist Before Pushing

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Dev server runs without errors
- [ ] All features work on mobile
- [ ] No console warnings
- [ ] Environment variables set

## 📖 Additional Resources

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Hook Form](https://react-hook-form.com)
- [TailwindCSS](https://tailwindcss.com)
- [Vite Docs](https://vite.dev)

## 🆘 Common Issues

**Port 5173 already in use**
```bash
# Kill the process or use different port
npm run dev -- --port 5174
```

**Redux DevTools not showing**
```bash
# Install browser extension first
# Then reload page
```

**API calls failing with CORS**
```bash
# Ensure backend CorsConfig.java has frontend origin
# Check Network tab CORS preflight request
```

**Hot reload not working**
```bash
# Ensure .env.local doesn't override VITE_HMR
# Restart dev server
```

---

**Questions?** Check ARCHITECTURE.md for detailed documentation.
