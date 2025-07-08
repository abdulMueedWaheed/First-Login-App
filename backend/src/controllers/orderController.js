import supabase from "../lib/supabase_connect.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id; // From auth middleware
    
    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({
        message: "Items and shipping address are required"
      });
    }

    // Calculate order total and validate item availability
    let totalAmount = 0;
    for (const item of items) {
      // Check if product exists and has enough stock
      const { data: product, error } = await supabase
        .from('products')
        .select('price, stock')
        .eq('id', item.productId)
        .single();
      
      if (error || !product) {
        return res.status(400).json({
          message: `Product with ID ${item.productId} not found`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product with ID ${item.productId}`
        });
      }
      
      totalAmount += product.price * item.quantity;
    }
    
    // Begin transaction by creating the order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        created_at: new Date()
      }])
      .select()
      .single();
    
    if (orderError) {
      console.error("Error creating order:", orderError);
      return res.status(400).json({
        message: "Failed to create order",
        error: orderError.message
      });
    }
    
    // Add order items
    const orderItems = items.map(item => ({
      order_id: newOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_time: item.price // You might want to get this from the products table
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error("Error adding order items:", itemsError);
      return res.status(400).json({
        message: "Failed to add order items",
        error: itemsError.message
      });
    }
    
    // Update product stock
    for (const item of items) {
      const { error: stockError } = await supabase
        .from('products')
        .update({ 
          stock: supabase.raw(`stock - ${item.quantity}`) 
        })
        .eq('id', item.productId);
      
      if (stockError) {
        console.error("Error updating product stock:", stockError);
        // You might want to handle this error more gracefully in production
      }
    }
    
    res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder.id,
      totalAmount
    });
  } catch (error) {
    console.log("Error in createOrder controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all orders for the current user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching user orders:", error);
      return res.status(400).json({
        message: "Failed to fetch orders",
        error: error.message
      });
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getUserOrders controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware
    
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching order:", error);
      return res.status(404).json({
        message: "Order not found"
      });
    }
    
    // Check if the order belongs to the user or if user is admin
    if (order.user_id !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view this order"
      });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.log("Error in getOrderById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    // Only admin should access this endpoint
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users (id, full_name, email),
        order_items (
          *,
          product:products (*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching all orders:", error);
      return res.status(400).json({
        message: "Failed to fetch orders",
        error: error.message
      });
    }
    
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getAllOrders controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Only admin should update order status
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }
    
    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }
    
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating order status:", error);
      return res.status(400).json({
        message: "Failed to update order status",
        error: error.message
      });
    }
    
    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }
    
    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.log("Error in updateOrderStatus controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
