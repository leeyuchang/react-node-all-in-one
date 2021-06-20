import { combineReducers } from 'redux';
import socket from '../modules/socket';
import loading from '../modules/loading';
import orderitems from '../modules/orderitems';

const rootReducer = combineReducers({
  socket,
  orderitems,
  loading,
});

export default rootReducer;
