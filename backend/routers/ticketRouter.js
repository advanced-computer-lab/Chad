const express = require('express');
const router = express.Router();
const Ticket = require('../models/TicketModel');
const Reservation = require('../models/ReservationModel');
const nodemailer = require('nodemailer');
const User = require('../models/UserModel');
const { ADMIN, USER } = require('../constants/userEnum');

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

router.use((req, res, next) => {
  if (
    req.userData?.role === ADMIN ||
    (req.userData?.role === USER &&
      !req.url.includes('tickets') &&
      !req.method === 'POST')
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

//get req to view all the tickets
router.get('/tickets/:page', async (req, res) => {
  try {
    const page = Number(req.params.page);
    let tickets = await Ticket.find()
      .skip((page - 1) * 20)
      .limit(20);

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
    // TODO : implement sanatizeData
    const newData = sanatizeData(req.body);
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
    let permission = false;
    let deletedTickets = [];
    let mail = await User.find({ _id: req.userData.id });

    const _id = req.params.ticketId;
    const reservation = await Reservation.find({ tickets: [_id] });

    for (let ticketId in reservation.tickets) {
      if (ticketId != _id) {
        let ticket = await Ticket.findOne({ _id: ticketId });
        if (!ticket.isChild) {
          permission = true;
        }
      }
    }

    if (permission) {
      deletedTickets.push(await Ticket.findOneAndDelete({ _id }));
      await transporter.sendMail({
        from: '"Chad Airlines" <airlineschad@gmail.com>',
        to: mail,
        subject: 'Cancel ticket',
        text: `You canceled your ticket`,
      });
    } else {
      const result = await Reservation.findOneAndDelete(reservation);

      for (let ticket in result.tickets) {
        deletedTickets.push(await Ticket.findOneAndDelete({ _id: ticket }));
      }

      await transporter.sendMail({
        from: '"Chad Airlines" <airlineschad@gmail.com>',
        to: mail,
        subject: 'Cancel reservation',
        text: `You canceled your reservation to the tickets`,
      });
    }
    res.status(200).json({
      success: true,
      msg: 'ok',
      deletedTickets,
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
