const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema(
  {
    flightNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    departure: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    numberOfSeats: {
      type: Number,
      required: true,
    },
    numberOfPepole: {
      type: Number,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    classInfo: {
      type: Map,
      required: true,
    },
  },
  { timestamps: true }
);

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
