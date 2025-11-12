const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  sessionType: { type: String, enum: ['lecture', 'workshop', 'live', 'recorded'], default: 'lecture' },
  startsAt: { type: Date },
  endsAt: { type: Date },
  mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  capacity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  materials: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
