const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: Number,
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
