# 🔗 Shrinker - URL Shortener Service

A modern, production-ready URL shortening service built with React + TypeScript on the frontend and Spring Boot on the backend. Shrinker provides fast, reliable URL shortening with custom codes, expiration dates, and Redis caching.

**Live Demo:** https://shrinker-lac.vercel.app

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## ✨ Features

### Core Functionality
- ✅ **URL Shortening** - Convert long URLs to short, shareable links
- ✅ **Custom Codes** - Users can define custom short codes (3-20 characters)
- ✅ **Expiration Dates** - Set custom expiration dates or use default (6 months)
- ✅ **Deduplication** - Return existing short code if same URL is submitted again
- ✅ **URL History** - Track all shortened URLs with timestamps
- ✅ **Click Analytics** - Ready for click tracking (future implementation)

### Performance
- ✅ **Redis Caching** - 30-day TTL for frequently accessed URLs
- ✅ **Base62 Encoding** - Efficient short code generation
- ✅ **Database Optimization** - PostgreSQL with proper indexing

### User Experience
- ✅ **Responsive Design** - Mobile, tablet, and desktop support
- ✅ **Copy to Clipboard** - One-click URL copying
- ✅ **Real-time Validation** - Client-side form validation with Zod
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Loading States** - Visual feedback during operations

### Enterprise Ready
- ✅ **TypeScript** - 100% type safety
- ✅ **CORS Support** - Configured for multiple origins
- ✅ **Authentication Ready** - Token interceptors in place
- ✅ **Comprehensive Logging** - Backend logging for debugging
- ✅ **Environment Configuration** - Easy deployment across environments

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 19.2.6 |
| **TypeScript** | Type Safety | 5.3.3 |
| **Vite** | Build Tool | 8.0.12 |
| **Redux Toolkit** | State Management | 2.1.0 |
| **React Hook Form** | Form Handling | 7.52.0 |
| **Zod** | Validation | 3.23.8 |
| **Axios** | HTTP Client | 1.7.7 |
| **TailwindCSS** | Styling | 3.4.3 |
| **React Router** | Routing | 7.1.0 |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Spring Boot** | Framework | 3.5.14 |
| **Java** | Language | 21 |
| **PostgreSQL** | Database | Latest |
| **Redis** | Cache | Latest |
| **Spring Data JPA** | ORM | Included |
| **Lombok** | Boilerplate Reduction | Latest |

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                React Frontend                        │
│  (Vite + React Router + Redux + TailwindCSS)       │
└──────────────┬──────────────────────────────────────┘
               │ HTTP/REST (Axios)
               ↓
┌─────────────────────────────────────────────────────┐
│           Spring Boot Backend (Port 8080)           │
│  ┌──────────────────────────────────────────────┐   │
│  │  UrlController                               │   │
│  │  POST /api/shorten  →  UrlService            │   │
│  │  GET /{shortCode}   →  Redirect              │   │
│  └──────────────────────────────────────────────┘   │
│                   ↓                                   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Data Layer                                  │   │
│  │  ├─ PostgreSQL (Persistent Storage)          │   │
│  │  └─ Redis (30-day Cache)                     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input → Form Validation → Redux Action → API Call
                                              ↓
                                    Backend Processing
                                    (Validation, DB Save)
                                              ↓
                                    Response with Short URL
                                              ↓
                                    Redux State Update
                                              ↓
                                    localStorage Persistence
                                              ↓
                                    UI Re-render
```

---

## 📦 Prerequisites

### System Requirements
- **Node.js** 18+ (for frontend)
- **Java** 21 (for backend)
- **Maven** 3.8+ (for building backend)
- **PostgreSQL** 12+ (for database)
- **Redis** 6+ (for caching, optional for local development)

### Installation Check
```bash
# Check Node.js
node --version  # Should be v18+

# Check Java
java -version   # Should be 21+

# Check Maven
mvn --version   # Should be 3.8+

# Check PostgreSQL
psql --version  # Should be 12+
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ankush-singh/shrinker.git
cd Shrinker
```

### 2. Setup Backend

```bash
cd Backend

# Create .env file with configuration
cat > .env << EOF
DB_URL=jdbc:postgresql://localhost:5432/shrinker_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_SSL=false
APP_BASE_URL=http://localhost:8080
EOF

# Install dependencies
mvn clean install

# Build the project
mvn clean package
```

### 3. Setup Frontend

```bash
cd ../Frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8080
EOF

# Verify setup
npm run type-check
```

---

## ▶️ Running the Application

### Option 1: Local Development (Recommended)

#### Prerequisites
- PostgreSQL running on localhost:5432
- Redis running on localhost:6379 (optional, required for caching)

#### Start Backend
```bash
cd Backend
mvn spring-boot:run
# Backend available at http://localhost:8080
```

#### Start Frontend (New Terminal)
```bash
cd Frontend
npm run dev
# Frontend available at http://localhost:5173
```

#### Verify Both Are Running
```bash
# Backend health check
curl http://localhost:8080/actuator/health 2>/dev/null || echo "Check backend"

# Frontend check
curl http://localhost:5173 2>/dev/null || echo "Frontend ready"
```

### Option 2: Production Build

#### Build Backend
```bash
cd Backend
mvn clean package -DskipTests
java -jar target/url-shortener-0.0.1-SNAPSHOT.jar
```

#### Build Frontend
```bash
cd Frontend
npm run build
npm run preview  # Preview production build locally
```

### Option 3: Docker (Future)

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up
```

---

## 📁 Project Structure

### Backend
```
Backend/
├── src/
│   ├── main/
│   │   ├── java/com/ankush/shortener/
│   │   │   ├── UrlShortenerApplication.java      # Main app entry
│   │   │   ├── controller/
│   │   │   │   └── UrlController.java            # REST endpoints
│   │   │   ├── service/
│   │   │   │   └── UrlService.java               # Business logic
│   │   │   ├── repository/
│   │   │   │   └── UrlRepository.java            # Data access
│   │   │   ├── model/
│   │   │   │   └── Url.java                      # Entity model
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java               # CORS setup
│   │   │   │   ├── RedisConfig.java              # Redis setup
│   │   │   │   ├── EnvConfig.java                # Environment
│   │   │   │   └── DotenvPropertySourceFactory.java
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java   # Error handling
│   │   │   │   ├── UrlNotFoundException.java
│   │   │   │   └── UrlExpiredException.java
│   │   │   └── util/
│   │   │       └── Base62Utils.java              # URL encoding
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── .env
└── Dockerfile

Frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── index.tsx                         # Button, Alert, Card, Badge
│   │   ├── forms/
│   │   │   └── ShortenUrlForm.tsx                # URL shortening form
│   │   ├── layout/
│   │   │   └── Layout.tsx                        # Header, footer wrapper
│   │   └── tables/
│   │       └── UrlHistoryTable.tsx               # History display
│   ├── pages/
│   │   └── HomePage.tsx                          # Main dashboard
│   ├── store/
│   │   ├── index.ts                              # Redux store
│   │   └── slices/
│   │       └── shortenSlice.ts                   # URL state logic
│   ├── services/
│   │   ├── apiClient.ts                          # Axios config
│   │   └── urlService.ts                         # API calls
│   ├── hooks/
│   │   └── useRedux.ts                           # Custom hooks
│   ├── types/
│   │   └── index.ts                              # TypeScript types
│   ├── utils/
│   │   ├── index.ts                              # Utilities
│   │   └── validation.ts                         # Zod schemas
│   ├── constants/
│   │   └── index.ts                              # App constants
│   ├── routes/
│   │   └── index.tsx                             # Router setup
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

---

## 📡 API Documentation

### Endpoints

#### 1. Shorten URL

**Request**
```http
POST /api/shorten
Content-Type: application/json

{
  "longUrl": "https://example.com/very/long/url",
  "customCode": "mycode",           // Optional
  "customExpiry": "2025-12-31T23:59:59Z"  // Optional (ISO 8601)
}
```

**Response (200 OK)**
```json
"http://localhost:8080/mycode"
```

**Error Response (400 Bad Request)**
```json
{
  "timestamp": "2025-05-24T22:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "The custom code 'mycode' is already taken!"
}
```

**Status Codes**
- `200 OK` - Successfully shortened
- `400 Bad Request` - Invalid input or code already taken
- `500 Internal Server Error` - Server error

---

#### 2. Redirect to Original URL

**Request**
```http
GET /abc123
```

**Response (302 Found)**
```
Location: https://example.com/very/long/url
```

**Error Responses**
- `404 Not Found` - Short code doesn't exist
- `410 Gone` - Link has expired
- `500 Internal Server Error` - Server error

---

### Request/Response Examples

#### Example 1: Basic URL Shortening
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://google.com"}'

# Response: "http://localhost:8080/aBc123"
```

#### Example 2: Custom Code & Expiry
```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "longUrl": "https://mysite.com",
    "customCode": "mylink",
    "customExpiry": "2025-12-31T23:59:59Z"
  }'

# Response: "http://localhost:8080/mylink"
```

#### Example 3: Redirect
```bash
curl -L http://localhost:8080/abc123
# Redirects to original URL
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```properties
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/shrinker_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_SSL=false

# Application Configuration
APP_BASE_URL=http://localhost:8080
```

#### Frontend (.env)
```properties
# API Configuration
VITE_API_URL=http://localhost:8080
```

### Database Setup

#### PostgreSQL
```bash
# Create database
createdb shrinker_db

# Connect
psql -U postgres -d shrinker_db

# Tables are auto-created via Hibernate (spring.jpa.hibernate.ddl-auto=update)
```

#### Redis (Optional for local development)
```bash
# Start Redis server
redis-server

# Verify connection
redis-cli ping  # Should return "PONG"
```

---

## 👨‍💻 Development Guide

### Adding a New Feature

1. **Design Phase**
   - Define API contract
   - Plan data model changes
   - Design UI mockups

2. **Backend Implementation**
   - Create/update entity model
   - Implement service logic
   - Add API endpoint
   - Write tests

3. **Frontend Implementation**
   - Create TypeScript types matching backend
   - Implement API service call
   - Add Redux slice for state
   - Create components
   - Add validation with Zod

4. **Testing**
   - Test backend API with curl/Postman
   - Test frontend form validation
   - Test end-to-end flow
   - Check error handling

### Code Standards

#### Backend (Java)
```java
// Use Lombok to reduce boilerplate
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MyEntity {
    // Properties here
}

// Use meaningful variable names
String originalUrl = request.getLongUrl();

// Handle exceptions explicitly
try {
    // operation
} catch (Exception e) {
    logger.error("Error occurred", e);
    throw new CustomException("User-friendly message");
}
```

#### Frontend (TypeScript)
```typescript
// Always use type annotations
const handleClick = (id: number): void => {
    // Implementation
}

// Use interfaces for props
interface MyComponentProps {
    title: string
    onSubmit: (data: FormData) => Promise<void>
}

// Export types
export type MyType = z.infer<typeof mySchema>
```

### Running Tests

```bash
# Backend tests
cd Backend
mvn test

# Frontend tests (when added)
cd Frontend
npm test
```

### Building

```bash
# Backend JAR
cd Backend
mvn clean package

# Frontend production build
cd Frontend
npm run build
# Output: dist/
```

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start

**Issue**: `BeanDefinitionStoreException: Failed to parse configuration class`

**Solution**:
```bash
# Ensure .env file exists in Backend directory
cd Backend
ls -la .env

# Or create it
cat > .env << EOF
DB_URL=jdbc:postgresql://localhost:5432/shrinker_db
DB_USERNAME=postgres
DB_PASSWORD=password
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_SSL=false
APP_BASE_URL=http://localhost:8080
EOF

# Try starting again
mvn spring-boot:run
```

#### CORS Error in Frontend

**Issue**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
```bash
# Update VITE_API_URL in Frontend/.env
VITE_API_URL=http://localhost:8080

# Backend CORS is already configured for:
# - http://localhost:5173 (dev)
# - http://localhost:4173 (preview)
# - https://shrink-frontend.vercel.app (production)
```

#### PostgreSQL Connection Error

**Issue**: `Connection refused`

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# If not running, start it:
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Use PostgreSQL installer or pgAdmin
```

#### Redis Connection Error

**Issue**: `Cannot get a resource, pool error`

**Solution**:
```bash
# Redis is optional - backend will work without it (no caching)
# To use caching, start Redis:

redis-server

# Verify:
redis-cli ping  # Should return PONG
```

#### Port Already in Use

**Issue**: `Address already in use: PORT 8080`

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port:
java -jar app.jar --server.port=8081
```

#### Frontend Type Errors

**Issue**: TypeScript compilation errors

**Solution**:
```bash
cd Frontend

# Check TypeScript
npm run type-check

# Fix issues
# - Ensure imports use 'type' for types: import type { MyType }
# - Verify all exports are present
# - Check file paths

# Rebuild
npm run build
```

---

## 📊 Monitoring

### Backend Monitoring

```bash
# Health check
curl http://localhost:8080/actuator/health

# Metrics
curl http://localhost:8080/actuator/metrics

# Environment
curl http://localhost:8080/actuator/env | jq '.propertySources[] | .properties'
```

### Frontend Monitoring

```bash
# Redux DevTools Extension
# Install: https://redux-devtools-extension.github.io/
# Monitor state changes in browser DevTools

# Network debugging
# Open DevTools → Network tab → Check API calls
```

---

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/my-feature
   ```
3. Make your changes
4. Commit with clear messages
   ```bash
   git commit -m "feat: add new feature"
   ```
5. Push to your fork
6. Create a Pull Request

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore
**Example**: `feat(shortener): add custom expiry date support`

### Code Review Checklist

- [ ] Code follows project standards
- [ ] Tests pass locally
- [ ] TypeScript has no errors
- [ ] No console errors/warnings
- [ ] Commit messages are clear
- [ ] Documentation is updated

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Author

**Anubhav Singh**
- GitHub: [@anubhav-singh](https://github.com/anub1004)
- Email: anubhavsingh6260@gmail.com

---

## 🔗 Resources

### Documentation
- [Frontend Architecture](Frontend/ARCHITECTURE.md)
- [Frontend API Integration](Frontend/API_INTEGRATION.md)
- [Frontend Quick Start](Frontend/QUICKSTART.md)
- [Frontend Cheat Sheet](Frontend/CHEATSHEET.md)

### External Links
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

---

## 📞 Support

For issues, questions, or suggestions:

1. **GitHub Issues** - Report bugs or request features
2. **Discussions** - Ask questions and share ideas
3. **Email** - Contact directly for urgent matters

---

## ✅ Checklist for New Developers

- [ ] Cloned repository
- [ ] Installed Node.js 18+
- [ ] Installed Java 21
- [ ] Installed Maven 3.8+
- [ ] Installed PostgreSQL
- [ ] Created .env files (Backend & Frontend)
- [ ] Backend `mvn clean install` successful
- [ ] Frontend `npm install` successful
- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:5173
- [ ] Can shorten a URL successfully
- [ ] Read contributing guidelines

---

**Last Updated:** May 24, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
