# URL Shortener Frontend - Enterprise Architecture Documentation

## 📋 Overview

This is a production-ready, enterprise-level React + TypeScript frontend for the **URL Shortener microservice**. The application integrates seamlessly with the Spring Boot backend, providing users with a modern, intuitive interface for shortening URLs, managing history, and tracking link expiration.

### Technology Stack
- **Framework**: React 19.2.6 + TypeScript 5.3.3
- **Build Tool**: Vite 8.0.12
- **State Management**: Redux Toolkit 2.1.0
- **Styling**: TailwindCSS 3.4.3
- **Forms**: React Hook Form 7.52.0 + Zod validation
- **HTTP Client**: Axios 1.7.7 with interceptors
- **Routing**: React Router DOM 7.1.0
- **Utilities**: date-fns, clsx, Recharts

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Buttons, alerts, badges, cards
│   ├── forms/          # ShortenUrlForm with validation
│   ├── layout/         # Layout wrapper with header/footer
│   └── tables/         # UrlHistoryTable component
├── pages/              # Page components
│   └── HomePage.tsx    # Main dashboard page
├── store/              # Redux state management
│   ├── slices/         # Reducer slices
│   │   └── shortenSlice.ts
│   └── index.ts        # Store configuration
├── services/           # API communication layer
│   ├── apiClient.ts    # Axios instance with interceptors
│   └── urlService.ts   # URL-specific API calls
├── hooks/              # Custom React hooks
│   └── useRedux.ts     # Redux hooks wrappers
├── types/              # TypeScript interfaces
│   └── index.ts        # Type definitions matching backend
├── utils/              # Utility functions
│   ├── index.ts        # General utilities
│   ├── validation.ts   # Zod schemas for form validation
├── constants/          # Application constants
│   └── index.ts        # API endpoints, messages, config
├── routes/             # Routing configuration
│   └── index.tsx       # Route definitions
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global Tailwind CSS
```

---

## 🔄 Data Flow Architecture

### 1. Backend Integration Contract

The frontend communicates with the backend via REST API:

#### **POST /api/shorten** - Shorten a URL
```typescript
Request: {
  longUrl: string,          // Required: URL to shorten
  customCode?: string,      // Optional: Custom short code
  customExpiry?: string     // Optional: Expiration date (ISO 8601)
}

Response: string            // Full short URL (e.g., "http://localhost:8080/abc123")
```

**Status Codes:**
- `200 OK`: Successfully shortened
- `400 BAD_REQUEST`: Validation error (invalid URL, custom code taken)
- `500 INTERNAL_SERVER_ERROR`: Server error

#### **GET /{shortCode}** - Redirect to original URL
```typescript
Response: 302 Found       // Redirect to original URL
// OR
Response: 404 Not Found   // If short code doesn't exist
Response: 410 Gone        // If link has expired
```

### 2. Request Flow Diagram

```
User Input (Form)
    ↓
React Hook Form (Client-side validation)
    ↓
Zod Schema Validation
    ↓
shortenUrl Action (Redux Thunk)
    ↓
Axios HTTP Client (with interceptors)
    ↓
Backend: POST /api/shorten
    ↓
Backend Returns Short URL
    ↓
shortenSlice reducer (update state + localStorage)
    ↓
UI Updates (success message, history table)
```

### 3. State Management Flow

#### Redux Store Structure
```typescript
store.shorten = {
  urls: UrlHistory[],           // All shortened URLs in history
  loading: boolean,             // Async operation status
  error: string | null,         // Error message
  lastShortenedUrl: UrlHistory | null,  // Most recent shortened URL
  successMessage: string | null // Success notification
}
```

#### UrlHistory Type (Cached in localStorage)
```typescript
interface UrlHistory {
  id: number,                   // Unique client-side ID
  longUrl: string,              // Original URL
  shortCode: string,            // Short code from backend
  shortUrl: string,             // Full short URL
  createdAt: string,            // ISO 8601 timestamp
  expiresAt: string,            // Expiration date
  isExpired: boolean,           // Computed property
  clickCount?: number           // For future analytics
}
```

#### Cache Strategy
- **localStorage**: URL history persists across sessions
- **Redis (Backend)**: Shortened URLs cached for 30 days
- **UI State (Redux)**: Current session state

---

## 🔐 Security Implementation

### 1. Token-Based Authentication (Future Ready)
```typescript
// services/apiClient.ts - Auth interceptor
Request headers include: Authorization: Bearer {token}
```

### 2. Input Validation
- **Frontend**: Zod schemas validate all form inputs
- **Backend**: Spring Boot validators ensure data integrity
- **Both**: URL must start with `http://` or `https://`

### 3. CORS Configuration
- Backend explicitly allows frontend origins:
  - `http://localhost:5173` (dev)
  - `https://shrink-frontend.vercel.app`
  - `https://shrink-chi.vercel.app`

### 4. Error Handling
- Sensitive error messages hidden from users
- Validation errors shown in forms
- API errors caught and displayed as alerts

---

## 🎨 Component Architecture

### Common Components (`src/components/common/`)

#### Button Component
```typescript
<Button 
  variant="primary" | "secondary" | "danger"
  size="sm" | "md" | "lg"
  loading={boolean}
  onClick={handler}
>
  Click Me
</Button>
```

#### Alert Component
```typescript
<Alert 
  type="success" | "error" | "info" | "warning"
  message="Your message"
  onClose={() => dismiss()}
/>
```

#### Card Component
Reusable container for content with shadow and border styling.

#### Badge Component
Status indicator badges (Active, Expired, etc.)

### Form Components (`src/components/forms/`)

#### ShortenUrlForm
- Integrates React Hook Form + Zod
- Features:
  - URL validation (http/https protocol check)
  - Advanced options toggle
  - Custom code input (3-20 chars)
  - Custom expiry date picker
  - Loading state during submission
  - Error display inline
  - Success feedback

### Layout Component (`src/components/layout/`)

**Layout.tsx**: Wrapper providing:
- Consistent header with branding
- Navigation bar
- Main content area
- Footer with copyright

### Table Components (`src/components/tables/`)

#### UrlHistoryTable
Displays all shortened URLs with:
- Short code (clickable link)
- Original URL (truncated with tooltip)
- Status badge (Active/Expired)
- Time until expiry
- Creation timestamp
- Copy & Delete actions

---

## 🔌 API Service Layer

### Architecture Pattern: Service Abstraction

**services/apiClient.ts**: Axios configuration
```typescript
- Single instance with shared config
- Request interceptors (add auth token)
- Response interceptors (handle 401 unauthorized)
- Base URL from environment
- 10s timeout
```

**services/urlService.ts**: API operations
```typescript
export const urlService = {
  shortenUrl: (payload) => Promise<string>
  getOriginalUrl: (shortCode) => Promise<string>
}
```

### Error Handling Strategy
```typescript
try {
  const response = await httpClient.post(endpoint, data)
  return response.data
} catch (error) {
  if (error.response?.status === 400) {
    // Validation error - display to user
  } else if (error.response?.status === 401) {
    // Auth failed - redirect to login
  } else if (!error.response) {
    // Network error
  }
  return rejectWithValue(message)
}
```

---

## ✅ Form Validation

### Zod Validation Schema (src/utils/validation.ts)

```typescript
shortenUrlSchema = {
  longUrl: string
    .min(1, "URL is required")
    .refine(isValidUrl, "Must start with http/https"),
  customCode: string
    .optional()
    .refine(val => !val || (val.length >= 3 && val.length <= 20)),
  customExpiry: string.optional()
}
```

### Validation Flow
1. User submits form
2. React Hook Form triggers Zod validation
3. Schema validators run (required, format, length)
4. Errors displayed inline on failed fields
5. On success, dispatch Redux action
6. Backend validation acts as secondary check

---

## 🎯 State Management Patterns

### Redux Slices Pattern

**shortenSlice.ts**:
- **Reducers**: synchronous state changes
  - `clearError()`: Clear error message
  - `clearSuccessMessage()`: Clear success message
  - `deleteUrl(id)`: Remove from history
  - `clearHistory()`: Reset entire history

- **Thunks**: asynchronous operations
  - `shortenUrl()`: Call backend, update state, cache in localStorage

- **Extra Reducers**: Handle thunk states
  - `pending`: Set loading = true
  - `fulfilled`: Update urls array, set lastShortenedUrl, save to localStorage
  - `rejected`: Set error message

### Local Storage Integration
```typescript
// On mount: Load from localStorage
const initialState = {
  urls: JSON.parse(localStorage.getItem('urlHistory') || '[]')
}

// On change: Save to localStorage
localStorage.setItem('urlHistory', JSON.stringify(state.urls))
```

---

## 🚀 Performance Optimizations

### 1. Caching Strategy
- **Redis Cache (Backend)**: 30-day TTL for shortened URLs
- **localStorage**: Persistent URL history client-side
- **State**: Redux in-memory for current session

### 2. Lazy Loading
- Components are stateless and reusable
- Async thunks prevent UI blocking
- Loading states show feedback

### 3. Render Optimization
- Memoization via Redux selectors (through useAppSelector)
- Component splitting minimizes re-renders
- Controlled inputs prevent unnecessary updates

### 4. Bundle Size
- Tree-shaking: Unused code removed
- Vite: Fast ESM builds
- TailwindCSS: Purges unused styles

---

## 🧪 Testing Strategy (Future Implementation)

### Unit Tests (Jest + React Testing Library)
```typescript
// Button component behavior
// Form validation rules
// Utility functions
```

### Integration Tests
```typescript
// Full flow: user submits form → API call → state update → UI reflects
// Error handling: network error → alert shown
// Redirect: shortened URL copied to clipboard
```

### E2E Tests (Cypress/Playwright)
```typescript
// User journey: open app → shorten URL → verify in history → delete entry
// CORS preflight verification
```

---

## 📊 Data Relationships

### URL Entity Relationship
```
Frontend (localStorage)
    ↓ (via Axios)
Backend (PostgreSQL)
    ↓ (reads)
Redis Cache
    ↓ (on GET request)
Returns original URL or 404/410 error
```

### Session Flow
```
App Start
  ↓ (Load from localStorage)
Redux Store
  ↓ (User submits)
Axios → Backend
  ↓ (Backend saves + Redis caches)
Redux Update → localStorage
  ↓ (Display)
UI Components
```

---

## 🔄 Request/Response Examples

### Example 1: Successful URL Shortening

**Frontend Request:**
```typescript
POST http://localhost:8080/api/shorten
{
  "longUrl": "https://www.example.com/very/long/url/path",
  "customCode": null,
  "customExpiry": null
}
```

**Backend Response:**
```json
"http://localhost:8080/aBc3D"
```

**Frontend Processing:**
```typescript
// Extract short code and update state
shortCode = "aBc3D"
store.shorten.lastShortenedUrl = {
  id: 1716562800000,
  longUrl: "https://www.example.com/very/long/url/path",
  shortCode: "aBc3D",
  shortUrl: "http://localhost:8080/aBc3D",
  createdAt: "2025-05-24T22:00:00Z",
  expiresAt: "2025-11-24T22:00:00Z",
  isExpired: false
}
```

### Example 2: Custom Code with Expiry

**Frontend Request:**
```typescript
POST http://localhost:8080/api/shorten
{
  "longUrl": "https://mysite.com",
  "customCode": "mycode",
  "customExpiry": "2025-12-31T23:59:59Z"
}
```

**Backend Response:**
```json
"http://localhost:8080/mycode"
```

### Example 3: Link Expiration Error

**Frontend Request:**
```typescript
GET http://localhost:8080/abc123
```

**Backend Response:**
```
Status: 410 Gone
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 410,
  "error": "Gone",
  "message": "This link has expired: abc123"
}
```

**Frontend Handling:**
```typescript
Alert.type = "warning"
Alert.message = "This link has expired."
```

---

## 🌐 Environment Configuration

### .env Configuration (Frontend)
```bash
VITE_API_URL=http://localhost:8080      # Dev
VITE_API_URL=https://api.shrink.app     # Prod
```

### Backend Configuration (Already Set)
```properties
app.base-url=http://localhost:8080
spring.data.redis.host=localhost
spring.datasource.url=jdbc:postgresql://...
```

---

## 📚 Key Utilities

### URL Validation
```typescript
isValidUrl(url: string): boolean
// Validates HTTP/HTTPS protocol
```

### Clipboard Operations
```typescript
copyToClipboard(text: string): Promise<boolean>
// Copies to user's clipboard, shows feedback
```

### Date Formatting
```typescript
formatDate(dateString: string): string
// Formats ISO date to readable format

timeUntilExpiry(expiryDate: string): string
// Returns "3d 5h" until expiration
```

### Expiry Detection
```typescript
isUrlExpired(expiryDate: string): boolean
// Checks if URL has passed expiration date
```

---

## 🎯 User Workflows

### Workflow 1: Shorten a URL
1. User enters long URL
2. Frontend validates (client-side)
3. User clicks "Shorten URL"
4. Redux action calls backend
5. Backend returns short URL
6. State updates, success message shown
7. URL added to history table
8. localStorage persists history

### Workflow 2: Use Custom Code
1. User clicks "Show Advanced Options"
2. Enters custom code (e.g., "my-link")
3. Optionally sets expiry date
4. Submits form
5. Backend checks if code is unique
6. If taken, error shown: "Code 'my-link' already taken"
7. If available, URL shortened with custom code

### Workflow 3: Copy and Share
1. User views shortened URL
2. Clicks "Copy" button
3. URL copied to clipboard
4. Button shows "✓ Copied!" feedback
5. User pastes in email/message/social media

### Workflow 4: Track Expiration
1. URL shown in history table
2. "Expires In" column shows countdown
3. For expired URLs: Badge says "Expired"
4. User can delete expired URLs manually

---

## 🚨 Error Handling Matrix

| Error | Backend Code | Frontend Display | User Action |
|-------|--------------|-----------------|-------------|
| Invalid URL | 400 | "URL must start with http:// or https://" | Re-enter URL |
| Custom code taken | 400 | "The custom code 'xxx' is already taken" | Choose different code |
| Short code not found | 404 | "URL not found" | Verify short code |
| Link expired | 410 | "This link has expired" | Try different link |
| Server error | 500 | "An error occurred. Please try again" | Retry |
| Network error | -1 | "Network error. Check your connection" | Check connection |

---

## 🔗 Integration Checklist

- ✅ Types match backend API contract
- ✅ Request payloads exactly match backend expectations
- ✅ Error codes handled (400, 404, 410, 500)
- ✅ CORS headers configured on backend
- ✅ Validation both client & server
- ✅ Token support ready (Axios interceptor)
- ✅ localStorage for offline history
- ✅ Date parsing handles ISO 8601
- ✅ Redirect status codes handled (302)
- ✅ Environment variables configurable

---

## 📈 Monitoring & Debugging

### Redux DevTools
```bash
# Install Redux DevTools browser extension
# Monitor all state changes and dispatched actions
```

### API Logging
```typescript
// All console.logs in urlService show request/response
// Check browser DevTools Network tab for HTTP details
```

### Error Boundaries (Future)
```typescript
// Wrap main content in error boundary
// Catches runtime errors and displays graceful fallback
```

---

## 🎓 Learning Path

1. **Start**: Understand data flow (request → backend → response)
2. **Forms**: Learn React Hook Form + Zod validation
3. **State**: Study Redux slice pattern
4. **Components**: Build reusable, composable UI
5. **Services**: Abstract API calls for reusability
6. **Types**: Use TypeScript for type safety
7. **Testing**: Write tests for utilities and components

---

## 📝 Development Guidelines

### Before Adding Features
1. Verify backend API exists
2. Check data types match backend response
3. Plan Redux state shape
4. Design UI component hierarchy
5. Write Zod validation schema
6. Implement error handling

### Code Style
- Prefer functional components with hooks
- Use TypeScript for all files
- Components in `src/components/{category}/{Component}.tsx`
- Keep components under 300 lines
- Extract utility functions to `src/utils/`
- Centralize constants in `src/constants/`

### Commit Message Format
```
type(scope): brief description

[optional body]

Examples:
- feat(shorten): add custom code validation
- fix(form): handle required field validation
- refactor(store): simplify reducer logic
```

---

## 🚀 Deployment

### Build Command
```bash
npm run build
# Outputs optimized build to dist/
```

### Environment Setup
```bash
# Create .env.production
VITE_API_URL=https://api.shrink.app
```

### Vercel Deployment
```bash
# Connected to GitHub repo
# Auto-deploys on git push
# Environment variables in Vercel dashboard
```

---

## 📞 Troubleshooting

**CORS Error**: Backend doesn't allow frontend origin
→ Update CorsConfig.java with frontend URL

**401 Unauthorized**: Token missing or expired
→ Check localStorage for authToken, refresh if needed

**404 on submit**: Backend endpoint path mismatch
→ Verify API_ENDPOINTS in constants/index.ts

**Redux not updating**: Check Redux DevTools
→ Ensure action is dispatched, reducer updates state

---

## 🏁 Summary

This frontend application provides a **production-ready, enterprise-level interface** to the URL Shortener backend. It features:

✅ **Type-Safe**: Full TypeScript coverage  
✅ **Validated**: Client & server-side validation  
✅ **Performant**: Redis caching, optimized rendering  
✅ **Maintainable**: Component-based, clear separation of concerns  
✅ **Scalable**: Redux for state, service layer for APIs  
✅ **Secure**: Token interceptors, CORS validation  
✅ **User-Friendly**: Intuitive UI, error feedback, success notifications  

**Ready for production deployment and future feature expansion!**
