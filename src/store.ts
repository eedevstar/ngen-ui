import { createStore, devtools } from "framework-x";
import { Events, EventPayloads } from "./events";
import { Values } from "./util";
import { RouteIds } from "./routes/events";
import type { Db as StoriesDb } from "./scope/db";
import { APITuple } from "./api";

export const store = createStore(
  process.env.NODE_ENV !== "production" && { eventListeners: [devtools()] }
);
// monkey patch store to get a dispatch with better validation
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window._store = {
    getState: store.getState,
    setState: store.setState,
    dispatch: store.dispatch,
  };
}

const {
  dispatch: innerDispatch,
  regFx: innerRegFx,
  regEventFx: innerRegEventFx,
} = store;

type EventPayloadType<Events extends { [k: string]: any }> = Record<
  Values<Events>,
  any
>;

type NewStateOrReducer<Db> = Db | ((db: Db) => Db);

const makeTypedRegEventFx = <
  Db,
  Events extends { [k: string]: string },
  EventPayloads extends EventPayloadType<Events>,
  Fx extends { [k: string]: (...args: any[]) => any }
>() => <EventName extends Values<Events>>(
  type: keyof Events,
  fn: (
    coeffects: { db: Db },
    payload: EventPayloads[EventName]
  ) => ReturnType<Values<Fx>>[] | void
) => innerRegEventFx(type, fn);

export type EventTuple = [string, any];

const makeFetch = (fxName) => <
  SuccessEventName extends Values<Events>,
  FailureEventName extends Values<Events>
>({
  req,
  success,
  failure,
}: {
  req: string | Partial<RequestInit>;
  success:
    | SuccessEventName
    | any
    | [SuccessEventName | any, EventPayloads[SuccessEventName] | any];
  failure:
    | FailureEventName
    | any
    | [FailureEventName | any, EventPayloads[FailureEventName] | any];
}) => [fxName, [req, success, failure]];

const makeTypedFx = <
  Db,
  Events extends { [k: string]: string },
  EventPayloads extends EventPayloadType<Events>
>() => ({
  dispatch: <EventName extends Values<Events>>(
    eventName: EventName,
    payload?: EventPayloads[EventName]
  ) => ["dispatch", [eventName, payload]],
  dispatchAsync: <EventName extends Values<Events>>(
    eventName: EventName,
    payload?: EventPayloads[EventName]
  ) => ["dispatchAsync", [eventName, payload]],
  db: (newStateOrReducer: NewStateOrReducer<Db>) => ["db", newStateOrReducer],
  writeStorage: (key: string, value: string) => {
    return ["write-storage", [key, value]];
  },
  route: (id: RouteIds, params: { [k: string]: any }) => [
    "route",
    [id, params],
  ],
  redirect: (id: RouteIds, params: { [k: string]: any }) => [
    "redirect",
    [id, params],
  ],
  back: () => ["route/back"],
  api: (
    [subj, verb, quantifier]: APITuple,
    args: any,
    options?: { continuations: EventTuple[] }
  ) => ["api", [[subj, verb, quantifier], args, options]],
  fetch: makeFetch("fetch"),
  fetchApi: makeFetch("apiRaw"),
  fetchApiFile: makeFetch("apiRawFile"),
  emit: (eventName, payload) => ["emit", [eventName, payload]],
  schedule: (jobName: string, delay: number, fn: Function) => [
    "schedule",
    { jobName, delay, fn },
  ],
  cancelSchedule: (jobName: string) => ["cancel-schedule", { jobName }],
  toast: (msg) => ["toast", msg],
});

const makeTypedDispatch = <
  Events extends { [k: string]: string },
  EventPayloads extends EventPayloadType<Events>
>() => <EventName extends Values<Events>>(
  eventName: keyof Events,
  payload?: EventPayloads[EventName]
) => innerDispatch(eventName, payload);

export type Db = {
  data: { stories: { [id: string]: any }; storyDetail: { [id: string]: any } };
} & StoriesDb;

export const dispatch = makeTypedDispatch<Events, EventPayloads>();

export const regFx = innerRegFx;

export const fx = makeTypedFx<Db, Events, EventPayloads>();

export const regEventFx = makeTypedRegEventFx<
  Db,
  Events,
  EventPayloads,
  typeof fx
>();

export const setState = store.setState;

export const getState = store.getState;

export const subscribeToState = store.subscribeToState;
