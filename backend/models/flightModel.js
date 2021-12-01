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
    PriceOfExtraWeight: {
      type: Number,
      required: true,
    },
    departureLocation: {
      type: mongoose.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
    arrivalLocation: {
      type: mongoose.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
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
          start: {
            type: Number,
            required: true,
          },
          end: {
            type: Number,
            required: true,
          },
          priceForAdult: {
            type: Number,
            required: true,
          },
          priceForChild: {
            type: Number,
            required: true,
          },
          baggageAllowanceForAdult: {
            type: Number,
            required: true,
          },
          baggageAllowanceForChild: {
            type: Number,
            required: true,
          },
          childrenLimit: {
            type: Number,
            required: true,
          },
          availabelChildrenSeats: {
            type: Number,
            required: true,
          },
          availabelAdultsSeats: {
            type: Number,
            required: true,
          },
          reserverdSeats: {
            type: [Number],
            default: [],
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', FlightSchema);
