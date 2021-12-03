const express = require('express');
const router = express.Router();
const Reservation = require('../models/ReservationModel');
const Ticket = require('../models/TicketModel');
const User = require('../models/UserModel');
const nodemailer = require('nodemailer');
const { USER } = require('../constants/userEnum');

const prepareMail = async () => {
  return await nodemailer.createTestAccount();
};

let testAccount = prepareMail();

let transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

//TODO : reimplement sanatizeData
const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
};

const joinReservationAndTicket = async (reservations) => {
  const result = [];
  for (let reservation in reservations) {
    let tickets = [];
    for (let _id of reservation.tickets) {
      let ticket = await Ticket.findOne({ _id });
      tickets.push(ticket);
    }
    result.push({
      userId: reservation.userId,
      tickets,
    });
  }
  return result;
};

router.use((req, res, next) => {
  if (req.userData) {
    next();
    return;
  } else {
    res.status(401).json({
      success: false,
      msg: 'unautherized access',
    });
  }
});

router.get('/reservations/:page', async (req, res) => {
  try {
    let page = Number(req.params.page);
    let reservation = null;
    if (req.userData.role === USER)
      reservation = await Reservation.find({ userId: req.userData.id })
        .skip((page - 1) * 20)
        .limit(20);
    else
      reservation = await Reservation.find()
        .skip((page - 1) * 20)
        .limit(20);
    reservation = await joinReservationAndTicket(reservation);

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
    let _id = Number(req.params.page);
    let reservation = null;
    if (req.userData.role === USER)
      reservation = await Reservation.find({ _id, userId: req.userData.id });
    else reservation = await Reservation.find({ _id });
    reservation = await joinReservationAndTicket(reservation);

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
    for (let reservation in req.body.reservations) {
      let ticket = reservation.flight[0];
      for (let seat in reservation.seats) {
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
    let result = [];
    let mail = User.findOne();

    if (req.userData.role === USER)
      result = await Reservation.findOneAndDelete({
        _id,
        userId: req.userData.id,
      });
    else result = await Reservation.findOneAndDelete({ _id });

    for (let ticket in result.tickets) {
      await Ticket.findOneAndDelete({ _id: ticket });
    }

    await transporter.sendMail({
      from: '"Chad Airlines" <airlineschad@gmail.com>',
      to: mail,
      subject: 'Cancel reservation',
      text: `You canceled your reservation to the tickets`,
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
