require("dotenv").config();

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const stripe = require("stripe")('sk_test_51Rr9u01In1kDemSfvcojvArdJDIRJCDZaNQmJ4rf8YG6vlJ3fiTZmQlZiT17TkqiX7VXds4UYKOhxNYAwfEqV0PM0022BHGmLc');

// Fetch the publishable key to initialize Stripe.js
fastify.get("/publishable-key", () => {
  return { publishable_key: 'pk_test_51Rr9u01In1kDemSfFbAGQzCcvQ1Og6t48uwmoHnDb3oTHXlrBB2ooLFgqjdlpquuY7dSNNC7qpDZKXNoEWpNAQgv00mElQ5BcZ' };
});

// Create a payment intent and return its client secret
fastify.post("/create-payment-intent", async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 50,
    currency: "USD",
    automatic_payment_methods: { enabled: true },
  });

  return { client_secret: paymentIntent.client_secret };
});

// Run the server
const start = async () => {
  try {
    await fastify.listen(5252);
    console.log("Server listening ... ");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
