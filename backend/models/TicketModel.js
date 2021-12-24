const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
    },
    flightNumber: {
      type: String,
      required: true,
    },
    departure: {
      type: Date,
      required: true,
    },
    arrival: {
      type: Date,
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
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    price: {
      type: Number,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    classType: {
      type: String,
      required: true,
    },
    isChild: {
      type: Boolean,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', TicketSchema);
