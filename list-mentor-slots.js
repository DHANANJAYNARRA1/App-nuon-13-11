const mongoose = require('mongoose');
const MentorAvailability = require('./models/MentorAvailability');

// Replace with your MongoDB URI and the mentor's ObjectId
const MONGODB_URI = 'mongodb://localhost:27017/neonclub';
const mentorId = '690b5e05708093b2567176fe';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const slots = await MentorAvailability.find({ mentorId }).sort({ startDateTime: 1 });
    if (!slots.length) {
      console.log('No slots found for this mentor.');
    } else {
      slots.forEach(slot => {
        console.log(
          `Slot: ${slot.title} | ${slot.startDateTime} - ${slot.endDateTime} | Active: ${slot.isActive} | Booked: ${slot.currentBookings}/${slot.maxBookings}`
        );
      });
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
