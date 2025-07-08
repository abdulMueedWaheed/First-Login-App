import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/authenticateUser.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticateUser);

// User order routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);

// Admin routes
// Note: The admin check is done inside the controllers
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;
