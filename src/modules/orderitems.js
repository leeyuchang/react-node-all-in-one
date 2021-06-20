import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from '../lib/api';
import { startLoading, finishLoading } from './loading';

const GET_ORDERITEMS = 'GET_ORDERITEMS';
const GET_ORDERITEMS_SUCCESS = 'GET_ORDERITEMS_SUCCESS';
const GET_ORDERITEMS_FAILURE = 'GET_ORDERITEMS_FAILURE';

export const getOrderitems = (orderID) => ({
  type: GET_ORDERITEMS,
  payload: orderID,
});

const initialState = {
  items: null,
};

export default function orderitems(state = initialState, action) {
  switch (action.type) {
    case GET_ORDERITEMS_SUCCESS:
      return { ...state, items: action.payload };
    case GET_ORDERITEMS_FAILURE:
      return {
        ...state,
        items: action.payload,
        error: action.error,
      };
    default:
      return state;
  }
}

function* getOrderitemsSaga({ payload }) {
  yield put(startLoading(GET_ORDERITEMS));
  try {
    const { data: orderitems } = yield call(api.getOrderitems, payload);
    yield put({ type: GET_ORDERITEMS_SUCCESS, payload: orderitems });
  } catch ({ response: { data } }) {
    yield put({
      type: GET_ORDERITEMS_FAILURE,
      payload: data.message,
      error: true,
    });
  } finally {
    yield put(finishLoading(GET_ORDERITEMS));
  }
}

export function* orderitemsSaga() {
  yield takeLatest(GET_ORDERITEMS, getOrderitemsSaga);
}
