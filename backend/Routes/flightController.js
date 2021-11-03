const express = require('express');
const router = express.Router();
const Flight = require('../Models/Flight');

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

module.exports = router;
