# Database Schema - Campus Recruitment Portal

## 📊 Overview

The database uses **MongoDB** with **Mongoose ODM** for schema validation and relationships.

**Total Collections:** 5
- Users
- Students
- Companies
- Jobs
- Applications

## 🗂️ Collections & Relationships

```mermaid
UserDiagram
    User ||--o| Student : "has profile"
    User ||--o| Company : "has profile"
    Company ||--o{ Job : "posts"
    Student ||--o{ Application : "submits"
    Job ||--o{ Application : "receives"
    
    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        enum role
        date createdAt
    }
    
    Student {
        ObjectId _id PK
        ObjectId user FK
        string phone
        string college
        string branch
        float cgpa
        int graduationYear
        array skills
        string resume
        date createdAt
    }
    
    Company {
        ObjectId _id PK
        ObjectId user FK
        string website
        string industry
        string size
        string description
        string logo
        boolean verified
        date createdAt
    }
    
    Job {
        ObjectId _id PK
        ObjectId company FK
        string title
        string location
        string salary
        string description
        array requirements
        object eligibility
        date deadline
        boolean isActive
        date createdAt
    }
    
    Application {
        ObjectId _id PK
        ObjectId student FK
        ObjectId job FK
        enum status
        date appliedAt
        date updatedAt
    }
```

## 📝 Detailed Schemas

### 1. User Collection

**Purpose:** Base authentication for all user types

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false  // Don't return in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'company', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `email` - Unique index for fast login lookups
- `role` - For filtering users by type

**Middleware:**
- Pre-save: Hash password using bcrypt before saving
- Method: `comparePassword(enteredPassword)` - Compare hashed passwords

**Example Document:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...",
  "role": "student",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### 2. Student Collection

**Purpose:** Extended profile for students

```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: {
    type: String,
    match: /^[+]?[\d\s-()]+$/
  },
  college: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  graduationYear: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  skills: [{
    type: String,
    trim: true
  }],
  resume: {
    type: String,  // Cloudinary URL
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `user` - Unique index, one profile per user
- `graduationYear` - For filtering eligible students
- `cgpa` - For eligibility checks

**Virtuals:**
- `isEligible(job)` - Check if student meets job eligibility

**Example Document:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j1",
  "user": "64f5a1b2c3d4e5f6g7h8i9j0",
  "phone": "+91 9876543210",
  "college": "NITK Surathkal",
  "branch": "Computer Science",
  "cgpa": 8.5,
  "graduationYear": 2024,
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "resume": "https://res.cloudinary.com/xyz/resume.pdf",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-02-01T14:30:00Z"
}
```

---

### 3. Company Collection

**Purpose:** Extended profile for companies

```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  website: {
    type: String,
    match: /^https?:\/\/.+/
  },
  industry: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-100', '101-500', '500+'],
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  logo: {
    type: String,  // Cloudinary URL
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `user` - Unique index
- `verified` - For filtering approved companies

**Example Document:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j2",
  "user": "64f5a1b2c3d4e5f6g7h8i9j3",
  "website": "https://techcorp.com",
  "industry": "Software Development",
  "size": "101-500",
  "description": "Leading tech company specializing in AI solutions",
  "logo": "https://res.cloudinary.com/xyz/logo.png",
  "verified": true,
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-12T10:00:00Z"
}
```

---

### 4. Job Collection

**Purpose:** Job postings by companies

```javascript
{
  _id: ObjectId,
  company: {
    type: ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  requirements: [{
    type: String,
    trim: true
  }],
  eligibility: {
    minCGPA: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    branches: [{
      type: String
    }],
    graduationYear: [{
      type: Number
    }]
  },
  deadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `company` - For fetching company's jobs
- `title` - Text index for search
- `deadline` - For filtering active jobs
- `createdAt` - For sorting by date

**Virtuals:**
- `applicationsCount` - Count of applications via virtual populate

**Example Document:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j4",
  "company": "64f5a1b2c3d4e5f6g7h8i9j2",
  "title": "Software Developer",
  "location": "Bangalore",
  "salary": "8-12 LPA",
  "description": "We are looking for skilled developers...",
  "requirements": ["JavaScript", "React", "Node.js", "MongoDB"],
  "eligibility": {
    "minCGPA": 7.0,
    "branches": ["CSE", "IT", "ECE"],
    "graduationYear": [2024, 2025]
  },
  "deadline": "2024-03-31T23:59:59Z",
  "isActive": true,
  "createdAt": "2024-02-01T10:00:00Z",
  "updatedAt": "2024-02-01T10:00:00Z"
}
```

---

### 5. Application Collection

**Purpose:** Track student job applications

```javascript
{
  _id: ObjectId,
  student: {
    type: ObjectId,
    ref: 'Student',
    required: true
  },
  job: {
    type: ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'selected'],
    default: 'applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Indexes:**
- `student` - For fetching student's applications
- `job` - For fetching job's applications
- `{ student: 1, job: 1 }` - **Compound unique index** to prevent duplicate applications
- `status` - For filtering by status

**Middleware:**
- Pre-save: Update `updatedAt` timestamp

**Example Document:**
```json
{
  "_id": "64f5a1b2c3d4e5f6g7h8i9j5",
  "student": "64f5a1b2c3d4e5f6g7h8i9j1",
  "job": "64f5a1b2c3d4e5f6g7h8i9j4",
  "status": "shortlisted",
  "appliedAt": "2024-02-15T14:30:00Z",
  "updatedAt": "2024-02-20T10:00:00Z"
}
```

---

## 🔗 Relationships

### One-to-One
- **User → Student:** One user can have one student profile
- **User → Company:** One user can have one company profile

### One-to-Many
- **Company → Jobs:** One company can post multiple jobs
- **Student → Applications:** One student can submit multiple applications
- **Job → Applications:** One job can receive multiple applications

## 📈 Indexing Strategy

### Primary Indexes (Automatic)
- `_id` on all collections

### Custom Indexes

| Collection | Field(s) | Type | Purpose |
|------------|----------|------|---------|
| User | email | Unique | Fast login, prevent duplicates |
| User | role | Single | Filter by user type |
| Student | user | Unique | One profile per user |
| Student | cgpa | Single | Eligibility filtering |
| Student | graduationYear | Single | Eligibility filtering |
| Company | user | Unique | One profile per user |
| Company | verified | Single | Filter approved companies |
| Job | company | Single | Fetch company's jobs |
| Job | title | Text | Full-text search |
| Job | createdAt | Single | Sort by date |
| Application | student | Single | Fetch student applications |
| Application | job | Single | Fetch job applications |
| Application | {student, job} | Compound Unique | Prevent duplicate applications |
| Application | status | Single | Filter by status |

## 🔍 Common Queries

### 1. Get Student with User Details
```javascript
Student.findById(id).populate('user', 'name email');
```

### 2. Get Jobs with Company Info
```javascript
Job.find({ isActive: true })
  .populate('company', 'name logo')
  .sort('-createdAt')
  .limit(20);
```

### 3. Get Applications for a Job with Student Details
```javascript
Application.find({ job: jobId })
  .populate({
    path: 'student',
    populate: { path: 'user', select: 'name email' }
  });
```

### 4. Search Jobs by Title
```javascript
Job.find({ $text: { $search: 'developer' } })
  .populate('company', 'name logo');
```

### 5. Check if Student Already Applied
```javascript
Application.findOne({ student: studentId, job: jobId });
```

## 🛡️ Data Validation

### Field Validation
- **Email:** Regex pattern matching
- **CGPA:** Range 0-10
- **Graduation Year:** Range 2020-2030
- **Phone:** Regex pattern for international formats
- **Website:** Must start with http:// or https://

### Business Logic Validation
- **Unique Application:** Compound index prevents duplicate applications
- **Role-based Access:** Middleware checks user role before operations
- **Eligibility Check:** Compare student CGPA and branch with job requirements

## 📊 Sample Data Statistics

For a typical campus recruitment portal:

| Collection | Estimated Documents |
|------------|---------------------|
| Users | 500 |
| Students | 450 |
| Companies | 50 |
| Jobs | 120 |
| Applications | 2,500 |

**Storage Estimate:** ~50-100 MB (excluding file uploads)

## 🔄 Data Migration

### Initial Seed Data

**Admin User:**
```javascript
{
  name: "Admin",
  email: "admin@campus.com",
  password: "hashed_password",
  role: "admin"
}
```

**Sample Branches:**
```javascript
['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical']
```

**Sample Skills:**
```javascript
['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 
 'MongoDB', 'SQL', 'AWS', 'Docker', 'Machine Learning']
```

## 🚀 Performance Optimization

### Query Optimization
1. **Use projections:** Fetch only required fields
   ```javascript
   Student.find().select('name college cgpa');
   ```

2. **Limit results:** Implement pagination
   ```javascript
   Job.find().limit(20).skip(page * 20);
   ```

3. **Lean queries:** For read-only operations
   ```javascript
   Job.find().lean();  // Returns plain JS objects
   ```

### Connection Pooling
```javascript
mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

## 🔐 Security Considerations

1. **Password Storage:** Never store plain text, always hash with bcrypt
2. **Sensitive Fields:** Use `select: false` for password field
3. **Input Sanitization:** Mongoose escapes queries by default
4. **Validation:** Schema-level validation prevents invalid data
5. **Indexes:** Unique indexes prevent duplicate emails/applications

---

**Last Updated:** February 2024  
**Schema Version:** 1.0
