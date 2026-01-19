import express from 'express';
import { prisma } from '../server';
import { protect } from '../middleware/auth';
import { getUserTokenStats } from '../services/tokenService';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institution: true,
        department: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Token istatistiklerini servisten (sahte veriden) al
    const tokenStats = await getUserTokenStats(req.user.id);

    res.json({
      success: true,
      user: {
        ...user,
        ...tokenStats // Fake token verilerini ekle
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;