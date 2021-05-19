require('dotenv').config()
const express = require('express')
const app = express()
// This is your real test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

app.use(express.static('.'))
app.use(express.json())

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400
}

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  })
})

app.post('/cancel-payment-intent/:pi_id', async (req, res) => {
  try {
    const { pi_id } = req.params
    const paymentIntent = await stripe.paymentIntents.cancel(pi_id)
    res.send({ paymentIntent })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: error.message })
  }
})

app.listen(4242, () => console.log('Node server listening on port 4242!'))
