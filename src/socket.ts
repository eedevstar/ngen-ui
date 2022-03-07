import createSocket from 'socket.io-client';
import { SOCKET_ENDPOINT } from 'config';
import { dispatch, fx, regEventFx, regFx } from './store';
import { evt } from './events';
import * as R from 'ramda';

const socket = createSocket(SOCKET_ENDPOINT);

socket.on('connect', () => dispatch(evt.SOCKET_CONNECTED));
socket.on('disconnect', () => dispatch(evt.SOCKET_DISCONNECTED));

regEventFx(evt.SOCKET_CONNECTED, () => {
  console.log('Socket connected.');
  return [fx.db(R.assoc('connected', true))];
});

regEventFx(evt.SOCKET_DISCONNECTED, () => {
  console.log('Socket disconnected.');
  return [fx.db(R.dissoc('connected'))];
});

// server -> client
socket.on('message', ({ type, payload }) => {
  console.log('<server', { type, payload });
  dispatch(type, payload);
});

// client -> server
const emit = ([type, payload]) => {
  console.log('>server', { type, payload });
  socket.emit('message', { type, payload });
};

regFx('emit', (env, [type, payload]) => emit([type, payload]));

regFx('emitN', (env, messages: [string, any][]) => messages.forEach(emit));
