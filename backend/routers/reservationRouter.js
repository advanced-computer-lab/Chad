const express = require('express');
const router = express.Router();
const Reservation = require('../models/ReservationModel');
const Ticket = require('../models/TicketModel');
const User = require('../models/UserModel');
const { USER } = require('../constants/userEnum');
const sendMail = require('../controllers/mailSender');
//TODO : reimplement sanatizeData
const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
};

router.get('/reservations/:page', async (req, res) => {
  try {
    let page = Number(req.params.page);
    let reservation = null;
    if (req.userData.role === USER) {
      reservation = await Reservation.find({ userId: req.userData.id })
        .populate('Ticket')
        .skip((page - 1) * 20)
        .limit(20);
    } else {
      reservation = await Reservation.find()
        .populate('Ticket')
        .skip((page - 1) * 20)
        .limit(20);
    }

    res.status(200).json({
      success: true,
      msg: 'ok',
      reservation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some server err',
      err,
    });
  }
});

router.get('/reservation/:reservationId', async (req, res) => {
  try {
    let _id = req.params.reservationId;
    let reservation = null;
    if (req.userData.role === USER)
      reservation = await Reservation.find({
        _id,
        userId: req.userData.id,
      }).populate('Ticket');
    else reservation = await Reservation.find({ _id }).populate('Ticket');

    res.status(200).json({
      success: true,
      msg: 'ok',
      reservation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some server err',
      err,
    });
  }
});

router.post('/reservation', async (req, res) => {
  try {
    const tickets = [];
    for (let reservation of req.body.reservations) {
      let ticket = reservation.flight;
      for (let seat of reservation.seats) {
        ticket.seatNumber = seat;
        let result = await Ticket.create(ticket);
        tickets.push(result._id);
      }
    }
    let reservation = await Reservation.create({
      tickets,
      userId: req.userData.id,
    });

    res.status(200).json({
      success: true,
      msg: 'ok',
      reservation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

router.put('/reservation/:reservationId', async (req, res) => {
  try {
    const _id = req.params.reservationId;
    // remove unmodified data
    // TODO : implement sanatizeData
    const newData = sanatizeData(req.body);
    const reservation = await Reservation.updateOne({ _id }, { $set: newData });

    res.status(200).json({
      success: true,
      msg: 'ok',
      reservation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

router.delete('/reservation/:reservationId', async (req, res) => {
  try {
    const _id = req.params.reservationId;
    let result = {};
    let { email } = await User.findOne({ _id: req.userData.id });

    if (req.userData.role === USER) {
      result = await Reservation.findOneAndDelete({
        _id,
        userId: req.userData.id,
      });
    } else {
      result = await Reservation.findOneAndDelete({ _id });
    }
    if (result)
      for (let ticket of result.tickets) {
        await Ticket.findOneAndDelete({ _id: ticket });
      }

    await sendMail(
      email,
      'Cancel reservation',
      'you have cancelled your reservation'
    );

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
