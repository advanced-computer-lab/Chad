const express = require('express');
const { ADMIN } = require('../constants/userEnum');
const router = express.Router();
const Flight = require('../models/flightModel');

// helper functions

// remove the fields that cannot be modified
const sanatizeData = (data) => {
  ['flightNumber', 'creatorId', '_id'].forEach((f) => delete data[f]);
  return data;
};

// use middleware to handle unautherized access
router.use((req, res, next) => {
  if (
    req.userData.role === ADMIN ||
    (!req.url.includes('flights') && req.method === 'GET')
  ) {
    next();
    return;
  } else {
    res.status(401).json({
      success: false,
      msg: 'unautherized access',
    });
  }
});

//git req to view all the flights
router.get('/flights/:page', async (req, res) => {
  try {
    const page = Number(req.params.page);
    const flights = await Flight.find()
      .skip((page - 1) * 20)
      .limit(20);
    res.status(200).json({
      success: true,
      msg: 'ok',
      flights,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some server err',
      err,
    });
  }
});

//git req to view a required flight
router.get('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    let flight = await Flight.findOne({ _id });

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

// post req to add a flight
router.post('/flight', async (req, res) => {
  try {
    let flight = await Flight.create(req.body);

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

//patch req to update a flight using an id
router.patch('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    // remove unmodified data
    const newData = sanatizeData(req.body);
    const flight = await Flight.updateOne({ _id }, { $set: newData });

    res.status(200).json({
      success: true,
      msg: 'ok',
      flight,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

//delete req
router.delete('/flight/:flightId', async (req, res) => {
  try {
    const _id = req.params.flightId;
    const result = await Flight.deleteOne({ _id });

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
