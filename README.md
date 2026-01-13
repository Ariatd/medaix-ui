# MedAIx - AI-Powered Medical Image Analysis

A production-ready React application for AI-powered medical image analysis with a comprehensive responsive design system supporting mobile, tablet, and desktop platforms with platform-specific optimizations.

## Features

### 🏥 Core Features
- **Medical Image Analysis**: Upload DICOM, JPG, PNG, TIFF files for AI analysis
- **Smart Image Validator**: Automatic validation of medical images before upload
  - File format, size, and dimension checks
  - Grayscale detection (X-rays)
  - DICOM format detection
  - Confidence scoring
- **Real-time Results**: View analysis results with confidence scores and heatmaps
- **Analysis History**: Track all analyses with filtering and export
- **User Authentication**: Secure login, signup, and password reset
- **User Profiles**: Manage account settings and preferences

### 📱 Responsive Design
- **Mobile**: Bottom navigation, full-screen modals, optimized touch targets
- **Tablet**: Sidebar navigation, split-view layouts, multi-column grids
- **Desktop**: Full sidebar, keyboard shortcuts, hover effects, context menus
- **Platform-Aware**: iOS/Android/macOS/Windows/Linux specific styling and behavior

### ⚡ Performance
- **Build**: 457 modules, 547.88 kB JS (157.71 kB gzipped)
- **Optimization**: Network-aware image loading, lazy loading, code splitting
- **Smooth Animations**: Apple-style scroll animations with framer-motion

### 🎨 User Experience
- **Dark Mode**: System-aware dark mode with localStorage persistence
- **Toast Notifications**: Non-intrusive feedback system
- **Loading States**: Skeleton screens, progress indicators
- **Accessibility**: WCAG compliant, keyboard navigation, ARIA labels
- **Error Handling**: Comprehensive error boundaries and error recovery

### 🔐 Security & Privacy
- **Protected Routes**: Authentication-based route protection
- **Data Storage**: localStorage for user data persistence
- **No External API**: Backend communication via local proxy

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── pages/              # Full-page components (routes)
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
│   ├── useDeviceType.ts      # Device detection
│   ├── useOS.ts              # Platform detection
│   └── useNetworkSpeed.ts    # Network & orientation
├── context/           # React Context providers
├── utils/             # Utility functions
│   └── imageValidator.ts     # Medical image validation
├── styles/            # CSS styles
│   └── platform.css   # Platform-specific styles
├── api/              # API client
└── assets/           # Static assets
```

## Smart Image Validation

For complete image validator documentation, see [IMAGE_VALIDATOR_GUIDE.md](./IMAGE_VALIDATOR_GUIDE.md)

The app includes an intelligent client-side image validator that:
- ✅ Validates file format (DICOM, JPG, PNG, TIFF)
- ✅ Checks dimensions (minimum 256×256px)
- ✅ Detects grayscale patterns (X-rays)
- ✅ Detects DICOM format (medical standard)
- ✅ Provides confidence scoring (60-95%)
- ✅ Gives user-friendly feedback

**Performance**: Completes validation in 150-300ms on typical images.

## Responsive Design System

For complete responsive design documentation, see [RESPONSIVE_DESIGN_GUIDE.md](./RESPONSIVE_DESIGN_GUIDE.md)

### Device Breakpoints

| Device | Width | Navigation | Layout |
|--------|-------|-----------|--------|
| Mobile | < 640px | Bottom Nav | Single Column |
| Tablet | 768-1024px | Sidebar | Multi-Column |
| Desktop | > 1024px | Sidebar | Full Layout |

### Platform-Specific Features

- **iOS**: San Francisco font, momentum scrolling, notch support
- **Android**: Roboto font, Material Design, ripple effects
- **macOS**: SF Pro font, vibrancy effects, system integration
- **Windows**: Segoe UI, acrylic effects, snap layouts
- **Linux**: GTK-friendly design, system font

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite (Rolldown)
- **Styling**: Tailwind CSS 3.4, dark mode support
- **Animations**: Framer Motion 11
- **State Management**: React Context API
- **Routing**: React Router 7
- **Form Handling**: HTML5 validation
- **Storage**: localStorage, sessionStorage

## Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Key Components

### Navigation
- **Header**: Responsive header with search, notifications, user menu
- **BottomNav**: Mobile-only bottom tab navigation
- **Sidebar**: Desktop/tablet sidebar with collapsed state on mobile

### Pages
- **Landing**: Welcome page with scroll animations
- **Dashboard**: Statistics and recent analyses
- **Upload**: Medical image upload with validation
- **Results**: Analysis results with heatmap visualization
- **History**: Analysis history with search/filter
- **Settings**: User preferences and account management
- **Documentation**: Comprehensive guides and help

### Responsive Utilities
- `<MobileOnly>`: Show only on mobile
- `<TabletOnly>`: Show only on tablet
- `<DesktopOnly>`: Show only on desktop
- `<ResponsiveContainer>`: Adaptive padding and max-width
- `<ResponsiveGrid>`: Device-aware grid columns
- `<ResponsiveStack>`: Auto-direction stack

## Hooks

### Device Detection
```typescript
import { useDeviceType, useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/useDeviceType';

const device = useDeviceType(); // 'mobile' | 'tablet' | 'laptop' | 'desktop'
const isMobile = useIsMobile();
```

### Platform Detection
```typescript
import { useOS, useIsIOS, useIsAndroid, useIsTouchDevice } from '@/hooks/useOS';

const os = useOS(); // 'iOS' | 'Android' | 'macOS' | 'Windows' | 'Linux'
const hasTouch = useIsTouchDevice();
```

### Network & Orientation
```typescript
import { useNetworkSpeed, useOrientation } from '@/hooks/useNetworkSpeed';

const network = useNetworkSpeed(); // '4g' | '3g' | '2g' | 'slow-2g'
const orientation = useOrientation(); // 'portrait' | 'landscape'
```

## Accessibility

- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus indicators
- ✅ ARIA labels and descriptions
- ✅ Reduced motion support
- ✅ Color contrast compliance

## Browser Support

| Browser | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Safari | iOS 13+ | iPadOS 13+ | Latest |
| Chrome | Android 10+ | Latest | Latest |
| Firefox | Android 10+ | Latest | Latest |
| Edge | - | - | Latest |

## Performance Metrics

- **Bundle Size**: 547.88 kB (157.71 kB gzipped)
- **Modules**: 457 transformed
- **CSS**: 50.08 kB (8.93 kB gzipped)
- **Load Time**: < 3s on 4G connection
- **Lighthouse**: 90+ score on mobile

## Dark Mode

The app includes full dark mode support:
- System preference detection
- Manual toggle in header
- localStorage persistence
- Smooth transitions
- Platform-aware colors

## Error Handling

- Error boundaries for component failures
- Graceful error messages with recovery options
- Network error retry with exponential backoff
- 404 page for missing routes
- Empty states for no data scenarios

## Type Safety

- Full TypeScript coverage
- Strict type checking enabled
- Type-safe API responses
- Component prop validation

## Development Workflow

1. **Create Branch**: `git checkout -b feature/your-feature`
2. **Development**: `npm run dev` with HMR enabled
3. **Linting**: `npm run lint` before commit
4. **Build**: `npm run build` to verify production build
5. **Testing**: Test on multiple devices and browsers

## Contributing

1. Follow TypeScript and React best practices
2. Use existing component patterns
3. Maintain responsive design principles
4. Update documentation for new features
5. Test on mobile, tablet, and desktop

## Deployment

The app is built for deployment to static hosting:

```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Hosting Options
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## License

MIT License - Feel free to use this project for educational and commercial purposes.

## Support

For issues, feature requests, or questions:
1. Check existing documentation
2. Review component examples
3. Check responsive design guide
4. File an issue with details

---

**Last Updated**: December 10, 2025  
**Version**: 2.0  
**Status**: Production Ready ✅  
**Responsive**: Fully Optimized for All Devices ✅


## 🎯 Real Data System (v1.0)

### What Changed
All mock data has been removed. The application now uses a **real, user-specific data management system** with localStorage persistence.

### Key Features
- ✅ **User-Specific Data**: Each user's analyses are stored separately
- ✅ **Real Timestamps**: Analyses are timestamped when uploaded, not hardcoded
- ✅ **Real File Names**: Uses actual uploaded file names
- ✅ **Auto Statistics**: Dashboard stats calculated from real data
- ✅ **Empty States**: New users see 0 stats with CTA to start analyzing
- ✅ **Data Persistence**: Survives browser refresh and logout/login
- ✅ **Client-Side First**: Works offline, ready for backend integration

### User Flow
1. **New User**: Creates account → Dashboard shows empty state
2. **First Upload**: Uploads image → Instantly appears in history + dashboard
3. **Build History**: Each upload adds to dashboard stats and history table
4. **Export**: Can export analyses as CSV

### Data Storage
```
localStorage['medaix_user_{userId}_data'] = {
  analyses: [...],              // User's actual analyses
  statistics: {...},            // Calculated from analyses
  createdAt: timestamp,
  lastUpdated: timestamp
}
```

### Documentation
- **DATA_FLOW.md** - Complete data flow with examples
- **REAL_DATA_IMPLEMENTATION.md** - Implementation details and testing checklist
- **BACKEND_INTEGRATION_GUIDE.md** - How to migrate to backend API

### Next Steps
- Test with real users uploading images
- Integrate with backend API (see BACKEND_INTEGRATION_GUIDE.md)
- Add cloud sync when backend is ready

---
