import React from 'react'
import { connect } from 'react-redux'
import {
  startChannel,
  stopChannel,
  // insert
} from '../modules/socket'

import { getOrderitems } from '../modules/orderitems'

const Buttons = (props) => {
  const {
    startChannel,
    stopChannel,
    // insert
    getOrderitems
  } = props
  return (
    <div
      style={{
        display: 'flex',
        width: '400px',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}
    >
      <button style={{ padding: 10 }} onClick={startChannel}>
        Start Socket Channel
      </button>
      <button style={{ padding: 10 }} onClick={stopChannel}>
        Stop Socket Channel
      </button>
      {/* <button style={{ padding: 10 }} onClick={() => insert('inser data')}>
        Insert
      </button> */}
      <button style={{ padding: 10 }} onClick={()=>getOrderitems('a1234')}>
        getOrderitems
      </button>
    </div>
  )
}

export default connect(null, {
  startChannel,
  stopChannel,
  // , insert
  getOrderitems,
})(Buttons)
