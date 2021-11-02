const { Router, json } = require('express');
const Flight = require('../models/flightModel');
const mongoose = require('mongoose');
let router = new Router();

router.post('/search', async (req, res) => {
  console.log(req.body);
  const attributes = Regex(req.body);
  console.log(attributes);
  if (attributes) {
    try {
      let flights = await Flight.find(attributes);
      res.status(200).send({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        msg: 'some db err',
      });
    }
  } else {
    try {
      let flights = await Flight.find({});
      res.status(200).send({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        msg: 'some db err',
      });
    }
  }
});

const Regex = (attributes) => {
  let regexAttributes = {};
  const idRegex = /id/i;
  for (let key in attributes) {
    if (key.includes('Location')) {
      regexAttributes[key] = new RegExp(attributes[key], 'i');
    } else if (idRegex.test(key)) {
      regexAttributes[key] = mongoose.Types.ObjectId(attributes[key]);
    } else if (key == 'flightNumber') {
      regexAttributes[key] = Number(attributes[key]);
    } else {
      regexAttributes[key] = Date(attributes[key]);
    }
  }
  return regexAttributes;
};

module.exports = router;
