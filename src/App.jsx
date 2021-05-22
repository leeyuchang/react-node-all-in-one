import axios from 'axios'
import React from 'react'
import './App.css'


const fetch = async () => {
  axios
    .get('/test')
    .then((data) => {
      console.log(data)
      console.log('1passed1')
    })
    .catch(({response:{data:{msg}}}) => {
      console.error(msg)
      console.log('2passed')
    })
}

export default function App() {
  return (
    <div className="App">
      <button onClick={fetch}>Fetch</button>
    </div>
  )
}
