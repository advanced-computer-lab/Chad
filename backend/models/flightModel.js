const mongoose = require('mongoose');

const {
  ECONOMY,
  PREMIUM_ECONOMY,
  BUSINESS,
  FIRST_CLASS,
} = require('../constants/flightEnums');

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      unique: true,
    },
    departure: {
      type: Date,
      required: true,
    },
    arrival: {
      type: Date,
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
    },
    numberOfPepole: {
      type: Number,
      required: true,
      default: 0,
    },
    departureLocation: {
      type: String,
      required: true,
    },
    arrivalLocation: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    classInfo: {
      type: [
        {
          Type: {
            type: String,
            enum: [ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST_CLASS],
            default: ECONOMY,
          },
          start: Number,
          end: Number,
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', FlightSchema);
