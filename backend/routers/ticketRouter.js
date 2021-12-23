const express = require('express');
const router = express.Router();
const Ticket = require('../models/TicketModel');
const Reservation = require('../models/ReservationModel');
const sendMail = require('../controllers/mailSender');
const User = require('../models/UserModel');
const Flight = require('../models/flightModel');
const { ADMIN } = require('../constants/userEnum');

const sanatizeData = (data) => {
  [
    '_id',
    'ticketNumber',
    'flightNumber',
    'departure',
    'arrival',
    'departureLocation',
    'arrivalLocation',
    'userId',
    'price',
    'isChild',
    'date',
    'paid',
  ].forEach((f) => delete data[f]);
  return data;
};

const objEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

//get req to view all the tickets
router.get('/tickets/:page', async (req, res) => {
  try {
    const page = Number(req.params.page);
    let tickets = [];
    if (req.userData.role === ADMIN)
      tickets = await Ticket.find()
        .skip((page - 1) * 20)
        .limit(20);
    else {
      tickets = await Ticket.find({ userId: req.userData.id })
        .skip((page - 1) * 20)
        .limit(20);
    }
    res.status(200).json({
      success: true,
      msg: 'ok',
      tickets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some server err',
      err,
    });
  }
});

//get req to view a required ticket
router.get('/ticket/:ticketId', async (req, res) => {
  try {
    const _id = req.params.ticketId;
    let ticket = null;

    if (req.userData.role === ADMIN) ticket = await Ticket.find({ _id });
    else ticket = await Ticket.find({ _id, userId: req.userData.id });

    res.status(200).json({
      success: true,
      msg: 'ok',
      ticket,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

router.put('/ticket/:ticketId', async (req, res) => {
  try {
    const _id = req.params.ticketId;
    // remove unmodified data
    const newData = sanatizeData(req.body);
    // TODO check if there any money that should be returned or requested
    const ticket = await Ticket.updateOne({ _id }, { $set: newData });

    res.status(200).json({
      success: true,
      msg: 'ok',
      ticket,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

router.delete('/ticket/:ticketId', async (req, res) => {
  try {
    const _id = req.params.ticketId;
    const { flightNumber } = await Ticket.findById(_id);
    let { email } = await User.findOne({ _id: req.userData.id });

    let deletedTicket = await Ticket.deleteTicket(_id);

    await sendMail(
      email,
      'flight ticket Canceled',
      `You canceled the tickets of the flight ${flightNumber}`
    );

    res.status(200).json({
      success: true,
      msg: 'ok',
      deletedTicket,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err: err.message,
    });
  }
});

module.exports = router;
