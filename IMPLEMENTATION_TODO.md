# MedAIx Backend Integration Implementation Plan

## Phase 1: Backend Updates

### 1.1 Update upload.ts - Prisma Integration + Auto-Deletion
- [ ] Connect upload routes to Prisma
- [ ] Implement 60-second auto-deletion logic for uploaded images
- [ ] Save image records to UploadedImage table
- [ ] Add proper validation and error handling

### 1.2 Update analyses.ts - Multi-Stage Confidence Logic
- [ ] Implement 50%-70%-100% confidence threshold rule
- [ ] Add secondary verification for mid-range confidence (50-70%)
- [ ] Connect to Prisma ResearchAnalysis table
- [ ] Save analysis results with full metadata

### 1.3 Create inference service
- [ ] Create `backend/src/services/inference.ts`
- [ ] Implement mock inference with confidence scoring
- [ ] Implement secondary verification logic
- [ ] Add Grad-CAM++ heatmap generation (simulated)

### 1.4 Update server.ts
- [ ] Register inference service routes
- [ ] Add background job scheduler for auto-deletion

---

## Phase 2: Frontend API Service

### 2.1 Create API service layer
- [ ] Create `src/services/api.ts` with Axios instance
- [ ] Add auth interceptors
- [ ] Create typed API functions for all endpoints
- [ ] Handle errors consistently

### 2.2 Update environment configuration
- [ ] Update `.env` with backend URL
- [ ] Update `src/config.ts` with API configuration

---

## Phase 3: Frontend Integration

### 3.1 Update Upload.tsx
- [ ] Connect to backend API for image upload
- [ ] Show real analysis progress with confidence stages
- [ ] Add Non-Diagnostic Disclaimer

### 3.2 Update Results.tsx
- [ ] Connect to backend API for analysis results
- [ ] Add simulated Grad-CAM++ heatmap visualization
- [ ] Add Non-Diagnostic Disclaimer
- [ ] Display confidence stages and verification status

### 3.3 Update History.tsx
- [ ] Connect to backend API for fetching analyses
- [ ] Add filtering and pagination
- [ ] Add Non-Diagnostic Disclaimer

### 3.4 Update Dashboard.tsx
- [ ] Connect to backend API for statistics
- [ ] Add Non-Diagnostic Disclaimer

### 3.5 Update userDataManager.ts
- [ ] Replace localStorage with API calls
- [ ] Maintain backward compatibility
- [ ] Add sync logic

---

## Phase 4: UI Enhancements

### 4.1 Add Grad-CAM++ Heatmap Component
- [ ] Create `src/components/GradCAMHeatmap.tsx`
- [ ] Implement opacity controls
- [ ] Add toggle for heatmap visibility
- [ ] Simulate heatmap generation

### 4.2 Add Non-Diagnostic Disclaimer
- [ ] Create `src/components/NonDiagnosticDisclaimer.tsx`
- [ ] Add to all pages (Upload, Results, History, Dashboard)
- [ ] Style consistently

---

## Phase 5: Testing & Validation

### 5.1 Backend Testing
- [ ] Test image upload with auto-deletion
- [ ] Test confidence threshold logic
- [ ] Test Prisma integration

### 5.2 Frontend Testing
- [ ] Test API integration
- [ ] Test heatmap visualization
- [ ] Test disclaimer display

---

## Multi-Stage Confidence Logic (HLD Section 4.7)

### Confidence Thresholds:
- **< 50%**: High uncertainty - Auto-fail with suggestion to retry
- **50-70%**: Medium confidence - Require secondary verification
- **70-85%**: Good confidence - Accept with yellow warning
- **85-100%**: High confidence - Accept with green confirmation

### Secondary Verification:
- For 50-70% confidence, trigger additional analysis
- Use different validation criteria
- Re-calculate confidence score
- Apply final decision based on combined score

---

## 60-Second Auto-Deletion Logic:
1. Image uploaded → Record created in DB with `createdAt` timestamp
2. Background job runs every 10 seconds
3. Check for images older than 60 seconds with no associated analysis
4. Delete image file and DB record
5. Log deletion for audit purposes

