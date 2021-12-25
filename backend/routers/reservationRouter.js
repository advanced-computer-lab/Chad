const express = require('express');
const crypto = require('crypto');
const Reservation = require('../models/ReservationModel');
const Ticket = require('../models/TicketModel');
const User = require('../models/UserModel');
const Flight = require('../models/flightModel');
const sendMail = require('../controllers/mailSender');
const { USER } = require('../constants/userEnum');
const { makePayment, makeRefund } = require('../utils/paymentUtils.js');

const router = express.Router();

router.get('/reservations/:page', async (req, res) => {
  try {
    let page = Number(req.params.page);
    let numberOfReservations = 0;

    let reservations = null;
    if (req.userData.role === USER) {
      numberOfReservations = await Reservation.find({
        userId: req.userData.id,
      }).countDocuments();
      reservations = await Reservation.find({ userId: req.userData.id })
        .populate('tickets')
        .populate({
          path: 'tickets',
          populate: {
            path: 'departureLocation',
            model: 'Place',
          },
        })
        .populate({
          path: 'tickets',
          populate: {
            path: 'arrivalLocation',
            model: 'Place',
          },
        })
        .skip((page - 1) * 20)
        .limit(20);
    } else {
      numberOfReservations = await Reservation.find({}).countDocuments();
      reservations = await Reservation.find()
        .populate('tickets')
        .skip((page - 1) * 20)
        .limit(20);
    }

    res.status(200).json({
      success: true,
      msg: 'ok',
      reservations,
      maxPages: Math.ceil(numberOfReservations / 20),
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
    else
      reservation = await Reservation.find({ _id })
        .populate('tickets')
        .populate({
          path: 'tickets',
          populate: {
            path: 'departureLocation',
            model: 'Place',
          },
        })
        .populate({
          path: 'tickets',
          populate: {
            path: 'arrivalLocation',
            model: 'Place',
          },
        });

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
    const { email } = await User.findOne({ _id: req.userData.id });
    const { token } = await req.body;
    const tickets = [];

    let totalPrice = req.body.tickets.reduce(
      (acc, { seats }) =>
        acc + seats.reduce((acc, { price }) => acc + price, 0),
      0
    );
    const [isPaid, paymentId] = await makePayment(totalPrice, email, token);
    if (!isPaid) {
      throw new Error('payment not success');
    }

    for (let ticket of req.body.tickets) {
      let _flight = await Flight.findOne({ _id: ticket._id });
      let class_idx = _flight.classInfo.findIndex(
        ({ Type }) => Type === ticket.classType
      );
      for (let { seatNumber, price, isChild } of ticket.seats) {
        // if the seat is already there throw an error
        if (
          _flight.classInfo[class_idx].reserverdSeats.includes(seatNumber) ||
          !_flight.classInfo[class_idx].availabelAdultsSeats
        ) {
          throw new Error('the seat is reserved');
        }

        // add the seats to the reserced ones and update the availality
        _flight.classInfo[class_idx].reserverdSeats.push(seatNumber);
        if (isChild) {
          _flight.classInfo[class_idx].availabelAdultsSeats--;
          _flight.classInfo[class_idx].availabelChildrenSeats--;
        } else {
          _flight.classInfo[class_idx].availabelAdultsSeats--;
          _flight.classInfo[class_idx].availabelChildrenSeats = Math.min(
            _flight.classInfo[class_idx].availabelAdultsSeats,
            _flight.classInfo[class_idx].availabelChildrenSeats
          );
        }
        await _flight.save();

        let result = await Ticket.create({
          seatNumber,
          isChild,
          price,
          paymentId: paymentId,
          paid: isPaid,
          // GENERATE UNIQUE TICKET NUMBERS
          ticketNumber: crypto.randomBytes(6).toString('hex'),
          userId: req.userData.id,
          ...[
            'date',
            'classType',
            'flightNumber',
            'departure',
            'arrival',
            'departureLocation',
            'arrivalLocation',
          ].reduce((acc, curr) => {
            acc[curr] = ticket[curr];
            return acc;
          }, {}),
        });
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

router.delete('/reservation/:reservationId', async (req, res) => {
  try {
    const _id = req.params.reservationId;
    let reservation;
    let { email } = await User.findOne({ _id: req.userData.id });

    if (req.userData.role === USER) {
      reservation = await Reservation.findOneAndDelete({
        _id,
        userId: req.userData.id,
      });
    } else {
      reservation = await Reservation.findOneAndDelete({ _id }).populate(
        'tickets'
      );
    }

    let totalPrice;
    if (reservation) {
      totalPrice = reservation.tickets.reduce(
        (acc, { price }) => acc + price,
        0
      );
      await makeRefund(totalPrice, reservation.tickets[0].paymentId);
      for (let ticket of reservation.tickets) {
        await Ticket.deleteTicket(ticket._id);
      }
    } else {
      throw new Error("you can't perform this action");
    }

    await sendMail(
      email,
      'Reservation Cancelled',
      `your reservation have been cancelled and all the payments ${totalPrice} $have been refunded`
    );

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

module.exports = router;
