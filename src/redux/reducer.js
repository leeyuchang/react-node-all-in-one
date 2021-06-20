import { combineReducers } from 'redux';
import socket from '../modules/socket';
import orderitems from '../modules/orderitems';
import loading from '../modules/loading';

const rootReducer = combineReducers({
  socket,
  orderitems,
  loading,
});

export default rootReducer;
