const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
    // e.g: "50g", "100g", "175g", "250g", "1kg bag", "Sampler"
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  }
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['Black Tea', 'Green Tea', 'White Tea', 'Matcha', 'Herbal Tea', 'Chai', 'Oolong', 'Rooibos', 'Teaware']
  },
  images: [{ type: String }],
  variants: [variantSchema],

  // Tea-specific fields
  flavor: [{ type: String }],        // e.g: ["Spicy", "Earthy", "Sweet"]
  qualities: [{ type: String }],     // e.g: ["Stimulating", "Soothing"]
  caffeine: {
    type: String,
    enum: ['No Caffeine', 'Low Caffeine', 'Medium Caffeine', 'High Caffeine']
  },
  allergens: [{ type: String }],
  origin: { type: String },
  isOrganic: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },

  // Steeping instructions
  steepingInstructions: {
    servingSize: String,      // "2 tsp per cup"
    waterTemp: String,        // "100°C"
    steepingTime: String,     // "3-5 minutes"
    colorAfter: String        // "3 minutes"
  },

  // Ratings
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }

}, { timestamps: true });

// Update average rating when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
