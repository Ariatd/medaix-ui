# MedAIx UI - Copilot Instructions

## Project Overview
MedAIx is a React + TypeScript application for AI-powered medical image analysis. The app provides a three-step workflow: Landing → Upload medical images → View analysis results. It uses Vite for bundling, Tailwind CSS for styling, and communicates with a backend API for image analysis.

## Architecture

### Core Pages (src/pages/)
- **Landing.tsx**: Initial landing/welcome page
- **Upload.tsx**: Medical image upload interface with real-time feedback
- **Results.tsx**: Displays analysis results with polling support for job status

### Components Pattern
- **Layout.tsx**: Shared wrapper component providing header, footer, and disclaimer
- **UploadCard.tsx**: File upload UI with validation (DICOM, JPG, PNG, TIFF)
  - Enforces size limits: 50MB for standard formats, 500MB for DICOM files
  - Provides drag-and-drop file selection
- **Alert Components**: SuccessAlert, ErrorAlert, WarningAlert for user feedback
- **Display Components**: ImageViewer, ResultsDisplay, PredictionPanel for showing results
- **LoadingAnimation.tsx**: Animated loading state indicator
- **HeatmapOverlay.tsx**: Specialized component for visualizing AI confidence regions

### API Integration (src/api/apiClient.ts)
- **analyzeFile(file)**: Sends file to `/api/analyze` endpoint, returns jobId
- **getResults(jobId)**: Polls `/api/results/{jobId}` endpoint for job status/results
- **Retry Logic**: Implements exponential backoff (1s → 10s) with 3 max retries
  - Retries on network errors, 5xx responses, and 429 rate limits
  - Does NOT retry on 4xx client errors except 429

### Data Flow
1. User uploads file in Upload page → UploadCard validates and calls analyzeFile()
2. jobId stored in sessionStorage and route navigates to `/results/{jobId}`
3. Results page calls getResults() to fetch job status/results
4. Component displays loading state until status is 'completed' or 'failed'

## Development Workflow

### Commands
- `npm run dev` - Start Vite dev server (HMR enabled)
- `npm run build` - Production build to dist/
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview production build locally

### Key Build Features
- **React Compiler**: Enabled via babel-plugin-react-compiler (impacts dev/build performance)
- **Rolldown Vite**: Using `npm:rolldown-vite@7.2.5` instead of standard Vite
- **React Fast Refresh**: HMR-enabled for instant component updates

## Styling & Theming

### Tailwind Configuration (tailwind.config.js)
- Custom color palette with semantic naming:
  - `primary` (blue): Primary actions and highlights
  - `success` (green), `warning` (orange), `danger` (red): Status/alert colors
  - `background` (light gray): Page background
- Uses `extend` mode to preserve Tailwind defaults
- All CSS files use Tailwind utility classes only (no custom CSS unless unavoidable)

### Class Naming Conventions
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Layout: `flex`, `grid`, grid-cols-*, `max-w-*`, `px-*`, `py-*`
- Component styling in JSX className attribute, not separate CSS files (when possible)

## TypeScript Patterns

### Component Declaration
```tsx
interface ComponentProps {
  className?: string;
  onEvent?: (value: Type) => void;
}

const Component: React.FC<ComponentProps> = ({ className = '', onEvent }) => {
  // Implementation
};
```

### API Response Validation
- Always validate API response structure before using (see apiClient.ts for examples)
- Define strict interface types for API responses (AnalyzeResponse, ResultsResponse)
- Check for required fields and correct types before processing

## Common Patterns to Follow

### File Upload Validation
- Check file extension against ACCEPTED_FORMATS array
- Validate file size with format-specific limits
- Return user-friendly error messages for validation failures

### Async State Management
- Use useState for loading, error, and data states
- Use useEffect with dependency arrays for side effects
- Catch errors with try-catch and display via Alert components

### Navigation Flow
- Use react-router-dom's useNavigate hook
- Encode route parameters: `encodeURIComponent(jobId)`
- Store transient data in sessionStorage (e.g., jobId) for cross-page access

### Error Handling
- Distinguish between validation errors (show immediately) and API errors (with retry context)
- Display errors via ErrorAlert component
- Network errors get automatic retry; client errors (400, 403) fail fast

## Project Conventions

### File Organization
- Pages in `src/pages/` are full-page screens with routing
- Components in `src/components/` are reusable UI elements
- API logic centralized in `src/api/apiClient.ts`
- No API endpoint URLs hardcoded; assumes backend proxy at `/api/`

### Naming
- Components use PascalCase (ResultsDisplay.tsx)
- Functions use camelCase (analyzeFile)
- Boolean props prefixed with is/has/on (isDragging, onAnalysisComplete)
- CSS classes use kebab-case with semantic color names (text-danger, bg-warning-50)

### Type Safety
- All components properly typed with React.FC<Props>
- API functions have explicit return types
- Use `string | null` for optional state rather than undefined (for reset handling)

## Important Notes

### Medical/Legal Context
- App displays prominent disclaimer: "not a clinical diagnosis, for research/education only"
- All result pages include this notice (see Layout.tsx footer)
- No guarantee of result accuracy; AI outputs are for reference only

### Backend Assumptions
- Backend serves from same domain at `/api/` path (no CORS config needed)
- File uploads expect FormData (don't set Content-Type header; browser handles it)
- Results polling: job status transitions through pending → processing → completed/failed
