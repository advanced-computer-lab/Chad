const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    tickets: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Ticket',
        required: true,
      },
    ],
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('reservation', ReservationSchema);
