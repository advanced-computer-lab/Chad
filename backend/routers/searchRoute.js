const { Router } = require('express');
const Flight = require('../models/flightModel');

const getAttributes = (attributes) => {
  let attribute = {};
  for (let propName in attributes) {
    attribute[propName] = new RegExp(escapeRegex(attributes[propName]), 'gi');
  }
  return attribute;
};
let router = new Router();
router.post(
  '/search/:depatureLocation/:depature/:arrival/:arrivalLocation',
  async (req, res) => {
    console.log(req.params);
    const attributes = getAttributes(req.params);
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
  }
);

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
