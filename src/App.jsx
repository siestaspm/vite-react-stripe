import Checkout from "./Checkout.jsx";
import Refund from "./Refund.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start justify-center">
      <Checkout />
      <Refund />
    </div>
  );
}

export default App;
