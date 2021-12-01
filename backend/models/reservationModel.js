const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
  {
    reservationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    departureFlightId: {
      type: String,
      required: true,
    },
    departureNumberOfAdult: {
      type: Number,
      required: true,
      default: 0,
    },
    departureNumberOfChildren: {
      type: Number,
      required: true,
      default: 0,
    },
    departureAndReturn: {
      type: Boolean,
      required: true,
      default: false,
    },
    returnFlightId: {
      type: String,
      required: true,
      default: null,
    },
    returnNumberOfAdult: {
      type: Number,
      required: true,
      default: 0,
    },
    returnNumberOfChildren: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('reservation', ReservationSchema);
