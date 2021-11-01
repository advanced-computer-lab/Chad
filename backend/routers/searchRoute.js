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
//what if one of the parameters was null ?
router.post(
  '/search/:depatureLocation/:depature/:arrival/:arrivalLocation',
  async (req, res) => {
    console.log(req.params);
    //some attributes are datetime objects , you need to see thier format and match them
    const attributes = getAttributes(req.params);
    console.log(attributes);
    if (attributes) {
      //why 2 try catches instead of one surrounding all as both having same meaning ?
      try {
        //monitor find function behaviour and how does it match attributes
        //you need pagination as their might be a huge result coming back
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
        //pagination
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
