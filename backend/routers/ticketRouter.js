const express = require('express');
const router = express.Router();
const Ticket = require('../models/TicketModel');
const Reservation = require('../models/ReservationModel');
const nodemailer = require('nodemailer');

let testAccount = prepareMail();

const prepareMail = async () => {
  return await nodemailer.createTestAccount();
};

let transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: testAccount.user, // generated ethereal user
    pass: testAccount.pass, // generated ethereal password
  },
});

//TODO : reimplement sanatizeData
const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
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
        to: req.userData.mail,
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
        to: req.userData.mail,
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
