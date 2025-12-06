const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  category: {
    type: String,
    enum: ['announcement', 'update', 'event', 'achievement', 'general'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  videos: [{
    url: String,
    thumbnail: String,
    title: String,
    duration: String
  }],
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
newsSchema.index({ status: 1, featured: -1, publishedAt: -1 });
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ tags: 1 });

// Pre-save middleware to set publishedAt when status changes to published
newsSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for reading time estimation (rough calculation)
newsSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const words = this.content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
});

// Method to increment view count
newsSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to get featured news
newsSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ status: 'published', featured: true })
    .populate('author', 'name email')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Static method to get latest news
newsSchema.statics.getLatest = function(limit = 10, category = null) {
  const query = { status: 'published' };
  if (category) {
    query.category = category;
  }
  return this.find(query)
    .populate('author', 'name email')
    .sort({ publishedAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('News', newsSchema);