# Final Code Cleanup and Sanity Check - Plan

## Summary of Issues Found

### 1. Console.log Statements to Remove (Frontend)
| File | Count | Purpose |
|------|-------|---------|
| `src/api/analysisService.ts` | 1 | Debug logging for response |
| `src/pages/Results.tsx` | 4 | Debug logging for analysis loading |
| `src/components/UploadCard.tsx` | 5 | Debug logging for upload/polling |

### 2. Console.log Statements to Review (Backend)
| File | Count | Action |
|------|-------|--------|
| `backend/src/middleware/requestLogger.ts` | 2 | KEEP - HTTP request logging for production monitoring |
| `backend/src/routes/analyses.ts` | 1 | REMOVE - Debug endpoint hit log |
| `backend/src/services/tokenService.ts` | 1 | REMOVE - Debug 'Reset skipped' log |
| `backend/src/server.ts` | 1 | KEEP - Server startup notification |

### 3. Dead Code / Unused Files
| File | Action |
|------|--------|
| `src/main.ts` | REMOVE - Legacy Vite template code, not used |
| `src/utils/mockData.ts` | PRESERVE - Already @deprecated, kept for backward compatibility |
| `src/utils/analysisUtils.ts` | PRESERVE - Already @deprecated |

### 4. Mock Data Status
- `@deprecated` tags are already in place on `mockData.ts` and `analysisUtils.ts`
- No calls to `initializeMockData` found in active code
- Mock data file is preserved for backward compatibility but not actively used

## Implementation Plan

### Phase 1: Remove Console.log Debug Statements

#### Frontend:
1. **src/api/analysisService.ts**
   - Remove line 199: `console.log('[analysisService] getAnalysisResult response:...')`

2. **src/pages/Results.tsx**
   - Remove debug logs for analysis loading

3. **src/components/UploadCard.tsx**
   - Remove debug logs for upload response and polling

#### Backend:
1. **backend/src/routes/analyses.ts**
   - Remove `console.log('HIT: /image/:id endpoint called')`

2. **backend/src/services/tokenService.ts**
   - Remove `console.log('Reset skipped')`

### Phase 2: Remove Dead Code

1. **src/main.ts**
   - Remove entire legacy Vite template code block (lines 1-17)
   - Keep minimal file or delete entirely if not imported

### Phase 3: Verify Build

1. Run TypeScript type check
2. Run build to ensure no errors

## Files to be Modified

### Frontend:
- `src/api/analysisService.ts` - Remove 1 console.log
- `src/pages/Results.tsx` - Remove 4 console.logs
- `src/components/UploadCard.tsx` - Remove 5 console.logs
- `src/main.ts` - Remove legacy code block

### Backend:
- `backend/src/routes/analyses.ts` - Remove 1 console.log
- `backend/src/services/tokenService.ts` - Remove 1 console.log

## Preserved Items (DO NOT MODIFY)
- `backend/src/middleware/requestLogger.ts` - HTTP logging
- `backend/src/server.ts` - Server startup log
- `src/utils/mockData.ts` - Deprecated but preserved
- `src/utils/analysisUtils.ts` - Deprecated but preserved
- All `console.error` and `console.warn` statements

