import { useEffect, useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm.jsx";

const initStripe = async () => {
  const res = await axios.get("/api/publishable-key");
  const publishableKey = await res.data.publishable_key;

  return loadStripe(publishableKey);
};

const Checkout = () => {
  const stripePromise = initStripe();

  const [clientSecretSettings, setClientSecretSettings] = useState({
    clientSecret: "",
    loading: true,
  });

  useEffect(() => {
    async function createPaymentIntent() {
      const response = await axios.post("/api/create-payment-intent", {});

      setClientSecretSettings({
        clientSecret: response.data.client_secret,
        loading: false,
      });
    }

    createPaymentIntent();
  }, []);

  return (
    <div className="bg-orange-50 min-h-screen flex items-center justify-center">
      {clientSecretSettings.loading ? (
        <div>
          <img
            className="size-[70px]"
            src="https://discuss.wxpython.org/uploads/default/original/2X/6/6d0ec30d8b8f77ab999f765edd8866e8a97d59a3.gif"
            alt="loading-spinner"
          />
        </div>
      ) : (
        <div className="w-full sm:w-[700px] p-8 m-4 bg-white border border-slate-200 rounded-lg shadow-md">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: clientSecretSettings.clientSecret,
              appearance: {
                theme: "flat",
                variables: {
                  colorPrimary: "#E97000",
                  colorBackground: "#ffffff",
                  colorText: "#333333",
                  colorDanger: "#df1b41",
                  fontFamily: "Inter, sans-serif",
                  fontSizeBase: "13px",
                  spacingUnit: "4px",
                  borderRadius: "8px",
                },
                rules: {
                  ".Input": {
                    border: "2px solid #E97000",
                    boxShadow: "none",
                    padding: "11px",
                  },
                  ".Input:focus": {
                    border: "1px solid #ff5500",
                    outline: "none",
                  },
                  ".Input--invalid": {
                    border: "0.5px solid #df1b41",
                  },
                  ".Label": {
                    fontWeight: "700",
                    color: "#E97000",
                    fontSizeBase: "14px",
                  },
                },
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        </div>

        // <Elements
        //   stripe={stripePromise}
        //   options={{
        //     clientSecret: clientSecretSettings.clientSecret,
        //     appearance: { theme: "stripe" },
        //   }}
        // >
        //   <CheckoutForm />
        // </Elements>
      )}
    </div>
  );
};

export default Checkout;
