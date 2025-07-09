import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protectRoute } from '../middleware/authenticateUser.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes - require authentication
router.post('/', protectRoute, upload.single('image'), createProduct);
router.put('/:id', protectRoute, upload.single('image'), updateProduct);
router.delete('/:id', protectRoute, deleteProduct);

export default router;
