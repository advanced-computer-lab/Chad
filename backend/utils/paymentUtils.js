const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  makePayment: async (price, email, token) => {
    const charges = await stripe.charges.create({
      amount: price * 100,
      currency: 'usd',
      receipt_email: email,
      source: token.id,
    });
    return [charges.paid, charges.id];
  },
  makeRefund: async (price, id) => {
    const refund = await stripe.refunds.create({
      charge: id,
      amount: price * 100,
    });
    return refund.status === 'succeeded';
  },
};
