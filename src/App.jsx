import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import './App.css'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
// const promise = loadStripe("pk_test_51INXz9FFb29aGESxBG3pMRCkFOi4p6xE9aBwSt9qwgTrzpaMbXMsfRTrXuIXincw6k7Nl0eksZXdR76iEhXy3fU5004HWN92kN");
// const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
const promise = loadStripe(
  'pk_test_51INXz9FFb29aGESxBG3pMRCkFOi4p6xE9aBwSt9qwgTrzpaMbXMsfRTrXuIXincw6k7Nl0eksZXdR76iEhXy3fU5004HWN92kN',
)

export default function App() {
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </div>
  )
}
