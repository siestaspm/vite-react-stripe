import { useState } from "react";
import axios from "axios";

const Refund = () => {
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [amount, setAmount] = useState(""); // Optional: in USD
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRefund = async (e) => {
    e.preventDefault();
    if (!paymentIntentId) {
      alert("Payment Intent ID is required.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post("/api/refund", {
        paymentIntentId,
        amount: amount ? parseInt(parseFloat(amount) * 100) : undefined, // Convert dollars to cents
      });

      if (response.data.success) {
        setStatus({ success: true, message: "Refund successful!" });
      } else {
        setStatus({ success: false, message: response.data.error });
      }
    } catch (err) {
      setStatus({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Issue a Refund</h2>

        <form onSubmit={handleRefund}>
          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-700">
              Payment Intent ID
            </label>
            <input
              type="text"
              value={paymentIntentId}
              onChange={(e) => setPaymentIntentId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1 text-gray-700">
              Refund Amount (USD)
              <span className="text-gray-500 text-sm ml-1">(leave blank for full)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Refund"}
          </button>
        </form>

        {status && (
          <div
            className={`mt-4 p-3 rounded ${
              status.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Refund;
