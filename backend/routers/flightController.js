const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

//git req to view all the flights
router.get('/all/:page', (req, res) => {
  const page = req.params.page;
  Flight.find()
    .skip((page - 1) * 20)
    .limit(20)
    .then((data) => {
      res.status(200).send({ success: true, flights: data });
    })
    .catch((err) => {
      res.status(500).send({ success: false, message: err.message });
    });
});

//git req to view a required flight
router.get('/:flightNumber', (req, res) => {
  Flight.find({ flightNumber: parseInt(req.params.flightNumber) })
    .then((data) => {
      if (data.length == 0) {
        res.status(400).send({
          success: false,
          message: 'There is no fligths with this number',
        });
      } else {
        res.status(200).send({ success: true, flight: data });
      }
    })
    .catch((err) => {
      res.status(500).send({ success: false, message: err.message });
    });
});

// post req to add a flight
router.post('/', (req, res) => {
  Flight.find({ flightNumber: req.body.flightNumber })
    .then((data) => {
      if (data.length == 0) {
        let flight = Flight(req.body);
        flight.creatorId = req.userData.id;
        if (req.userData.role == 'admin') {
          Flight.collection.insertOne(flight);
          res.status(201).send({ success: true, created: data });
        } else {
          res
            .status(401)
            .send({
              success: false,
              message: 'You are not authorizer to do such action',
            });
        }
      } else {
        res.status(400).send({
          success: false,
          message: 'There is a flight with this number already created',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ success: false, message: err.message });
    });
});

//patch req to update a flight using an id
router.patch('/:flightNumber', (req, res) => {
  Flight.find({ flightNumber: parseInt(req.params.flightNumber) }).then(
    (data) => {
      if (data.length == 1) {
        if (
          req.userData.role == 'admin' &&
          req.userData.id == data[0].creatorId
        ) {
          Flight.collection
            .updateOne(
              { flightNumber: parseInt(req.params.flightNumber) },
              { $set: req.body }
            )
            .then((data) => {
              res.status(201).send({
                success: true,
                updated: 'The flight was updated successfully',
              });
            })
            .catch((err) => {
              res.status(500).send({ success: false, message: err.message });
            });
        } else {
          res
            .status(401)
            .send({
              success: false,
              message: 'You are not authorizer to do such action',
            });
        }
      } else {
        res.status(400).send({
          success: false,
          message: 'There is no flight with this number',
        });
      }
    }
  );
});

//delete req
router.delete('/:flightNumber', (req, res) => {
  Flight.find({ flightNumber: parseInt(req.params.flightNumber) }).then(
    (data) => {
      if (
        req.userData.role == 'admin' &&
        req.userData.id == data[0].creatorId
      ) {
        Flight.collection
          .deleteOne({ flightNumber: parseInt(req.params.flightNumber) })
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({ success: false, message: err.message });
          });
      } else {
        res
          .status(401)
          .send({
            success: false,
            message: 'You are not authorizer to do such action',
          });
      }
    }
  );
});

module.exports = router;
