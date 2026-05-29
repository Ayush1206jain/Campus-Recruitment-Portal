# Campus Recruitment System

A full-stack Campus Recruitment Platform that connects Students, Companies, and Administrators through a centralized recruitment portal. The system enables job posting, application management, resume uploads, candidate tracking, and role-based dashboards.

---

## Features

### Student Module

- Student Registration & Login
- Profile Management
- Resume Upload
- Job Search & Filtering
- Job Application Tracking
- Application Status Monitoring

### Company Module

- Company Registration & Login
- Job Posting Management
- Applicant Review
- Candidate Selection Workflow
- Application Status Updates

### Admin Module

- User Management
- Platform Monitoring
- Recruitment Analytics
- System Administration

---

## Technology Stack

### Frontend

- React.js
- React Router
- Context API
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- Bcrypt Password Hashing

### Database

- MongoDB Atlas
- Mongoose ODM

### Cloud Services

- Cloudinary (Resume Storage)
- Nodemailer (Email Notifications)

### Security

- JWT Authentication
- Helmet Security Headers
- CORS Protection
- Rate Limiting
- Role-Based Access Control

---

## Project Structure

```text
docs/
├── architecture/
├── specifications/
├── workflows/

frontend/
backend/
```

---

## System Architecture

### High-Level Architecture

The application follows a three-tier architecture:

- React Frontend
- Express Backend API
- MongoDB Database

Additional services:

- Cloudinary Storage
- Email Notification Service

Detailed architecture diagrams can be found in:

```text
docs/architecture/
```

---

## Architecture Documentation

### Available Diagrams

#### Architecture Diagrams

- High-Level System Architecture
- Backend Architecture
- Frontend Architecture
- Deployment Architecture
- Security Architecture

Location:

```text
docs/architecture/
```

---

### Workflow Diagrams

The project contains detailed workflow diagrams for major business processes:

- User Authentication Flow
- Job Application Flow
- Resume Upload Flow
- Application Review / Hiring Flow

Location:

```text
docs/workflows/
```

---

## Screenshots

### Login Page

![Login Page](docs/screenshots/login-page.png)

### Student Dashboard

![Student Dashboard](docs/screenshots/student-dashboard.png)

### Company Dashboard

![Company Dashboard](docs/screenshots/company-dashboard.png)

### Admin Dashboard

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

## Technical Documentation

### System Architecture Specification

Complete architecture documentation including:

- Component Design
- Request Flow
- Security Architecture
- Deployment Architecture
- Authentication Design

Location:

```text
docs/specifications/system-architecture.md
```

### Database Documentation

Contains:

- Collection Schemas
- Entity Relationships
- Validation Rules
- Indexing Strategy
- Query Optimization

Location:

```text
docs/specifications/database-schema.md
```

---

## Authentication Flow

1. User enters credentials.
2. Frontend sends login request.
3. Backend validates credentials.
4. JWT token is generated.
5. Token is stored on the client.
6. Protected routes are accessed using JWT authentication.

---

## Security Features

- JWT-based Authentication
- Password Hashing using Bcrypt
- Protected API Routes
- Role-Based Authorization
- CORS Configuration
- Helmet Security Middleware
- API Rate Limiting
- Input Validation

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd campus-recruitment-system
```

### Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

### Run Application

#### Backend

```bash
npm run server
```

#### Frontend

```bash
npm start
```

---

## Future Enhancements

- Interview Scheduling
- Placement Analytics Dashboard
- Resume Parsing
- AI-Based Candidate Matching
- Notification Center
- Real-Time Messaging

---
