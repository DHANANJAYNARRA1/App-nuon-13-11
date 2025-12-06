const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, index: true, unique: true },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  tags: [{ type: String }],
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublished: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Workshop', workshopSchema);
