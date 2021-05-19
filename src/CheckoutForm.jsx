import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

export default function CheckoutForm() {
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  const [pi, setPi] = useState('')

  const onCreatePI = () => {
    // Create PaymentIntent as soon as the page loads
    fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        console.log(JSON.stringify(data, null, 4))
        setPi(() => data.id)
        setClientSecret(() => data.clientSecret)
      })
  }

  const onCancelPI = () => {
    fetch(`/cancel-payment-intent/${pi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json()
      })
      .then(({ paymentIntent }) => {
        console.log('paymentIntent', JSON.stringify(paymentIntent, null, 4))
        alert('paymentIntent.status :' + paymentIntent.status)
      })
  }

  const onRefund = () => {

  }

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : '')
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setProcessing(true)

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    })

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`)
      setProcessing(false)
    } else {
      setError(null)
      setProcessing(false)
      setSucceeded(true)
    }
  }

  return (
    <div sytle={{ display: 'flex', flexDirection: 'colume' }}>
      {/* Create Payment Intent */}
      <div
        style={{
          marginBottom: '5rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button onClick={onCreatePI}>Create Payment Intent</button>
        <label htmlFor="pi">
          pi
          <input id="pi" value={pi} readOnly />
        </label>
        <label htmlFor="clientSecret">
          clientSecret
          <input id="clientSecret" value={clientSecret} readOnly />
        </label>
      </div>

      {/* Cancel */}
      <div
        style={{
          marginBottom: '5rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button onClick={onCancelPI}>Cancel Payment Intent</button>
        {/* <label htmlFor="payment_status">
          Payment Status
          <input id="payment_status" value={clientSecret} />
        </label> */}
      </div>

      {/* Submit (Pay) */}
      <form id="payment-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
        <button disabled={processing || disabled || succeeded} id="submit">
          <span id="button-text">
            {processing ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              'Pay now'
            )}
          </span>
        </button>
        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        {/* Show a success message upon completion */}
        <p className={succeeded ? 'result-message' : 'result-message hidden'}>
          Payment succeeded, see the result in your
          <a href={`https://dashboard.stripe.com/test/payments`}>
            {' '}
            Stripe dashboard.
          </a>{' '}
          Refresh the page to pay again.
        </p>
      </form>
    </div>
  )
}
