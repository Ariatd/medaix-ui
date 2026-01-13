# MedAIx Intelligent Research Support System - High-Level Design Report

## 1. Subsystem Decomposition (Technical Stack & Modules)

### Frontend Architecture
**Framework:** React 18 with TypeScript, built using Vite bundler

**State Management:** 
- React Context API for global state management (`AuthContext.tsx`, `NotificationContext.tsx`, `ToastContext.tsx`, `ThemeContext.tsx`)
- Local component state using React hooks (`useState`, `useEffect`)
- Custom hooks for specialized functionality (`useScrollAnimation.ts`, `useNetworkSpeed.ts`, `useDeviceType.ts`, `useOS.ts`)

**Key Frontend Libraries:**
- **UI Framework:** Tailwind CSS v3 for styling with custom platform-specific extensions
- **Routing:** React Router for client-side routing
- **Form Management:** Custom validation utilities with Joi-inspired schema validation (`validation.ts`)
- **HTTP Client:** Fetch API with custom retry logic (`apiClient.ts`)
- **File Upload:** Custom image validation and preprocessing (`imageValidator.ts`)
- **PDF Generation:** PDF export functionality (`pdfExport.ts`)
- **Accessibility:** Comprehensive accessibility support with ARIA labels, keyboard navigation, and screen reader compatibility

**Component Architecture:**
- Modular component design with reusable UI primitives
- Platform-specific responsive design implementation
- Error boundary pattern for graceful error handling
- Skeleton loading states for improved UX

### Backend Architecture
**Framework:** Node.js with Express.js v4.18.2, TypeScript-based

**API Structure:** RESTful API design with JSON responses

**Authentication & Security:**
- JWT (JSON Web Tokens) for stateless authentication
- bcryptjs for password hashing with configurable rounds
- Rate limiting using `express-rate-limit` (100 requests/15min window)
- Request throttling with `express-slow-down`
- Helmet.js for HTTP security headers
- CORS configuration for cross-origin requests

**Key Backend Libraries:**
- **Database ORM:** Prisma Client v5.7.0 for type-safe database access
- **File Handling:** Multer for multipart form data processing, Sharp for image processing
- **Validation:** Custom middleware with Joi-inspired validation schemas
- **Logging:** Winston for structured logging with file rotation
- **Compression:** Built-in compression middleware for response optimization

**Server Architecture:**
- Modular route-based organization
- Middleware stack for cross-cutting concerns
- Async error handling with centralized error middleware
- Environment-based configuration management

### AI/ML Engine Architecture
**Current Implementation:** Mock/placeholder implementation with structured interfaces

**Intended ML Pipeline:**
- **Image Preprocessing:** Sharp.js for image metadata extraction and format validation
- **Model Framework:** Prisma schema defines support for multiple algorithm versions (`algorithmVersion`, `modelUsed` fields)
- **Supported Formats:** DICOM medical imaging, standard image formats (JPEG, PNG, TIFF)
- **Confidence Scoring:** Decimal precision scoring (0.0000 to 1.0000) for analysis results

**Extensibility Features:**
- Versioned algorithm support for model updates
- Multiple analysis types configuration
- Quality metrics tracking for model performance
- Processing time monitoring for optimization

**Advanced Image Validation System:**
- **Two-Phase Validation Pipeline:** Phase 1 quick classification (preserves existing behavior for ≥60% confidence), Phase 2 deep analysis for lower confidence cases
- **Medical Image Pattern Recognition:** Sophisticated pixel analysis including grayscale ratio detection, brightness pattern analysis, and anatomical structure identification
- **DICOM Support:** Native DICOM file format detection and special handling
- **Image Type Classification:** Automatic detection of X-ray, MRI, CT, and Ultrasound patterns through advanced pixel analysis algorithms

### Database Architecture
**Database Type:** PostgreSQL 14+ with UUID primary keys

**ORM:** Prisma ORM v5.7.0 with TypeScript support

**Key Features:**
- ACID compliance for data integrity
- JSONB fields for flexible metadata storage
- Array types for multi-valued attributes
- Custom enum types for constrained values
- Full-text search capabilities through PostgreSQL features

## 2. Database Design Overview

### Core Entity Relationships

**Primary Entities:**
1. **Users** ← **ResearchProjects** (One-to-Many)
2. **ResearchProjects** ← **UploadedImages** (One-to-Many)  
3. **ResearchProjects** ← **ResearchAnalyses** (One-to-Many)
4. **ResearchProjects** ← **KnowledgeIntegrations** (One-to-Many)
5. **Users** ← **ProjectCollaborators** (Many-to-Many through ResearchProjects)

**Junction Tables:**
- **project_disciplines**: ResearchProjects ↔ AcademicDisciplines (Many-to-Many)
- **project_occupations**: ResearchProjects ↔ OnetOccupations (Many-to-Many)
- **project_methodology_steps**: ResearchProjects ↔ MethodologySteps (Many-to-Many)

### Key Entity Attributes

**User Entity:**
- **Identification:** `id` (UUID), `email` (unique), `name`
- **Profile:** `avatar`, `institution`, `department`, `specialization[]`
- **Academic:** `orcidId`, `googleScholarId`, `linkedinUrl`
- **Security:** `isVerified`, `role` (enum: admin, researcher, analyst, student)
- **System:** `preferences` (JSONB), `memberSince`, `lastActive`

**Image Entity:**
- **Identification:** `id` (UUID), `projectId` (FK), `uploadedById` (FK)
- **File Properties:** `fileName`, `originalFileName`, `filePath`, `fileSize`, `mimeType`
- **Technical:** `width`, `height`, `colorDepth`, `imageType`
- **Medical:** `dicomMetadata` (JSONB), `hasMetadata`
- **Analysis:** `analysisStatus` (enum), `imageConfidence` (decimal)
- **Compliance:** `consentObtained`, `dataClassification`, `anonymized`

**Analysis Entity:**
- **Identification:** `id` (UUID), `projectId` (FK), `imageId` (FK), `analystId` (FK)
- **Results:** `findings` (JSONB), `recommendations` (JSONB), `differentialDiagnosis` (JSONB)
- **Metrics:** `confidenceScore` (decimal), `processingTimeSeconds`, `qualityMetrics` (JSONB)
- **Workflow:** `status` (enum), `reviewRequired`, `reviewedById`, `approvedById`
- **Technical:** `algorithmVersion`, `modelUsed`, `errorMessage`

## 3. Key Algorithms & Logic

### Image Analysis Pipeline Flow

**Step 1: Upload & Validation**
- File type validation against allowed MIME types (JPEG, PNG, DICOM)
- File size enforcement (50MB limit)
- Image metadata extraction using Sharp.js
- DICOM format detection and special handling

**Step 2: Preprocessing Pipeline**
- Image dimension validation
- Color depth analysis
- Medical imaging format detection
- Metadata extraction and storage

**Step 3: Analysis Queue Processing**
- Asynchronous analysis job creation
- Status tracking through analysis pipeline
- Progress monitoring and reporting

**Step 4: Result Processing**
- Confidence score calculation and validation
- Findings structure validation
- Quality metrics computation
- Recommendation generation logic

### Validation & Preprocessing Logic

**Image Validation Rules:**
```typescript
// From imageValidator.ts
- File extension validation
- MIME type verification
- Image dimension requirements
- Medical imaging format detection
- DICOM metadata extraction
```

**Data Validation Framework:**
- Schema-based validation for all API inputs
- Type safety enforcement through TypeScript
- Input sanitization for security
- Custom validation rules for medical data compliance

**Preprocessing Algorithms:**
- Medical image format normalization
- Metadata extraction and validation
- Quality assessment scoring
- Compliance checking for data classification

## 4. API & Services Architecture

### Core API Endpoints

**Authentication Service (`/api/auth`):**
- `POST /login` - JWT token generation with user validation
- `POST /register` - User creation with password hashing
- `GET /me` - Current user profile retrieval
- `POST /refresh` - Token refresh mechanism
- `POST /logout` - Session termination

**Upload Service (`/api/upload`):**
- `POST /image` - Single image upload with metadata extraction
- `POST /batch` - Multiple image upload processing
- `GET /images/:userId` - User image catalog with pagination
- `GET /image/:id` - Individual image metadata retrieval
- `DELETE /image/:id` - Secure image deletion with cleanup

**Methodology Service (`/api/methodology`):**
- `GET /steps` - Methodology framework templates retrieval
- `GET /types` - Available research methodology types
- `POST /projects/:projectId/steps` - Methodology assignment to projects
- `PATCH /projects/:projectId/steps/:stepId` - Progress tracking updates
- `GET /projects/:projectId/steps` - Project methodology status

**Project Management (`/api/projects`):**
- `GET /` - Project listing with filtering and pagination
- `POST /` - New research project creation
- `GET /:id` - Individual project details
- `PATCH /:id` - Project metadata updates
- `GET /:id/statistics` - Project analytics and metrics

**Analysis Service (`/api/analyses`):**
- `GET /` - Analysis results with advanced filtering
- `POST /` - New analysis job creation
- `GET /:id` - Individual analysis results
- `POST /:id/complete` - Analysis completion with results
- `POST /:id/fail` - Failure handling and error logging
- `GET /user/:userId/statistics` - User analytics dashboard

### Service Layer Architecture

**Middleware Stack:**
1. Security headers (Helmet.js)
2. CORS configuration
3. Rate limiting enforcement
4. Request throttling
5. Body parsing and compression
6. Authentication validation
7. Route-specific handlers

**Error Handling Strategy:**
- Centralized error middleware
- Structured error responses
- Logging integration with Winston
- Graceful degradation patterns

## 5. Testing & Security Implementation

### Testing Framework Architecture
**Frontend Testing:**
- Jest configured for component testing
- React Testing Library for component isolation
- Custom hook testing utilities
- Integration testing for user workflows

**Backend Testing:**
- Jest with TypeScript support for API testing
- Supertest for HTTP endpoint testing
- Database testing with Prisma test instances
- Mock data generators for consistent test scenarios

**Security Measures Implemented:**

**Authentication & Authorization:**
- JWT token-based stateless authentication
- bcrypt password hashing with 10 rounds (configurable)
- Role-based access control (admin, researcher, analyst, student)
- Token expiration and refresh mechanisms

**API Security:**
- Rate limiting: 100 requests per 15-minute window
- Request throttling to prevent abuse
- CORS configuration with allowlist
- Input validation and sanitization
- SQL injection protection through Prisma ORM

**Data Security:**
- Password hashing with bcryptjs
- Secure file upload with type validation
- Medical data classification levels
- Audit trails for sensitive operations
- Environment variable protection for secrets

**Infrastructure Security:**
- Helmet.js for HTTP security headers
- Compression to reduce attack surface
- Request logging for security monitoring
- Error handling to prevent information disclosure

### Quality Assurance Features

**Code Quality:**
- TypeScript for type safety
- ESLint configuration for code standards
- Prettier for code formatting consistency
- Husky pre-commit hooks for quality gates

**Monitoring & Observability:**
- Winston structured logging
- Request/response time tracking
- Error rate monitoring
- Performance metrics collection

This architecture provides a robust, scalable foundation for medical image analysis research with comprehensive security, testing, and extensibility features.
