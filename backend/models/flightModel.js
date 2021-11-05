const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
    },
    depature: {
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
    },
    depatureLocation: {
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
          Type: String,
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
