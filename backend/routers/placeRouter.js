const express = require('express');
const router = express.Router();
const Place = require('../models/PlaceModel');

router.get('/place', async (req, res) => {
  try {
    const places = await Place.find({}).select(['_id', 'name']);
    res.status(200).json({
      success: true,
      msg: 'ok',
      places,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some server err',
      err,
    });
  }
});

module.exports = router;
