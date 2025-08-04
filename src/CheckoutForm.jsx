// import React, {useState} from 'react';
// import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [errorMessage, setErrorMessage] = useState(null);

//   const handleSubmit = async (event) => {
//     // We don't want to let default form submission happen here,
//     // which would refresh the page.
//     event.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js has not yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     const {error} = await stripe.confirmPayment({
//       //`Elements` instance that was used to create the Payment Element
//       elements,
//       confirmParams: {
//         return_url: 'http://localhost:4242/success.html',
//       },
//     });

//     if (error) {
//       // This point will only be reached if there is an immediate error when
//       // confirming the payment. Show error to your customer (for example, payment
//       // details incomplete)
//       setErrorMessage(error.message);
//     } else {
//       // Your customer will be redirected to your `return_url`. For some payment
//       // methods like iDEAL, your customer will be redirected to an intermediate
//       // site first to authorize the payment, then redirected to the `return_url`.
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <PaymentElement />
//       <button disabled={!stripe}>Submit</button>
//       {/* Show error message to your customers */}
//       {errorMessage && <div>{errorMessage}</div>}
//     </form>
//   )
// };

// export default CheckoutForm;

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Demo Total",
        amount: 5000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (!paymentRequest) return;

    paymentRequest.on("paymentmethod", async (ev) => {
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(
          ev.clientSecret,
          {
            payment_method: ev.paymentMethod.id,
          },
          { handleActions: false }
        );

      if (confirmError) {
        ev.complete("fail");
      } else {
        ev.complete("success");

        if (paymentIntent.status === "requires_action") {
          await stripe.confirmCardPayment(ev.clientSecret);
        }
      }
    });
  }, [paymentRequest, stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://yourdomain.com/thankyou", // optional
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {paymentRequest && (
        <div style={{ marginBottom: "16px" }}>
          <paymentRequest.Button paymentRequest={paymentRequest} />
        </div>
      )}

      <PaymentElement />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!stripe}
          style={{
            opacity: !stripe ? 0.6 : 1,
          }}
          className="w-full md:max-w-72 bg-[#ff7a00] text-white font-semibold mt-4 py-2 px-4 rounded-lg shadow-[1px_1px_4px_rgba(0,0,0,0.3)] border-b-2 border-r-2 border-orange-600 hover:border-orange-8 00 transition-300 cursor-pointer hover:bg-orange-600 transition-colors duration-300"
        >
          Pay
        </button>
      </div>

      {/* <button
        type="submit"
        disabled={!stripe}
        style={{ marginTop: "20px" }}
      >
        Pay
      </button> */}
    </form>
  );
}
