# Developer's Quick Reference Cheat Sheet

## 🚀 Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Preview production build
npm run preview
```

## 📁 File Locations

| Need | File |
|------|------|
| API endpoints | `src/constants/index.ts` |
| Redux actions | `src/store/slices/shortenSlice.ts` |
| HTTP calls | `src/services/urlService.ts` |
| Types | `src/types/index.ts` |
| Validation | `src/utils/validation.ts` |
| Utilities | `src/utils/index.ts` |
| Components | `src/components/{category}/{Component}.tsx` |
| Pages | `src/pages/{Page}.tsx` |

## 🎯 Common Tasks

### Add a New API Endpoint

1. **Add to constants:**
```typescript
// src/constants/index.ts
export const API_ENDPOINTS = {
  SHORTEN_URL: '/api/shorten',
  NEW_ENDPOINT: '/api/new-feature',
};
```

2. **Create service function:**
```typescript
// src/services/urlService.ts
export const urlService = {
  newFunction: async (payload) => {
    return httpClient.post(API_ENDPOINTS.NEW_ENDPOINT, payload);
  }
};
```

3. **Create Redux action:**
```typescript
// src/store/slices/shortenSlice.ts
export const newAction = createAsyncThunk('name', async (payload, { rejectWithValue }) => {
  try {
    return await urlService.newFunction(payload);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
```

### Create a New Component

```typescript
import React from 'react';

interface MyComponentProps {
  // Props here
}

export const MyComponent: React.FC<MyComponentProps> = ({ }) => {
  return (
    <div className="...">
      {/* JSX here */}
    </div>
  );
};
```

### Use Redux

```typescript
import { useAppDispatch, useShortenState } from '../hooks/useRedux';
import { shortenUrl } from '../store/slices/shortenSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { urls, loading, error } = useShortenState();
  
  const handleClick = async () => {
    await dispatch(shortenUrl({ longUrl: '...' }));
  };
};
```

### Add Form Validation

```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const mySchema = z.object({
  field1: z.string().min(1, 'Required'),
  field2: z.number().positive(),
});

export type MyFormData = z.infer<typeof mySchema>;
```

### Use Validation in Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mySchema, MyFormData } from '../utils/validation';

export const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MyFormData>({
    resolver: zodResolver(mySchema),
  });
  
  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('field1')} />
      {errors.field1 && <span>{errors.field1.message}</span>}
    </form>
  );
};
```

## 🎨 TailwindCSS Quick Classes

```tsx
// Layout
className="flex items-center justify-between"
className="grid grid-cols-1 md:grid-cols-3 gap-6"

// Spacing
className="px-6 py-4 mb-6 mt-4"

// Colors
className="bg-blue-600 text-white border-gray-300"

// Typography
className="text-sm font-medium text-gray-700"

// Responsive
className="text-base md:text-lg lg:text-xl"

// Hover/Focus
className="hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"

// States
className="disabled:bg-gray-400 disabled:cursor-not-allowed"
```

## 🔄 Redux Patterns

### Dispatch Action
```typescript
const dispatch = useAppDispatch();
await dispatch(shortenUrl({ longUrl: '...' }));
```

### Select State
```typescript
const { urls, loading, error } = useShortenState();
```

### Clear Error
```typescript
dispatch(clearError());
```

### Delete Item
```typescript
dispatch(deleteUrl(id));
```

## 🔌 API Patterns

### Make a GET Request
```typescript
const response = await httpClient.get('/endpoint');
return response.data;
```

### Make a POST Request
```typescript
const response = await httpClient.post('/endpoint', {
  field: 'value'
});
return response.data;
```

### Handle Error
```typescript
try {
  const data = await apiCall();
} catch (error: any) {
  const message = error.response?.data?.message || 'Error';
}
```

## 📝 Useful Utilities

```typescript
import { 
  isValidUrl,
  copyToClipboard,
  formatDate,
  isUrlExpired,
  timeUntilExpiry 
} from '../utils';

// URL validation
if (!isValidUrl(url)) { /* error */ }

// Clipboard
const copied = await copyToClipboard(url);

// Date formatting
const formatted = formatDate('2025-12-31T00:00:00Z');
// → "Dec 31, 2025, 12:00 AM"

// Check expiry
if (isUrlExpired(date)) { /* expired */ }

// Countdown
const remaining = timeUntilExpiry(date);
// → "3d 5h"
```

## 🎭 Component Patterns

### Button Component
```tsx
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

### Alert Component
```tsx
<Alert type="error" message="Error message" onClose={() => {}} />
```

### Card Component
```tsx
<Card className="custom-class">
  Content here
</Card>
```

### Badge Component
```tsx
<Badge variant="success">Active</Badge>
```

## 🧪 Debugging

### Check Redux State
```typescript
// 1. Install Redux DevTools Extension
// 2. Open DevTools → Redux tab
// 3. See all actions and state
```

### Log API Calls
```typescript
// Check Network tab in DevTools
// See all HTTP requests/responses
```

### Console Logging
```typescript
console.log('Value:', value);
console.error('Error:', error);
```

### React DevTools
```
Install React DevTools Extension
Component → Props inspection
```

## 🔐 Security Checklist

- ✅ All URLs validated before submission
- ✅ CORS headers configured
- ✅ Auth token interceptor ready
- ✅ No hardcoded secrets
- ✅ Environment variables for config
- ✅ Input sanitized
- ✅ Error messages user-friendly
- ✅ XSS prevention via React

## 📦 Dependencies Quick Reference

| Package | Use |
|---------|-----|
| `react-router-dom` | Routing |
| `@reduxjs/toolkit` | State management |
| `react-redux` | Redux bindings |
| `axios` | HTTP client |
| `react-hook-form` | Forms |
| `zod` | Validation |
| `@hookform/resolvers` | Form validation |
| `tailwindcss` | Styling |
| `clsx` | Class combining |
| `date-fns` | Date utilities |

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Port 5173 in use | `npm run dev -- --port 5174` |
| CORS error | Check backend CorsConfig |
| API 404 | Check API_ENDPOINTS constants |
| Form not validating | Check resolver is passed |
| Redux not updating | Check action dispatched |
| Tailwind not working | Check content paths in config |
| TypeScript errors | Run `npm run type-check` |
| Module not found | Check import path |

## 📊 Performance Tips

- Use React DevTools Profiler
- Check bundle size: `npm run build`
- Lazy load routes with React.lazy
- Memoize components if needed
- Use Redux selectors correctly
- Check Redux DevTools for actions
- Minimize re-renders

## 🎯 Testing Commands

```bash
# Type checking (local)
npm run type-check

# Linting (style)
npm run lint

# Build test
npm run build

# Production preview
npm run preview
```

## 🚀 Deployment Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] .env.production configured
- [ ] API_BASE_URL set correctly
- [ ] No console errors
- [ ] No console warnings
- [ ] Responsive design tested
- [ ] All features working
- [ ] Forms validating correctly
- [ ] Error handling working

## 🔗 Important URLs

- Development: `http://localhost:5173`
- Backend: `http://localhost:8080`
- API: `http://localhost:8080/api/shorten`
- Redux DevTools: Browser extension

## 📚 Documentation Quick Links

- Architecture deep-dive: `ARCHITECTURE.md`
- API integration guide: `API_INTEGRATION.md`
- Quick start: `QUICKSTART.md`
- Implementation summary: `IMPLEMENTATION_SUMMARY.md`

---

**Print this sheet and keep it handy! 🚀**
