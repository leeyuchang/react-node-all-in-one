import { all } from 'redux-saga/effects'
import { startStopChannel } from '../modules/socket'
import { orderitemsSaga } from '../modules/orderitems'

export default function* rootSaga() {
  yield all([
    startStopChannel(),
    orderitemsSaga()
  ])
}
