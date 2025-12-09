import express from 'express';
import multer from 'multer';
import { authMiddleware as authenticate } from '../../shared/auth.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  toggleTwoFactor,
  getSessions,
  deleteSession
} from '../../core/application/profile.controller.js';

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All profile routes require authentication
router.use(authenticate);

// GET /api/v1/profile - Get current user profile
router.get('/', getProfile);

// PUT /api/v1/profile - Update user profile
router.put('/', updateProfile);

// POST /api/v1/profile/change-password - Change password
router.post('/change-password', changePassword);

// POST /api/v1/profile/avatar - Upload avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// PUT /api/v1/profile/two-factor - Toggle two-factor authentication
router.put('/two-factor', toggleTwoFactor);

// GET /api/v1/profile/sessions - Get user sessions
router.get('/sessions', getSessions);

// DELETE /api/v1/profile/sessions/:sessionId - Delete user session
router.delete('/sessions/:sessionId', deleteSession);

export default router;
