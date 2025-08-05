require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || 'sk_test_51Rr9u01In1kDemSfvcojvArdJDIRJCDZaNQmJ4rf8YG6vlJ3fiTZmQlZiT17TkqiX7VXds4UYKOhxNYAwfEqV0PM0022BHGmLc');

// Fetch publishable key
fastify.get("/publishable-key", () => {
  return {
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rr9u01In1kDemSfFbAGQzCcvQ1Og6t48uwmoHnDb3oTHXlrBB2ooLFgqjdlpquuY7dSNNC7qpDZKXNoEWpNAQgv00mElQ5BcZ',
  };
});

// Create payment intent
fastify.post("/create-payment-intent", async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "USD",
    automatic_payment_methods: { enabled: true },
  });

  return { client_secret: paymentIntent.client_secret, payment_intent_id: paymentIntent.id };
});

// Refund payment intent
fastify.post("/refund", async (request, reply) => {
  const { paymentIntentId, amount } = request.body;

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // optional: in cents (omit to refund full)
    });

    return { success: true, refund };
  } catch (err) {
    console.error("Refund error:", err);
    reply.code(400).send({ success: false, error: err.message });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 5252 });
    console.log("Server listening on http://localhost:5252");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
