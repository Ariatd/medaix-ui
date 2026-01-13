# Backend Integration Guide

## Current State (Client-Side Only)

The MedAIx app currently uses localStorage for data persistence. All data is stored on the client and is not synced to a backend.

## Migration Path to Backend

### Phase 1: Direct Replacement (Minimal Changes)

Replace `userDataManager.ts` functions with API calls:

```typescript
// OLD: Client-side
export function getAnalyses(userId: string): Analysis[] {
  const userData = getUserData(userId);
  return userData.analyses;
}

// NEW: API call
export async function getAnalyses(userId: string): Promise<Analysis[]> {
  const response = await fetch(`/api/users/${userId}/analyses`);
  return response.json();
}
```

### Phase 2: API Endpoints Needed

```
GET    /api/users/{userId}/analyses
GET    /api/users/{userId}/analyses/{analysisId}
POST   /api/users/{userId}/analyses
PUT    /api/users/{userId}/analyses/{analysisId}
DELETE /api/users/{userId}/analyses/{analysisId}
GET    /api/users/{userId}/statistics
POST   /api/users/{userId}/analyses/export/csv
```

### Phase 3: Request/Response Format

**GET /api/users/{userId}/analyses**
```json
{
  "data": [
    {
      "id": "analysis_1733872941000_abc123def",
      "fileName": "chest_xray.png",
      "uploadedAt": "2024-12-11T08:22:21.000Z",
      "imageType": "xray",
      "imageConfidence": 0.95,
      "status": "completed",
      "results": {
        "findings": [...],
        "overallConfidence": 0.95,
        "recommendations": [...]
      }
    }
  ]
}
```

**POST /api/users/{userId}/analyses**
```json
{
  "fileName": "chest_xray.png",
  "uploadedAt": "2024-12-11T08:22:21.000Z",
  "imageType": "xray",
  "imageConfidence": 0.95,
  "status": "completed",
  "results": {...}
}

Response:
{
  "id": "analysis_1733872941000_abc123def",
  "fileName": "chest_xray.png",
  ...
}
```

**GET /api/users/{userId}/statistics**
```json
{
  "totalAnalyses": 5,
  "successRate": 100,
  "thisMonth": 3,
  "avgConfidence": 0.92
}
```

### Phase 4: Code Changes Needed

**In src/utils/userDataManager.ts:**

Change all functions from sync to async:

```typescript
// Before
export function getAnalyses(userId: string): Analysis[] {
  const userData = getUserData(userId);
  return userData.analyses;
}

// After
export async function getAnalyses(userId: string): Promise<Analysis[]> {
  try {
    const response = await fetch(`/api/users/${userId}/analyses`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error('Failed to fetch analyses');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return [];
  }
}
```

**In React components:**

Change useEffect calls to handle promises:

```typescript
// Before
useEffect(() => {
  const analyses = getAnalyses(userId);
  setAnalyses(analyses);
}, [userId]);

// After
useEffect(() => {
  if (!userId) return;
  
  getAnalyses(userId).then(analyses => {
    setAnalyses(analyses);
  }).catch(error => {
    console.error('Error loading analyses:', error);
  });
}, [userId]);
```

### Phase 5: Error Handling

Implement fallback to localStorage if API fails:

```typescript
export async function getAnalyses(userId: string): Promise<Analysis[]> {
  try {
    // Try API first
    const response = await fetch(`/api/users/${userId}/analyses`, {
      timeout: 5000 // 5 second timeout
    });
    
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.warn('API failed, falling back to localStorage:', error);
    
    // Fallback to localStorage
    try {
      const data = getUserData(userId);
      return data.analyses;
    } catch {
      console.error('Both API and localStorage failed');
      return [];
    }
  }
}
```

### Phase 6: Real-Time Sync

For background sync of new analyses:

```typescript
// Queue unsaved analyses
const unsavedQueue: Analysis[] = [];

// Periodically sync with server
setInterval(async () => {
  for (const analysis of unsavedQueue) {
    try {
      await addAnalysisToServer(userId, analysis);
      unsavedQueue.splice(unsavedQueue.indexOf(analysis), 1);
    } catch (error) {
      console.warn('Failed to sync analysis, will retry');
    }
  }
}, 30000); // Every 30 seconds
```

## Database Schema (Suggested)

```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analyses table
CREATE TABLE analyses (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL,
  image_type VARCHAR(50),
  image_confidence DECIMAL(3,2),
  status VARCHAR(20) NOT NULL,
  findings JSON,
  overall_confidence DECIMAL(3,2),
  recommendations JSON,
  user_settings JSON,
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id),
  INDEX (uploaded_at),
  INDEX (status)
);

-- Statistics (cached)
CREATE TABLE user_statistics (
  user_id VARCHAR(255) PRIMARY KEY REFERENCES users(id),
  total_analyses INT DEFAULT 0,
  success_rate INT DEFAULT 0,
  this_month INT DEFAULT 0,
  avg_confidence DECIMAL(3,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Backend Implementation (Node.js/Express Example)

```typescript
// routes/analyses.ts
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { Analysis } from '../types';

const router = express.Router();

// Get all analyses for user
router.get('/users/:userId/analyses', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user has permission
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const analyses = await db.query(
      'SELECT * FROM analyses WHERE user_id = ? ORDER BY uploaded_at DESC',
      [userId]
    );
    
    res.json({ data: analyses });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single analysis
router.get('/users/:userId/analyses/:analysisId', requireAuth, async (req, res) => {
  try {
    const { userId, analysisId } = req.params;
    
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const analysis = await db.query(
      'SELECT * FROM analyses WHERE id = ? AND user_id = ?',
      [analysisId, userId]
    );
    
    if (!analysis) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json({ data: analysis });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new analysis
router.post('/users/:userId/analyses', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const analysis: Analysis = req.body;
    
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const result = await db.query(
      'INSERT INTO analyses (id, user_id, file_name, uploaded_at, image_type, image_confidence, status, findings, overall_confidence, recommendations, user_settings) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        analysis.id,
        userId,
        analysis.fileName,
        analysis.uploadedAt,
        analysis.imageType,
        analysis.imageConfidence,
        analysis.status,
        JSON.stringify(analysis.results?.findings),
        analysis.results?.overallConfidence,
        JSON.stringify(analysis.results?.recommendations),
        JSON.stringify(analysis.userSettings)
      ]
    );
    
    // Update user statistics
    await updateUserStatistics(userId);
    
    res.status(201).json({ data: analysis });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete analysis
router.delete('/users/:userId/analyses/:analysisId', requireAuth, async (req, res) => {
  try {
    const { userId, analysisId } = req.params;
    
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await db.query(
      'DELETE FROM analyses WHERE id = ? AND user_id = ?',
      [analysisId, userId]
    );
    
    // Update user statistics
    await updateUserStatistics(userId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/users/:userId/statistics', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const stats = await db.query(
      'SELECT * FROM user_statistics WHERE user_id = ?',
      [userId]
    );
    
    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

## Security Considerations

1. **Authentication** - Verify JWT token on every request
2. **Authorization** - Users can only access their own data
3. **Rate limiting** - Prevent abuse with request limits
4. **Input validation** - Validate all incoming data
5. **CORS** - Configure appropriate CORS headers
6. **HTTPS** - Enforce HTTPS in production
7. **Data encryption** - Encrypt sensitive fields at rest

## Migration Steps

1. **Deploy API** with identical response format
2. **Update userDataManager.ts** to make API calls
3. **Test with fallback** to localStorage
4. **Monitor for errors** in production
5. **Gradually migrate** user data to backend
6. **Remove localStorage** fallback once verified

## Timeline Estimate

- **Backend API**: 2-3 weeks
- **Integration**: 1 week
- **Testing**: 1 week
- **Rollout**: 1 week

---

Ready to implement? Start with Phase 1 and work through each phase incrementally.
