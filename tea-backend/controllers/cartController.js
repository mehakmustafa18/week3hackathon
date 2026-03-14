const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images category');
    if (!cart) return res.json({ success: true, cart: { items: [], total: 0 } });
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    // Validate product + variant exist and have stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ success: false, message: 'Variant not found' });

    if (variant.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${variant.stock} items in stock` });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same product+variant already in cart
    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.variantId.toString() === variantId
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > variant.stock) {
        return res.status(400).json({ success: false, message: `Only ${variant.stock} items available` });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        variantId,
        variantSize: variant.size,
        variantPrice: variant.price,
        quantity
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name images category');

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    // Validate stock
    const product = await Product.findById(item.product);
    const variant = product.variants.id(item.variantId);

    if (quantity > variant.stock) {
      return res.status(400).json({ success: false, message: `Only ${variant.stock} items in stock` });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name images category');

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/cart/remove/:itemId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name images category');

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
