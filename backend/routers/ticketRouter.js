const express = require('express');
const router = express.Router();
const Ticket = require('../models/TicketModel');
const Reservation = require('../models/ReservationModel');
const sendMail = require('../controllers/mailSender');
const User = require('../models/UserModel');
const Flight = require('../models/flightModel');
const { ADMIN } = require('../constants/userEnum');
const stripe = require('stripe')(
  'sk_test_51K7yQbHzMRw1OlaDIJ5ncNimeLrpygHJZ5adZZ23LxLaCTyxJ8nQQS0iGrSbc9ipwWxDC5ibJOnQK3UCzeK2LPZv004K4FN79G'
);
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
    //TODO get the charge PID from ticket / reservation model whatever you want
    const paymentId = 'ch_3KA2g2HzMRw1OlaD1unDA6OQ';
    const refund = await stripe.refunds.create({
      charge: paymentId,
    });
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
        let _ticket = await Ticket.findOneAndDelete({ _id });
        deletedTickets.push(_ticket);
        //geting the difference between the original and deleted arrays which is the remaining tickets
        const tickets = reservation.tickets.filter((t) => t !== _ticket._id);
        let _flight = await Flight.findOne({
          flightNumber: _ticket.flightNumber,
        });

        let _idx = 0;
        for (let i = 0; i < _flight.classInfo.length; i++)
          if (_flight.classInfo[i].Type === _ticket.classType) _idx = i;
        _flight.classInfo[_idx].reserverdSeats = _flight.classInfo[
          _idx
        ].reserverdSeats.filter((sn) => sn !== _ticket.seatNumber);
        if (_ticket.isChild) {
          _flight.classInfo[_idx].availabelChildrenSeats++;
          _flight.classInfo[_idx].availabelAdultsSeats++;
        } else {
          _flight.classInfo[_idx].availabelAdultsSeats++;
          _flight.classInfo[_idx].availabelChildrenSeats = Math.min(
            _flight.classInfo[_idx].childrenLimit,
            _flight.classInfo[_idx].availabelChildrenSeats + 1
          );
        }
        await _flight.save();
        // to reset the array of tickets

        if (tickets.length) {
          await Reservation.updateOne(reservation, { tickets });
        } else {
          await Reservation.findOneAndDelete(reservation);
        }
        await sendMail(
          email,
          'Cancel ticket',
          `You canceled your ticket`,
          `amount refunded: ${refund.amount}`
        );
      } else {
        for (let ticketId of reservation.tickets) {
          let _ticket = await Ticket.findOneAndDelete({ _id: ticketId });
          if (!_ticket) continue;
          let _flight = await Flight.findOne({
            flightNumber: _ticket.flightNumber,
          });
          let _idx = 0;
          for (let i = 0; i < _flight.classInfo.length; i++)
            if (_flight.classInfo[i].Type === _ticket.classType) _idx = i;
          _flight.classInfo[_idx].reserverdSeats = _flight.classInfo[
            _idx
          ].reserverdSeats.filter((sn) => sn !== _ticket.seatNumber);
          if (_ticket.isChild) {
            _flight.classInfo[_idx].availabelChildrenSeats++;
            _flight.classInfo[_idx].availabelAdultsSeats++;
          } else {
            _flight.classInfo[_idx].availabelAdultsSeats++;
            _flight.classInfo[_idx].availabelChildrenSeats = Math.min(
              _flight.classInfo[_idx].childrenLimit,
              _flight.classInfo[_idx].availabelChildrenSeats + 1
            );
          }
          await _flight.save();
        }

        await Reservation.findOneAndDelete({ reservation });
      }
      await sendMail(
        email,
        'flight ticket Canceled',
        `You canceled the tickets of the flight ${flightNumber}`
      );
      // console.log(res2);
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
