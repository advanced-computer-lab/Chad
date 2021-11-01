const { Router } = require('express');
const Flight = require('../models/flightModel');
/* flightNumber: {
      type: Number,
      required: true,
    },
    deprature: {
      type: Date,
      required: true,
    },
    arrival: {
      type: Date,
      required: true,
    },
    depratureLocation: {
      type: String,
      required: true,
    },
    arrivalLocation: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    classInfo: {
      type: [
        {
          type: String,
          start: Number,
          end: Number,
        },
      ],
      required: true,
    }
*/
const router = new Router();
router.post('/Search/:*', async (req, res) => {
  if (req.params) {
    const regex = new RegExp(escapeRegex(req.params), 'gi');
    try {
      let flights = await Flight.find({ name: regex });
      res.status(200).json({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: 'some db err',
      });
    }
  } else {
    try {
      let flights = await Flight.find({});
      res.status(200).json({
        success: true,
        msg: 'ok',
        Flight: flights,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: 'some db err',
      });
    }
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
