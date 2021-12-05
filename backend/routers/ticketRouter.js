const express = require('express');
const router = express.Router();
const Ticket = require('../models/TicketModel');
const Reservation = require('../models/ReservationModel');
const sendMail = require('../controllers/mailSender');
const User = require('../models/UserModel');
const { ADMIN } = require('../constants/userEnum');

//TODO : reimplement sanatizeData
const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
};

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
    let { email } = await User.findOne({ _id: req.userData.id });

    const _id = req.params.ticketId;
    const { flightNumber } = await Ticket.findById(_id);
    let reservation = null;

    if (req.userData.role === ADMIN) {
      reservation = await Reservation.findOne({ tickets: _id });
    } else {
      reservation = await Reservation.findOne({
        userId: req.userData.id,
        tickets: _id,
      });
    }

    if (reservation) {
      for (let ticketId of reservation.tickets) {
        const ticket = await Ticket.findOne({ _id: ticketId, flightNumber });
        if (ticketId != _id && ticket && !ticket?.isChild) {
          permission = true;
        }
      }

      if (permission) {
        deletedTickets.push(await Ticket.findOneAndDelete({ _id }));
        //geting the difference between the original and deleted arrays which is the remaining tickets
        const tickets = reservation.tickets.filter(
          (x) => !deletedTickets.includes(x)
        );
        // to reset the array of tickets
        await Reservation.updateOne({ reservation }, { tickets });
        await sendMail(email, 'Cancel ticket', `You canceled your ticket`);
      } else {
        for (let ticketId of reservation.tickets) {
          deletedTickets.push(
            await Ticket.findOneAndDelete({ _id: ticketId, flightNumber })
          );
        }

        if (reservation.tickets.length === deletedTickets.length) {
          await Reservation.findOneAndDelete(reservation);
          await sendMail(
            email,
            'Cancel reservation',
            `You canceled your reservation to the tickets of the flight number ${flightNumber}`
          );
        } else {
          const tickets = reservation.tickets.filter(
            (x) => !deletedTickets.includes(x)
          );
          await Reservation.updateOne({ reservation }, { tickets });
          await sendMail(
            email,
            'Cancel flight tickets',
            `You canceled the tickets of the flight ${flightNumber}`
          );
        }
      }
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
