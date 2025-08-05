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
    </form>
  );
}
