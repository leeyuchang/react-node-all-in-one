const express = require('express');
const { batch } = require('react-redux');
const socketio = require('socket.io');

const app = express()
const io = socketio()
const server = require('http').createServer(app)

io.attach(server)
// This is your real test secret API key.
// const stripe = require('stripe')(
//   'sk_test_51J0XCRDdAAsrOcYBZ7W5YuXGnQGOqhBJZT2N8pi6PVrL8djMy9wIPsW52dsarzLhBcG99Xe7parloLFJ196pESTj005r3kZhDA',
// )
app.use(express.static('.'))
app.use(express.json())
// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400
// }
// const chargeCustomer = async (customerId) => {
//   // Lookup the payment methods available for the customer
//   const paymentMethods = await stripe.paymentMethods.list({
//     customer: customerId,
//     type: 'card',
//   })
//   // Charge the customer and payment method immediately
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'usd',
//     customer: customerId,
//     payment_method: paymentMethods.data[0].id,
//     off_session: true,
//     confirm: true,
//   })
//   if (paymentIntent.status === 'succeeded') {
//     console.log('✅ Successfully charged card off session')
//   }
// }
// app.post('/create-payment-intent', async (req, res) => {
//   const { items } = req.body
//   // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
//   // and attach the PaymentMethod to a new Customer
//   const customer = await stripe.customers.create()
//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     customer: customer.id,
//     setup_future_usage: 'off_session',
//     amount: calculateOrderAmount(items),
//     currency: 'usd',
//   })
//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   })
// })

app.get('/', (req, res) => {
  return res.send({ message: 'hello' })
})

app.get('/api/orderitems/:orderID', (req, res) => {
  const { orderID } = req.params
  // return res.send({ orderitems: 'hello world' })
  return res.status(400).send({ message: 'do you see me orderitems' })
})

let i = 0;

//this makes sure we have unique task IDs when starting an stopping rhe server
let baseTaskID = Math.round((Date.now() - 1511098000000) / 1000);

console.log('socket start')
setInterval(() =>  i++, 2000);

io.on('connection', socket => {
  console.log('connection opened')
  const req = socket.request;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log('customer connected!', ip, socket.id);
  
  setInterval(() => {
    socket.emit('insert', {taskName: `Task ${baseTaskID + i}`, taskID: baseTaskID + i})
  }, 2000);
})

server.listen(4242, () => console.log('Node server listening on port 4242!'))
