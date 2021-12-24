import StripeCheckout from "react-stripe-checkout";

function Pay({ children, onToken, amount, name }) {
  return (
    <div style={{ zIndex: "1" }}>
      <StripeCheckout
        stripeKey={process.env.REACT_APP_STRIPE_PUBKEY}
        token={onToken}
        name={name}
        amount={amount * 100}
      >
        {children}
      </StripeCheckout>
    </div>
  );
}

export default Pay;
