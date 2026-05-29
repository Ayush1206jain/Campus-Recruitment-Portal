# System Architecture - Campus Recruitment Portal

## 🏗️ High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
    end
    
    subgraph "Frontend - React App"
        B[React Components]
        C[Context API / Redux]
        D[Axios HTTP Client]
        E[React Router]
    end
    
    subgraph "Backend - Node.js + Express"
        F[API Gateway / Routes]
        G[Authentication Middleware]
        H[Controllers]
        I[Business Logic]
        J[File Upload Handler]
    end
    
    subgraph "Data Layer"
        K[(MongoDB Atlas)]
        L[Cloudinary Storage]
    end
    
    subgraph "External Services"
        M[Email Service - Nodemailer]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> K
    J --> L
    I --> M
```

## 🔄 Request Flow

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Find user by email
    Database-->>Backend: User data
    Backend->>Backend: Verify password (bcrypt)
    Backend->>Backend: Generate JWT token
    Backend-->>Frontend: Return token + user data
    Frontend->>Frontend: Store token in localStorage
    Frontend-->>User: Redirect to dashboard
```

### Job Application Flow

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant Backend
    participant Database
    participant Email
    
    Student->>Frontend: Click "Apply" on job
    Frontend->>Backend: POST /api/applications (with JWT)
    Backend->>Backend: Verify JWT token
    Backend->>Database: Check if already applied
    Database-->>Backend: No duplicate found
    Backend->>Database: Create application record
    Database-->>Backend: Application created
    Backend->>Email: Send confirmation email
    Backend-->>Frontend: Success response
    Frontend-->>Student: Show success notification
```

### Resume Upload Flow

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant Backend
    participant Multer
    participant Cloudinary
    participant Database
    
    Student->>Frontend: Select resume file
    Frontend->>Backend: POST /api/students/resume (multipart)
    Backend->>Multer: Process file upload
    Multer-->>Backend: File buffer
    Backend->>Cloudinary: Upload file
    Cloudinary-->>Backend: File URL
    Backend->>Database: Update student profile
    Database-->>Backend: Profile updated
    Backend-->>Frontend: Resume URL
    Frontend-->>Student: Show success message
```

## 🎯 Component Architecture

### Frontend Components

```mermaid
graph TD
    A[App.js] --> B[AuthContext Provider]
    B --> C[Router]
    C --> D[Public Routes]
    C --> E[Protected Routes]
    
    D --> F[Landing Page]
    D --> G[Login Page]
    D --> H[Register Page]
    
    E --> I[Student Dashboard]
    E --> J[Company Dashboard]
    E --> K[Admin Dashboard]
    
    I --> L[Profile Form]
    I --> M[Job Search]
    I --> N[Application Tracker]
    
    J --> O[Job Posting Form]
    J --> P[Applications List]
    
    K --> Q[User Management]
    K --> R[Analytics]
```

### Backend Architecture

```mermaid
graph LR
    A[Express Server] --> B[Middleware Stack]
    B --> C[CORS]
    B --> D[Helmet]
    B --> E[Morgan Logger]
    B --> F[JSON Parser]
    B --> G[Rate Limiter]
    
    A --> H[Routes]
    H --> I[Auth Routes]
    H --> J[Student Routes]
    H --> K[Company Routes]
    H --> L[Job Routes]
    H --> M[Application Routes]
    H --> N[Admin Routes]
    
    I --> O[Auth Controller]
    J --> P[Student Controller]
    K --> Q[Company Controller]
    L --> R[Job Controller]
    M --> S[Application Controller]
    N --> T[Admin Controller]
    
    O --> U[MongoDB Models]
    P --> U
    Q --> U
    R --> U
    S --> U
    T --> U
```

## 🔒 Security Architecture

```mermaid
graph TB
    A[Client Request] --> B{CORS Check}
    B -->|Allowed Origin| C[Helmet Security Headers]
    B -->|Blocked| Z[403 Forbidden]
    
    C --> D{Rate Limit Check}
    D -->|Within Limit| E[Input Validation]
    D -->|Exceeded| Y[429 Too Many Requests]
    
    E --> F{Protected Route?}
    F -->|Yes| G[JWT Verification]
    F -->|No| H[Process Request]
    
    G -->|Valid Token| I{Role Check}
    G -->|Invalid| X[401 Unauthorized]
    
    I -->|Authorized| H
    I -->|Forbidden| W[403 Forbidden]
    
    H --> J[Controller Logic]
    J --> K[Response]
```

## 📊 Data Flow

### Student Registration to Job Application

```mermaid
graph LR
    A[Student Registers] --> B[Create User Account]
    B --> C[Login with JWT]
    C --> D[Create Profile]
    D --> E[Upload Resume]
    E --> F[Browse Jobs]
    F --> G[Apply to Job]
    G --> H[Track Application]
    H --> I[Receive Status Updates]
```

### Company Job Posting to Hiring

```mermaid
graph LR
    A[Company Registers] --> B[Admin Verification]
    B --> C[Login with JWT]
    C --> D[Create Job Posting]
    D --> E[Receive Applications]
    E --> F[Review Candidates]
    F --> G[Shortlist/Reject]
    G --> H[Select Candidate]
```

## 🌐 Deployment Architecture

```mermaid
graph TB
    subgraph "Client Devices"
        A[Desktop Browser]
        B[Mobile Browser]
        C[Tablet Browser]
    end
    
    subgraph "CDN - Vercel/Netlify"
        D[React App Static Files]
        E[Images & Assets]
    end
    
    subgraph "Backend - Render/Railway"
        F[Node.js Server]
        G[Express API]
    end
    
    subgraph "Database - MongoDB Atlas"
        H[(Primary Cluster)]
        I[(Replica Set)]
    end
    
    subgraph "Cloud Storage"
        J[Cloudinary CDN]
    end
    
    A --> D
    B --> D
    C --> D
    D --> F
    F --> G
    G --> H
    H --> I
    G --> J
```

## 🔄 State Management

### Frontend State Flow (Context API)

```mermaid
graph TD
    A[AuthContext] --> B[User State]
    A --> C[Token State]
    A --> D[Loading State]
    
    B --> E[Student Dashboard]
    B --> F[Company Dashboard]
    B --> G[Admin Dashboard]
    
    C --> H[API Requests]
    H --> I[Axios Interceptor]
    I --> J[Add Token to Headers]
    
    D --> K[Loading Spinner]
```

## 📡 API Layer

### RESTful API Design

```mermaid
graph LR
    A[Frontend] -->|HTTP Requests| B[API Gateway]
    B --> C[/api/auth]
    B --> D[/api/students]
    B --> E[/api/companies]
    B --> F[/api/jobs]
    B --> G[/api/applications]
    B --> H[/api/admin]
    
    C --> I[Auth Controller]
    D --> J[Student Controller]
    E --> K[Company Controller]
    F --> L[Job Controller]
    G --> M[Application Controller]
    H --> N[Admin Controller]
    
    I --> O[(Database)]
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O
```

## 🔍 Scalability Considerations

### Current Architecture (MVP)
- **Frontend:** Single React app on Vercel
- **Backend:** Single Node.js server on Render
- **Database:** MongoDB Atlas (shared cluster)
- **File Storage:** Cloudinary free tier

### Future Scalability (Production)

```mermaid
graph TB
    subgraph "Load Balancer"
        A[Nginx / AWS ALB]
    end
    
    subgraph "Backend Servers"
        B[Node.js Instance 1]
        C[Node.js Instance 2]
        D[Node.js Instance 3]
    end
    
    subgraph "Caching Layer"
        E[Redis Cache]
    end
    
    subgraph "Database"
        F[(MongoDB Primary)]
        G[(MongoDB Secondary 1)]
        H[(MongoDB Secondary 2)]
    end
    
    subgraph "Message Queue"
        I[RabbitMQ / Kafka]
    end
    
    A --> B
    A --> C
    A --> D
    
    B --> E
    C --> E
    D --> E
    
    B --> F
    C --> F
    D --> F
    
    F --> G
    F --> H
    
    B --> I
    C --> I
    D --> I
```

## 🛡️ Error Handling Flow

```mermaid
graph TD
    A[Request] --> B[Try Block]
    B -->|Success| C[Send Response]
    B -->|Error| D[Catch Block]
    
    D --> E{Error Type}
    E -->|Validation Error| F[400 Bad Request]
    E -->|Auth Error| G[401 Unauthorized]
    E -->|Permission Error| H[403 Forbidden]
    E -->|Not Found| I[404 Not Found]
    E -->|Server Error| J[500 Internal Error]
    
    F --> K[Error Middleware]
    G --> K
    H --> K
    I --> K
    J --> K
    
    K --> L[Log Error]
    L --> M[Send Error Response]
```

## 📈 Performance Optimization

### Optimization Strategies

1. **Database:**
   - Indexing on frequently queried fields
   - Query optimization with projections
   - Connection pooling

2. **Backend:**
   - Response compression (gzip)
   - Caching with Redis
   - Pagination for large datasets

3. **Frontend:**
   - Code splitting
   - Lazy loading components
   - Image optimization
   - Memoization (React.memo, useMemo)

4. **Network:**
   - CDN for static assets
   - HTTP/2
   - Minification and bundling

## 🔐 Authentication Architecture

```mermaid
graph TD
    A[User Login] --> B[Backend Validates Credentials]
    B --> C{Valid?}
    C -->|Yes| D[Generate JWT Token]
    C -->|No| E[Return 401 Error]
    
    D --> F[Token Contains: user_id, role, exp]
    F --> G[Send Token to Frontend]
    G --> H[Store in localStorage]
    
    H --> I[Subsequent Requests]
    I --> J[Add Token to Authorization Header]
    J --> K[Backend Middleware Verifies Token]
    
    K --> L{Valid & Not Expired?}
    L -->|Yes| M[Attach User to Request]
    L -->|No| N[Return 401 Error]
    
    M --> O[Check Role Permissions]
    O --> P{Authorized?}
    P -->|Yes| Q[Process Request]
    P -->|No| R[Return 403 Error]
```

## 💡 Key Architectural Decisions

### Why This Architecture?

1. **Separation of Concerns:** Frontend and backend are decoupled
2. **Scalability:** Each layer can scale independently
3. **Maintainability:** Clear structure makes code easy to understand
4. **Security:** Multiple layers of protection (JWT, CORS, rate limiting)
5. **Performance:** CDN, caching, and optimization strategies
6. **Cost-Effective:** Uses free tiers for MVP, easy to upgrade

### Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| MongoDB | Flexible schema | No ACID transactions |
| JWT | Stateless, scalable | Can't revoke tokens easily |
| Cloudinary | Easy file management | Vendor lock-in |
| Context API | Simple state management | Not ideal for very large apps |
| Vercel/Render | Easy deployment | Less control than AWS |

---

**Last Updated:** February 2024  
**Version:** 1.0
