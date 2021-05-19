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
    payment_method_types: ['card'],
    amount: calculateOrderAmount(items),
    currency: 'usd',
    application_fee_amount: calcApplicationFeeAmount(
      calculateOrderAmount(items),
    ),
    transfer_data: {
      destination: process.env.STRIPE_CONNECTED_ACCOUNT_ID,
    },
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  })
})

app.post('/cancel-payment-intent/:pi', async (req, res) => {
  try {
    const { pi } = req.params
    const paymentIntent = await stripe.paymentIntents.cancel(pi)
    res.send({ paymentIntent })
  } catch (error) {
    console.error(JSON.stringify(error, null, 4))
    console.error(error.raw)
    res.status(500).send({ error: error.raw.message })
  }
})

app.post('/refund-payment-intent/:pi', async (req, res) => {
  try {
    const { pi } = req.params
    const refund = await stripe.refunds.create({
      payment_intent: pi,
    })
    return res.send({ refund })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ error })
  }
})

const calcApplicationFeeAmount = (integerAmount) =>
  Math.round(0.1 * integerAmount)

app.listen(4242, () => console.log('Node server listening on port 4242!'))
