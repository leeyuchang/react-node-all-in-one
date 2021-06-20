/* eslint-disable arrow-parens */
import io from 'socket.io-client';
import { eventChannel } from 'redux-saga';
import { take, call, delay, put, race, cancelled } from 'redux-saga/effects';
import { createSelector } from 'reselect';

const ADD_TASK = 'ADD_TASK';
const START_CHANNEL = 'START_CHANNEL';
const STOP_CHANNEL = 'STOP_CHANNEL';
const CHANNEL_ON = 'CHANNEL_ON';
const CHANNEL_OFF = 'CHANNEL_OFF';
const SERVER_ON = 'SERVER_ON';
const SERVER_OFF = 'SERVER_OFF';

const socketServerURL = 'http://localhost:4242';

const initialState = {
  taskList: [],
  channelStatus: 'off',
  serverStatus: 'unknown',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANNEL_ON:
      return { ...state, channelStatus: 'on' };
    case CHANNEL_OFF:
      return { ...state, channelStatus: 'off', serverStatus: 'unknown' };
    case ADD_TASK:
      return { ...state, taskList: [...state.taskList, action.payload] };
    case SERVER_OFF:
      return { ...state, serverStatus: 'off' };
    case SERVER_ON:
      return { ...state, serverStatus: 'on' };
    default:
      return state;
  }
};

// action creators for Stop and Start buttons. You can also put them into componentDidMount
export const startChannel = () => ({ type: START_CHANNEL });
export const stopChannel = () => ({ type: STOP_CHANNEL });

// sorting function to show the latest tasks first
const sortTasks = (task1, task2) => task2.taskID - task1.taskID;

// selector to get only first 5 latest tasks
const taskSelector = (state) => state.socket.taskList;
const topTask = (allTasks) => allTasks.sort(sortTasks).slice(0, 5);
export const topTaskSelector = createSelector(taskSelector, topTask);

// wrapping functions for socket events (connect)
let socket;
const connect = () => {
  // socket = io(socketServerURL);
  socket = io();
  return new Promise((resolve) => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};

// This is how channel is created
const createSocketChannel = (socket) =>
  eventChannel((emit) => {
    const handler = (data) => emit(data);
    socket.on('insert', handler);
    socket.on('settle', handler);
    return () => {
      socket.off('insert', handler);
      socket.off('settle', handler);
    };
  });

// Saga to switch on channel.
const listenServerSaga = function* () {
  try {
    yield put({ type: CHANNEL_ON });
    const { timeout, connected: socket } = yield race({
      connected: call(connect),
      timeout: delay(1000),
    });
    if (timeout) {
      yield put({ type: SERVER_OFF });
      throw new Error('server connection error [time out]');
    }
    const socketChannel = yield call(createSocketChannel, socket);
    yield put({ type: SERVER_ON });

    while (true) {
      const payload = yield take(socketChannel);
      if (payload.taskName) {
        yield put({ type: ADD_TASK, payload });
      }
      if (payload.settle) {
        console.log('payload.settle', payload.settle);
      }
    }
  } catch (error) {
    socket.disconnect();
    yield put({ type: CHANNEL_OFF });
  } finally {
    if (yield cancelled()) {
      socket.disconnect();
      yield put({ type: CHANNEL_OFF });
    }
  }
};

// saga listens for start and stop actions
export const startStopChannel = function* () {
  while (true) {
    yield take(START_CHANNEL);
    yield race({
      task: call(listenServerSaga),
      cancel: take(STOP_CHANNEL),
    });
  }
};
