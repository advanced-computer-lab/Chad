const express = require('express');
const router = express.Router();
const Ticket = require('../models/TicketModel');
const sendMail = require('../controllers/mailSender');
const User = require('../models/UserModel');
const Flight = require('../models/flightModel');
const { makePayment, makeRefund } = require('../utils/paymentUtils');
const { ADMIN } = require('../constants/userEnum');

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
    let { email } = await User.findOne({ _id: req.userData.id });
    const _id = req.params.ticketId;
    const { seatNumber, classType, token } = req.body;

    const _ticket = await Ticket.findOne({ _id });
    const _flight = await Flight.findOne({
      flightNumber: _ticket.flightNumber,
    });

    // check if there any refund or needed money
    const classIdx = _flight.classInfo.findIndex(
      ({ Type }) => Type == classType
    );
    let oldPrice = _ticket.price,
      newPrice = _ticket.isChild
        ? _flight.classInfo[classIdx].priceForChild
        : _flight.classInfo[classIdx].priceForAdult;

    if (oldPrice < newPrice && !token?.id) {
      throw new Error('invald action');
    } else if (oldPrice < newPrice) {
      makePayment(newPrice - oldPrice, email, token);
    } else if (oldPrice > newPrice) {
      makeRefund(oldPrice - newPrice, _ticket.paymentId);
    }

    const ticket = await Ticket.updateSeat(_id, {
      seatNumber,
      classType,
    });

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
      errMsg: err.message,
    });
  }
});

router.delete('/ticket/:ticketId', async (req, res) => {
  try {
    const _id = req.params.ticketId;
    const { flightNumber, price, paymentId } = await Ticket.findById(_id);
    let { email } = await User.findOne({ _id: req.userData.id });

    await makeRefund(price, paymentId);
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
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err: err.message,
    });
  }
});

module.exports = router;
