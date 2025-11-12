const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isMentor: { type: Boolean, required: true },
    isApproved: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    role: { type: String, default: 'mentor' },
    isProfileComplete: { type: Boolean, default: false },
    // Add other fields as needed
});

module.exports = mongoose.model('Mentor', mentorSchema);