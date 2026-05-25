# API Integration Guide

## Backend API Contract

This document specifies the exact integration contract between frontend and backend.

### Base URL Configuration

```typescript
// src/constants/index.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

**Environment Setup:**
```bash
# .env (development)
VITE_API_URL=http://localhost:8080

# .env.production (deployed)
VITE_API_URL=https://your-production-api.com
```

---

## Endpoint 1: POST /api/shorten

### Purpose
Create a shortened URL from a long URL with optional customization.

### Request Contract

```typescript
interface ShortenUrlRequest {
  longUrl: string;           // Required: Must start with http:// or https://
  customCode?: string | null;  // Optional: Custom short code (3-20 chars, alphanumeric)
  customExpiry?: string | null; // Optional: ISO 8601 expiry date
}
```

### Request Example

**Basic Shortening:**
```bash
POST http://localhost:8080/api/shorten
Content-Type: application/json

{
  "longUrl": "https://www.example.com/very/long/url/path?param=value",
  "customCode": null,
  "customExpiry": null
}
```

**With Custom Code:**
```bash
POST http://localhost:8080/api/shorten
Content-Type: application/json

{
  "longUrl": "https://my-company.com/article/2025",
  "customCode": "company-article",
  "customExpiry": null
}
```

**With Expiry:**
```bash
POST http://localhost:8080/api/shorten
Content-Type: application/json

{
  "longUrl": "https://limited-offer.com",
  "customCode": "summer-sale",
  "customExpiry": "2025-08-31T23:59:59Z"
}
```

### Response Contract

**Success (HTTP 200):**
```
String response body:
"http://localhost:8080/abc123"
```

### Frontend Processing
```typescript
const shortUrl = await urlService.shortenUrl({
  longUrl: "https://example.com",
  customCode: null,
  customExpiry: null
});
// Returns: "http://localhost:8080/abc123"

// Extract short code
const shortCode = shortUrl.split('/').pop(); // "abc123"

// Create UrlHistory entry
const urlHistory = {
  id: Date.now(),
  longUrl: "https://example.com",
  shortCode: "abc123",
  shortUrl: "http://localhost:8080/abc123",
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
  isExpired: false
};

// Store in Redux + localStorage
store.shorten.urls.unshift(urlHistory);
```

### Error Responses

**HTTP 400 - Bad Request**

Invalid URL:
```json
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "longUrl must start with http:// or https://"
}
```

Custom code already taken:
```json
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "The custom code 'company-article' is already taken!"
}
```

Empty URL:
```json
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "longUrl cannot be empty"
}
```

**HTTP 500 - Server Error**
```json
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Database connection failed"
}
```

### Frontend Error Handling

```typescript
export const shortenUrl = createAsyncThunk(
  'shorten/shortenUrl',
  async (payload, { rejectWithValue }) => {
    try {
      const shortUrl = await urlService.shortenUrl(payload);
      return newUrl; // Success
    } catch (error: any) {
      // Extract backend error message
      const message = error.response?.data?.message || 'Failed to shorten URL';
      
      // Map to user-friendly message
      if (message.includes('already taken')) {
        return rejectWithValue('This custom code is already in use.');
      }
      if (message.includes('http')) {
        return rejectWithValue('Please enter a valid URL starting with http:// or https://');
      }
      
      return rejectWithValue(message);
    }
  }
);
```

---

## Endpoint 2: GET /{shortCode}

### Purpose
Redirect user to original URL using the short code.

### Request Contract

```typescript
GET /abc123
```

### Response Types

**Success - HTTP 302 Found**
```
Location: https://www.example.com/very/long/url/path?param=value
```

Browser automatically follows redirect to original URL.

**Not Found - HTTP 404**
```json
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "No URL found for code: abc123"
}
```

**Expired - HTTP 410 Gone**
```json
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 410,
  "error": "Gone",
  "message": "This link has expired: abc123"
}
```

### Frontend Behavior

Frontend typically doesn't call this endpoint directly (browser handles redirects). However, for manual verification:

```typescript
try {
  const originalUrl = await urlService.getOriginalUrl('abc123');
  // Redirect to original
  window.location.href = originalUrl;
} catch (error) {
  if (error.response?.status === 404) {
    showAlert('Short code not found');
  } else if (error.response?.status === 410) {
    showAlert('This link has expired');
  }
}
```

---

## Request/Response Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User enters URL in form                                │
│     ↓                                                       │
│  2. Form validation (Zod schema)                           │
│     ↓                                                       │
│  3. Dispatch shortenUrl action                             │
│     ↓                                                       │
│  4. Axios POST to /api/shorten                             │
│     ├─ Add CORS headers automatically                      │
│     ├─ Add Authorization header (if token exists)          │
│     └─ Set Content-Type: application/json                  │
│     ↓                                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                 Backend (Spring Boot)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. CorsFilter validates request origin                    │
│  2. UrlController receives POST /api/shorten               │
│  3. UrlRequest validation:                                 │
│     ├─ Check longUrl is not empty                          │
│     ├─ Check URL starts with http:// or https://           │
│     └─ Return 400 if invalid                               │
│  4. UrlService.shortenUrl() called                         │
│     ├─ If customCode: Check uniqueness in DB               │
│     ├─ Else: Check for deduplication (same URL)            │
│     ├─ If new: Save URL + generate Base62 code             │
│     ├─ If custom expiry: Use it; else default 6 months     │
│     └─ Return short code                                   │
│  5. Redis caching (30-day TTL) set up                       │
│  6. Return "http://baseUrl/{shortCode}"                     │
│     ↓                                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓ JSON String
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. shortenUrl thunk fulfilled                             │
│  2. Create UrlHistory object from response                 │
│  3. Dispatch reducer: ADD_TO_HISTORY                       │
│  4. Save to localStorage                                   │
│  5. Show success message                                   │
│  6. Update UI:                                             │
│     ├─ Display lastShortenedUrl card                       │
│     ├─ Add entry to history table                          │
│     └─ Update stats (total URLs count)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## HTTP Headers Exchange

### Request Headers (Frontend → Backend)

```http
POST /api/shorten HTTP/1.1
Host: localhost:8080
Origin: http://localhost:5173
Content-Type: application/json
Content-Length: 123
Authorization: Bearer eyJhbGciOiJIUzI1NiIs... (if token exists)

{
  "longUrl": "https://example.com",
  "customCode": null,
  "customExpiry": null
}
```

### Response Headers (Backend → Frontend)

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
Date: Fri, 24 May 2025 22:00:00 GMT
Content-Length: 30

"http://localhost:8080/abc123"
```

---

## Validation Rules Matrix

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| longUrl | String | ✅ | Min 1 char, http/https protocol | "longUrl cannot be empty" or "longUrl must start with http:// or https://" |
| customCode | String | ❌ | 3-20 chars if provided, alphanumeric, unique | "custom code must be 3-20 chars" or "custom code already taken" |
| customExpiry | String | ❌ | ISO 8601 format, future date | Backend validates; frontend shows date picker |

---

## Caching Strategy

### Redis Cache (Backend)
```
On successful GET /{shortCode}:
- Cache key: {shortCode}
- Cache value: {originalUrl}
- TTL: 30 days
- Cache miss → Query PostgreSQL → Update cache
- Subsequent requests within 30 days use cache
```

### Frontend Cache (localStorage)
```
On successful POST /api/shorten:
- Store entire UrlHistory array in localStorage
- Key: "urlHistory"
- Persists across browser sessions
- User can delete entries manually
- Clear all via "Clear History" button
```

### Browser Cache
```
GET requests handled by browser
- 302 redirects followed automatically
- 404/410 errors shown in browser
```

---

## Security Considerations

### CORS Validation
```
Backend CorsConfig.java allows:
- http://localhost:5173 (dev)
- http://localhost:4173 (Vite preview)
- https://shrink-frontend.vercel.app (prod)
```

### Input Validation
```
Frontend (Zod):
- URL format validation
- Custom code length validation

Backend (Spring Boot):
- String null checks
- Protocol validation (http/https)
- Custom code uniqueness check
- URL length validation
```

### Future Auth Support
```
Token Storage: localStorage['authToken']
Axios Interceptor adds: Authorization: Bearer {token}
Backend validates token on requests
401 Unauthorized → Clear token & redirect to login
```

---

## Testing the Integration

### Manual Testing

**1. Test basic shortening:**
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://google.com", "customCode": null, "customExpiry": null}'
# Expected: "http://localhost:8080/{shortCode}"
```

**2. Test with custom code:**
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://google.com", "customCode": "mycode", "customExpiry": null}'
# Expected: "http://localhost:8080/mycode"
```

**3. Test code already taken:**
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://google.com", "customCode": "mycode", "customExpiry": null}'
# Expected: 400 error - code already taken
```

**4. Test invalid URL:**
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "not-a-url", "customCode": null, "customExpiry": null}'
# Expected: 400 error - must start with http://
```

**5. Test redirect:**
```bash
curl -i http://localhost:8080/{shortCode}
# Expected: 302 redirect to original URL
```

---

## Troubleshooting

### CORS Error: "Access-Control-Allow-Origin missing"
**Cause**: Backend CORS not configured for frontend origin  
**Solution**: Update CorsConfig.java with frontend URL

### 400 Error: "longUrl cannot be empty"
**Cause**: Form validation passed empty string  
**Solution**: Check form validation triggers on submit

### 400 Error: "custom code already taken"
**Cause**: Attempting duplicate custom code  
**Solution**: Display error message, suggest different code

### 404 Error: "No URL found for code"
**Cause**: Short code doesn't exist or was never created  
**Solution**: Verify short code format, suggest trying again

### 410 Error: "This link has expired"
**Cause**: URL expiration date passed  
**Solution**: Backend deleted entry, show expiry message

### Network Timeout
**Cause**: Backend not running or unreachable  
**Solution**: Ensure backend started: `mvn spring-boot:run`

---

## Version Compatibility

| Component | Version | Notes |
|-----------|---------|-------|
| Spring Boot | 3.5.14 | Java 21 |
| React | 19.2.6 | Latest stable |
| Axios | 1.7.7 | REST client |
| Redux Toolkit | 2.1.0 | State management |
| TypeScript | 5.3.3 | Type safety |

---

## Future Enhancements

- [ ] JWT authentication endpoint
- [ ] Analytics/click tracking endpoint
- [ ] Batch URL shortening
- [ ] QR code generation
- [ ] URL expiry notifications
- [ ] Advanced filtering API
- [ ] User accounts & link ownership
- [ ] Custom domain support
