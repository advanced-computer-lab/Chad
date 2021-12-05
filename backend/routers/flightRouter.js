const express = require('express');
const { ADMIN } = require('../constants/userEnum');
const router = express.Router();
const Flight = require('../models/flightModel');
const Ticket = require('../models/TicketModel');
const Reservation = require('../models/ReservationModel');
const User = require('../models/UserModel');
const sendMail = require('../controllers/mailSender');

// remove the fields that cannot be modified
const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
};

// use middleware to handle unautherized access
router.use((req, res, next) => {
  if (
    !req.url.includes('flight') ||
    req.userData?.role === ADMIN ||
    (!req.url.includes('flights') && req.method === 'GET')
  ) {
    next();
    return;
  } else {
    res.status(401).json({
      success: false,
      msg: 'unautherized access',
    });
  }
});

//git req to view all the flights
router.get('/flights/:page', async (req, res) => {
  try {
    const page = Number(req.params.page);

    let numberOflights = await Flight.find({}).countDocuments();
    let flights = await Flight.find()
      .populate('departureLocation')
      .populate('arrivalLocation')
      .skip((page - 1) * 20)
      .limit(20);

    res.status(200).json({
      success: true,
      msg: 'ok',
      flights,
      maxPages: Math.ceil(numberOflights / 20),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some server err',
      err,
    });
  }
});

//git req to view a required flight
router.get('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    let flight = await Flight.findOne({ _id })
      .populate('departureLocation')
      .populate('arrivalLocation');

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

// post req to add a flight
router.post('/flight', async (req, res) => {
  try {
    let flight = await Flight.create(req.body);

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

//patch req to update a flight using an id
router.put('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    // remove unmodified data
    const newData = sanatizeData(req.body);
    const flight = await Flight.updateOne({ _id }, { $set: newData });

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

//delete req
router.delete('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    const result = await Flight.findOneAndDelete({ _id });
    const tickets = await Ticket.find({
      flightNumber: result.flightNumber,
    }).select('_id');
    let users = [];
    for (let ticketId of tickets) {
      const reservation = await Reservation.findOne({
        tickets: ticketId,
      }).populate('userId');
      let remainingTickets = [];
      if (reservation) {
        for (let ticket in reservation.tickets) {
          if (!(ticket in tickets)) {
            remainingTickets.push(ticket);
          }
        }

        if (remainingTickets.length != 0) {
          await Reservation.deleteOne({ _id: reservation._id });
        } else {
          await Reservation.updateOne(
            { _id: reservation._id },
            { tickets: remainingTickets }
          );
        }
        users.push(reservation.userId.email);
      }
    }
    await Ticket.deleteMany({
      flightNumber: result.flightNumber,
    });
    if (!users.length) {
      await sendMail(users, 'Flight canceled', 'Your flight has been canceled');
    }
    res.status(200).json({
      success: true,
      msg: 'ok',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

module.exports = router;
