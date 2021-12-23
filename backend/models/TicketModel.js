const mongoose = require('mongoose');
const Flight = require('./flightModel');
const Reservation = require('./ReservationModel');

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
  },
  { timestamps: true }
);

const objEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

TicketSchema.statics.deleteTicket = async function (ticketId) {
  let _ticket = await this.findOneAndDelete({ _id: ticketId });
  let _reservation = await Reservation.findOne({ tickets: ticketId });
  let _flight = await Flight.findOne({ flightNumber: _ticket.flightNumber });

  let classIdx = _flight.classInfo.findIndex(
    ({ Type }) => Type === _ticket.classType
  );
  _flight.classInfo[classIdx].reserverdSeats = _flight.classInfo[
    classIdx
  ].reserverdSeats.filter((sn) => sn !== _ticket.seatNumber);
  if (_ticket.isChild) {
    _flight.classInfo[classIdx].availabelChildrenSeats++;
    _flight.classInfo[classIdx].availabelAdultsSeats++;
  } else {
    _flight.classInfo[classIdx].availabelAdultsSeats++;
    _flight.classInfo[classIdx].availabelChildrenSeats = Math.min(
      _flight.classInfo[classIdx].childrenLimit,
      _flight.classInfo[classIdx].availabelChildrenSeats + 1
    );
  }
  await _flight.save();

  // if it is the last ticket in the reservation so delete it
  if (_reservation.tickets.length === 1) await _reservation.remove();
  else {
    _reservation.tickets = _reservation.tickets.filter(
      (t) => !objEqual(t, _ticket._id)
    );
    await _reservation.save();
  }
  return { ..._ticket._doc };
};

module.exports = mongoose.model('Ticket', TicketSchema);
