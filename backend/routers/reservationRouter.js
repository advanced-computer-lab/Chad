const express = require('express');
const crypto = require('crypto');
const Reservation = require('../models/ReservationModel');
const Ticket = require('../models/TicketModel');
const User = require('../models/UserModel');
const Flight = require('../models/flightModel');
const sendMail = require('../controllers/mailSender');
const { USER } = require('../constants/userEnum');

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

router.post('/reservation', async (req, res) => {
  try {
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

        let result = await Ticket.create({
          seatNumber,
          isChild,
          price,
          // ?set this true for now
          paid: true,
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

/*
 "_id": "61c25564b703c422b570a1d6",
            "tickets": [
                {
                    "_id": "61c25563b703c422b570a1d1",
                    "ticketNumber": "cf7da2c3c647",
                    "flightNumber": "FN1",
                    "departure": "2021-12-03T05:24:00.000Z",
                    "arrival": "2021-12-03T01:24:00.000Z",
                    "departureLocation": {
                        "_id": "61a28ae654e0e34ec732b4cc",
                        "name": "YYZ",
                        "createdAt": "2021-11-27T19:45:42.338Z",
                        "updatedAt": "2021-11-27T19:45:42.338Z",
                        "__v": 0
                    },
                    "arrivalLocation": {
                        "_id": "61a28ae654e0e34ec732b4d0",
                        "name": "LHR",
                        "createdAt": "2021-11-27T19:45:42.339Z",
                        "updatedAt": "2021-11-27T19:45:42.339Z",
                        "__v": 0
                    },
                    "userId": "61c0aa02cc23a94b11f65f7c",
                    "price": 10,
                    "seatNumber": 3,
                    "classType": "economy",
                    "isChild": false,
                    "date": "2021-12-21T22:29:55.336Z",
                    "paid": true,
                    "createdAt": "2021-12-21T22:29:55.893Z",
                    "updatedAt": "2021-12-21T22:29:55.893Z",
                    "__v": 0
                },
*/

router.put('/reservation/:reservationId', async (req, res) => {
  try {
    const _id = req.params.reservationId;
    // remove unmodified data
    // TODO : implement sanatizeData
    const newData = sanatizeData(req.body);
    // console.log(newData['tickets']);
    for (let { ticket } of newData['tickets']) {
      // console.log(ticket._id);
      let flight = await Flight.findOne({ flightNumber: ticket._id });
      // console.log(flight);
      let classIndex = ticket.newClass;
      //console.log(ticket.newClass, 'XXX');
      flight.classInfo.forEach(({ Type }, i) => {
        if (Type === ticket.newClass) classIndex = i;
      });

      for (let i = 0; i < newData['tickets'].length; i++) {
        // let ticket = { ticket };
        let newSeat = ticket.newSeat;
        let oldSeat = ticket.oldSeat;
        let oldPrice = ticket.oldPrice;
        let price = ticket.newPrice;
        let isChild = ticket.isChild;
        let isChildOld = ticket.isChildOld;
        //if the seat is already reserved
        console.log(newSeat, 'HERE');
        console.log(classIndex);
        if (
          flight.classInfo[classIndex].reserverdSeats.includes(newSeat) ||
          !flight.classInfo[classIndex].availabelAdultsSeats
        ) {
          throw new Error('Seat is already reserved');
        }
        console.log('HERE');
        //remove old seat and reserve the new seat
        flight.classInfo[classIndex].reserverdSeats.push(newSeat);
        const index =
          flight.classInfo[classIndex].reserverdSeats.indexOf(oldSeat);
        if (index > -1) {
          flight.classInfo[classIndex].reserverdSeats.splice(index, 1);
        }

        if (isChild) {
          flight.classInfo[classIndex].availabelAdultsSeats--;
          flight.classInfo[classIndex].availabelChildrenSeats--;
        } else {
          flight.classInfo[classIndex].availabelAdultsSeats--;
          flight.classInfo[classIndex].availabelChildrenSeats = Math.min(
            flight.classInfo[classIndex].availabelAdultsSeats,
            flight.classInfo[classIndex].availabelChildrenSeats
          );
        }
        //check this logic
        //reversing the operation of reserving a seat
        if (isChildOld) {
          flight.classInfo[classIndex].availabelAdultsSeats++;
          flight.classInfo[classIndex].availabelChildrenSeats++;
        } else {
          flight.classInfo[classIndex].availabelAdultsSeats++;
          flight.classInfo[classIndex].availabelChildrenSeats = Math.min(
            flight.classInfo[classIndex].availabelAdultsSeats,
            flight.classInfo[classIndex].availabelChildrenSeats
          );
        }
        if (price != oldPrice) console.log('CHANGE IN PRICE');
        await flight.save();
        let result = await Ticket.updateOne(
          { _id: ticket._id },
          { newSeat, isChild, price }
        );
        console.log(result);
      }
    }

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
