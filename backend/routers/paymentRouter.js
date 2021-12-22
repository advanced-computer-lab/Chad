const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

router.post('pay', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      // map of items(adults and children tickets)
      // item is the element we will pay for
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: 'EGP',
            product_data: {
              name: item.name, // flight name + adult (or child)
            },
            unit_amount: item.price, // price for a ticket
          },
          quantity: item.quantity,
        };
      }),
      success_url: `http://localhost:3000/`, // redirect to search
      cancel_url: `http://localhost:3001/`, // redirect to cancel page
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'some db err',
      err,
    });
  }
});

module.exports = router;
