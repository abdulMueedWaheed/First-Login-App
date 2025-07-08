import supabase from "../lib/supabase_connect.js";

// Get all products with optional filtering and sorting
export const getProducts = async (req, res) => {
  try {
    const { category, sort, order = 'asc', minPrice, maxPrice, search } = req.query;
    
    // Start with a base query
    let query = supabase
      .from('products')
      .select('*');
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    // Apply sorting if provided
    if (sort) {
      query = query.order(sort, { ascending: order.toLowerCase() === 'asc' });
    }
    
    const { data: products, error } = await query;
    
    if (error) {
      console.error("Error fetching products:", error);
      return res.status(400).json({
        message: "Failed to fetch products",
        error: error.message
      });
    }
    
    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProducts controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a specific product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching product:", error);
      return res.status(404).json({
        message: "Product not found"
      });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in getProductById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price are required fields"
      });
    }
    
    // Create product object
    const productData = {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: stock || 0,
    };
    
    // Add image URL if image was uploaded via middleware
    if (req.file) {
      productData.image_url = req.file.path;
    }
    
    // Insert into Supabase
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating product:", error);
      return res.status(400).json({
        message: "Failed to create product",
        error: error.message
      });
    }
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("Error in createProduct controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    
    // Create update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (stock !== undefined) updateData.stock = stock;
    
    // Add image URL if image was uploaded via middleware
    if (req.file) {
      updateData.image_url = req.file.path;
    }
    
    // Update in Supabase
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating product:", error);
      return res.status(400).json({
        message: "Failed to update product",
        error: error.message
      });
    }
    
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting product:", error);
      return res.status(400).json({
        message: "Failed to delete product",
        error: error.message
      });
    }
    
    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.log("Error in deleteProduct controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
