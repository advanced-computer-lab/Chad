const express = require('express');
const router = express.Router();
const Flight = require('../Models/Flight');

//git req to view all the flights
router.get('/', (req, res) => {
  Flight.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// post req to add a flight
router.post('/', (req, res) => {
  Flight.find({ flightNumber: req.body.flightNumber })
    .then((data) => {
      if (data.length == 0) {
        let flight = Flight(req.body);
        // flight.creatorId = req.session._id;
        // if(req.session.role == "admin"){
        Flight.collection.insertOne(flight);
        res.status(201).send(flight);
        // }
        // else{
        //     res.status(401).send("You are not authorizer to do such action");
        // }
      } else {
        res
          .status(400)
          .send('There is a flight with this number already created');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//patch req to update a flight using an id
router.patch('/:flightNumber', (req, res) => {
  Flight.find({ flightNumber: parseInt(req.params.flightNumber) }).then(
    (data) => {
      if (data.length == 1) {
        // if(req.session.role == "admin" && req.session._id == (data[0]).creatorId){
        Flight.collection
          .updateOne(
            { flightNumber: parseInt(req.params.flightNumber) },
            { $set: req.body }
          )
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            console.log(err);
          });
        // }
        // else{
        //     res.status(401).send("You are not authorizer to do such action");
        // }
      } else {
        res.status(400).send('There is no flight with this number');
      }
    }
  );
});

//delete req
router.delete('/:flightNumber', (req, res) => {
  Flight.find({ flightNumber: parseInt(req.params.flightNumber) }).then(
    (data) => {
      // if(req.session.role == "admin" && req.session._id == (data[0]).creatorId){
      Flight.collection
        .deleteOne({ flightNumber: parseInt(req.params.flightNumber) })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          console.log(err);
        });
      // }
      // else{
      //     res.status(401).send("You are not authorizer to do such action");
      // }
    }
  );
});

module.exports = router;
