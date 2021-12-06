const express = require('express');
const { ADMIN } = require('../constants/userEnum');
const router = express.Router();
const Flight = require('../models/flightModel');
const Ticket = require('../models/TicketModel');
const Reservation = require('../models/ReservationModel');
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
    const _flight = await Flight.findOne({ _id });
    const changedFields = [
      'departure',
      'arrival',
      'departureLocation',
      'arrivalLocation',
      'flightNumber',
    ].filter((f) => JSON.stringify(_flight[f]) !== JSON.stringify(newData[f]));

    if (
      changedFields.some((f) =>
        ['departureLocation', 'arrivalLocation'].includes(f)
      )
    ) {
      //TODO handle Canceling
    } else {
      const tickets = await Ticket.find({
        flightNumber: _flight.flightNumber,
      }).populate('userId');
      for (let ticket of tickets) {
        for (let field of changedFields) {
          ticket[field] = newData[field];
        }
        await ticket.save();
        await sendMail(
          ticket.userId.email,
          'Flight updated',
          `Your flight ${changedFields
            .map((f) => `${f} has been updated to ${newData[f]}`)
            .join(', ')}`
        );
      }
    }
    // console.log(changedFields);
    // res.status(200).json({
    //   success: true,
    //   msg: 'ok',
    // });
    // return;

    const flight = await Flight.updateOne({ _id }, { $set: newData });

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    console.log(err);
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
    for (let ticketId of tickets) {
      const reservation = await Reservation.findOne({
        tickets: ticketId,
      }).populate('userId');
      if (reservation) {
        await sendMail(
          reservation.userId.email,
          'Flight canceled',
          `Your flight ${result.flightNumber} has been canceled `
        );
        let remainingTickets = reservation.tickets.filter(
          (id) => !tickets.some(({ _id }) => _id.equals(id))
        );
        if (remainingTickets.length) {
          reservation.tickets = remainingTickets;
          await reservation.save();
        } else {
          await reservation.remove();
        }
      }
    }

    await Ticket.deleteMany({
      flightNumber: result.flightNumber,
    });

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
