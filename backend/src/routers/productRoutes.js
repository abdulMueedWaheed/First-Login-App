import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes - require authentication
router.post('/', authenticateUser, upload.single('image'), createProduct);
router.put('/:id', authenticateUser, upload.single('image'), updateProduct);
router.delete('/:id', authenticateUser, deleteProduct);

export default router;
