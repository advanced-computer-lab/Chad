const express = require('express');
const crypto = require('crypto');
const Reservation = require('../models/ReservationModel');
const Ticket = require('../models/TicketModel');
const User = require('../models/UserModel');
const Flight = require('../models/flightModel');
const sendMail = require('../controllers/mailSender');
const { USER } = require('../constants/userEnum');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const uuid = require('uuid');
const router = express.Router();

//TODO : reimplement sanatizeData
const sanatizeData = (data) => {
  ['creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
};

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

async function makePayment(price, email) {
  //TODO handle try catch and do whatever additional logic here
  //TODO IMPORTANT we need to save charges.pid in ticket model to be able to make refunds
  const customer = await stripe.customers.create({
    email: email,
    source: 'tok_amex',
  });
  const charges = await stripe.charges.create({
    amount: price,
    currency: 'usd',
    customer: customer.id,
  });
  return [charges.paid, charges.id];
}

router.post('/reservation', async (req, res) => {
  try {
    let { email } = await User.findOne({ _id: req.userData.id });
    const tickets = [];
    for (let ticket of req.body.tickets) {
      let _flight = await Flight.findOne({ _id: ticket._id });
      let class_idx;
      _flight.classInfo.forEach(({ Type }, i) => {
        if (Type === ticket.classType) class_idx = i;
      });
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
        const paymentResult = await makePayment(price, email);
        const [isPaid, paymentId] = paymentResult;
        if (!isPaid)
          res.status(500).json({
            success: false,
            msg: 'Could not process payment',
          });

        let result = await Ticket.create({
          seatNumber,
          isChild,
          price,
          paymentId: paymentId,
          // ?set this true for now
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
    let refund = { amount: 0 };

    if (req.userData.role === USER) {
      result = await Reservation.findOne({
        _id,
        userId: req.userData.id,
      }).populate('tickets');
      let{ paymentId }=result.tickets[0];
      if (paymentId) {
        refund = await stripe.refunds.create({
          charge: paymentId,
        });
      }
    } else {
      result = await Reservation.findOne({ _id }).populate('tickets');
    }
    if (result)
      for (let ticket of result.tickets) {
        await Ticket.findOneAndDelete({ _id: ticket });
      }

    await sendMail(
      email,
      'Cancel reservation',
      `amount refunded: ${refund.amount}`
    );

    res.status(200).json({
      success: true,
      msg: 'ok',
      result,
      refund,
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
