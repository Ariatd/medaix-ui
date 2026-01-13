# MedAIx Backend Implementation Guide

## 🏗️ Project Structure

```
medaix-ui/
├── frontend/                    # Your existing React app (src/, public/, etc.)
├── backend/                     # New Node.js/Express backend
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   │   ├── upload.ts       # Image upload & management
│   │   │   ├── methodology.ts  # Research methodology frameworks
│   │   │   ├── projects.ts     # Research project management
│   │   │   ├── analyses.ts     # Analysis results & processing
│   │   │   └── auth.ts         # User authentication
│   │   ├── middleware/         # Express middleware
│   │   │   ├── errorHandler.ts # Error handling & logging
│   │   │   └── requestLogger.ts # Request logging
│   │   └── server.ts           # Main Express server
│   ├── prisma/
│   │   └── schema.prisma       # Prisma ORM schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── database/
    ├── schema.sql              # PostgreSQL database schema
    └── seed-data.sql           # Initial data for testing
```

## 🚀 Quick Start

### 1. Database Setup

```bash
# Install PostgreSQL (if not already installed)
# macOS: brew install postgresql
# Linux: sudo apt install postgresql

# Create database
createdb medaix_db

# Apply schema
psql medaix_db < database/schema.sql

# Load seed data
psql medaix_db < database/seed-data.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/medaix_db"

# Generate Prisma client
npm run prisma:generate

# Start development server
npm run dev
```

The backend will be running on http://localhost:3001

### 3. Frontend Integration

Update your frontend's API calls to point to the backend:

```typescript
// In your frontend apiClient.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api'
  : 'http://localhost:3001/api';

// Replace localStorage calls with API calls
export const getAnalyses = async (userId: string): Promise<Analysis[]> => {
  const response = await fetch(`${API_BASE_URL}/analyses/user/${userId}/statistics`);
  const data = await response.json();
  return data.statistics;
};
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Image Upload & Management
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/batch` - Upload multiple images
- `GET /api/upload/images/:userId` - Get user images
- `GET /api/upload/image/:id` - Get specific image
- `DELETE /api/upload/image/:id` - Delete image

### Methodology Framework
- `GET /api/methodology/steps` - Get all methodology steps
- `GET /api/methodology/types` - Get available methodology types
- `GET /api/methodology/steps/:id` - Get specific methodology step
- `POST /api/methodology/projects/:projectId/steps` - Assign steps to project
- `PATCH /api/methodology/projects/:projectId/steps/:stepId` - Update project step
- `GET /api/methodology/projects/:projectId/steps` - Get project methodology steps

### Research Projects
- `GET /api/projects` - Get research projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/statistics` - Get project statistics

### Analysis Results
- `GET /api/analyses` - Get analyses with filtering
- `POST /api/analyses` - Create new analysis
- `GET /api/analyses/:id` - Get specific analysis
- `PATCH /api/analyses/:id` - Update analysis
- `POST /api/analyses/:id/complete` - Complete analysis with results
- `POST /api/analyses/:id/fail` - Mark analysis as failed
- `GET /api/analyses/user/:userId/statistics` - Get user statistics

## 🗄️ Database Schema Overview

### Core Tables
1. **users** - Enhanced user management with research fields
2. **research_projects** - Research project management
3. **academic_disciplines** - Academic field taxonomy (Computer Engineering, Software Engineering, Psychology)
4. **onet_occupations** - ONET occupational data (Healthcare, AI Research, Data Science)
5. **methodology_steps** - Research methodology frameworks
6. **uploaded_images** - Enhanced image management
7. **research_analyses** - Analysis results with multidisciplinary context
8. **knowledge_integrations** - Cross-disciplinary knowledge mapping

### Key Features
- **Multidisciplinary Support**: Projects can span multiple academic disciplines
- **ONET Integration**: Links projects to relevant occupational categories
- **Methodology Frameworks**: Supports Multidisciplinary Engineering Analysis and Human-Centered Design
- **Knowledge Integration**: Cross-disciplinary knowledge mapping and synthesis
- **Migration Compatibility**: Maintains structure compatible with existing localStorage data

## 🔧 Environment Configuration

### Required Environment Variables
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/medaix_db"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

## 🧪 Testing the Implementation

### 1. Test Database Connection
```bash
curl http://localhost:3001/health
```

### 2. Test Authentication
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"researcher@medaix.edu","password":"password"}'
```

### 3. Test Upload Endpoint
```bash
curl -X POST http://localhost:3001/api/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@path/to/your/image.jpg"
```

### 4. Test Methodology Endpoints
```bash
curl http://localhost:3001/api/methodology/steps
curl http://localhost:3001/api/methodology/types
```

## 🔄 Migration from localStorage

### Data Structure Mapping

Your existing localStorage structure:
```typescript
interface UserData {
  userId: string;
  analyses: Analysis[];
  statistics: UserStatistics;
}
```

New database structure maintains compatibility:
- `user_statistics` view provides the same statistics structure
- Analysis records include all existing fields plus enhancements
- Projects table supports multidisciplinary research

### Migration Strategy
1. **Phase 1**: Run backend with mock data (current state)
2. **Phase 2**: Implement data export from localStorage
3. **Phase 3**: Create data import endpoints in backend
4. **Phase 4**: Update frontend to use API instead of localStorage
5. **Phase 5**: Remove localStorage dependency

## 🎯 Next Steps

1. **Database Setup**: Follow the Quick Start section above
2. **Backend Testing**: Test all API endpoints with Postman or curl
3. **Frontend Integration**: Update your React app to use the new API
4. **Authentication**: Implement JWT token handling in frontend
5. **File Upload**: Integrate image upload functionality
6. **Methodology Tools**: Build UI for research methodology frameworks
7. **Knowledge Integration**: Implement cross-disciplinary features

## 🛠️ Development Commands

```bash
# Backend development
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations

# Database operations
psql medaix_db < database/schema.sql    # Reset schema
psql medaix_db < database/seed-data.sql # Load test data
```

## 📊 Performance Considerations

- Database indexes on frequently queried fields
- Pagination on list endpoints
- Rate limiting for API protection
- File size limits for uploads
- JSON fields for flexible metadata storage

## 🔒 Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- File upload restrictions
- SQL injection protection via Prisma ORM

This implementation provides a solid foundation for your MedAIx Intelligent Research Support System with full PostgreSQL backend support and migration path from localStorage.
