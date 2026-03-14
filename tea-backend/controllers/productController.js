const Product = require('../models/Product');

// @route GET /api/products
// Query params: page, limit, category, flavor, caffeine, origin, isOrganic, minPrice, maxPrice, sort, search
const getProducts = async (req, res) => {
  try {
    const {
      page = 1, limit = 9,
      category, flavor, caffeine, origin,
      isOrganic, minPrice, maxPrice,
      sort = 'createdAt', search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = { $in: category.split(',') };
    if (flavor) filter.flavor = { $in: flavor.split(',') };
    if (caffeine) filter.caffeine = { $in: caffeine.split(',') };
    if (origin) filter.origin = { $in: origin.split(',') };
    if (isOrganic === 'true') filter.isOrganic = true;

    // Price filter on variants
    if (minPrice || maxPrice) {
      filter['variants.price'] = {};
      if (minPrice) filter['variants.price'].$gte = Number(minPrice);
      if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    }

    // Search by name
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortObj = {};
    switch (sort) {
      case 'price_asc':  sortObj = { 'variants.0.price': 1 }; break;
      case 'price_desc': sortObj = { 'variants.0.price': -1 }; break;
      case 'rating':     sortObj = { rating: -1 }; break;
      case 'newest':     sortObj = { createdAt: -1 }; break;
      default:           sortObj = { createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('-reviews');

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(9);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/:id/related
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(3).select('-reviews');

    res.json({ success: true, products: related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/products  [Admin/Superadmin]
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/products/:id  [Admin/Superadmin]
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/products/:id  [Superadmin]
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, getFeaturedProducts, getRelatedProducts, createProduct, updateProduct, deleteProduct };
