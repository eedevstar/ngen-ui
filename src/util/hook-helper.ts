// import { uuid as genUuid } from './uuid'
import { useEffect, useState } from 'react'
import * as R from 'ramda'

type Handler<T> = (state: T) => void;

let id = 1
const genUuid = () => id++

export function generateStateHook<T>(defaultValue: T): [() => T, (newState: T) => void] {
  let state: T = defaultValue
  let handlers: Array<[string, Handler<T>]> = []
  const subscribe = (handler: Handler<T>) => {
    const id = genUuid()
    handlers = R.append([id, handler], handlers)
    return id
  }
  const unsubscribe = (id: string) => {
    handlers = R.reject(([myId]) => myId === id, handlers)
  }
  const set = (newState: T) => {
    state = newState
    // console.log(`setting state to`, state, `and notifying ${handlers.length} handlers`);
    handlers.forEach(([_, handler]) => handler(state as T))
  }
  const useStateHook = () => {
    const [hookState, setHookState] = useState<T>(state)
    useEffect(() => {
      const id = subscribe((newSt) => {
        // console.log('received new state for hook', newSt)
        setHookState(newSt)
      })
      return () => unsubscribe(id)
    }, [])
    // console.log('rerendering hook because of new state', hookState);
    return hookState
  }
  return [useStateHook, set]
}

export function generateEventHook<T>(): [(onEvent: (msg: T) => void) => void, (msg: T) => void] {
  let handlers: Array<[string, Handler<T>]> = []
  const subscribe = (handler: Handler<T>) => {
    const id = genUuid()
    handlers = R.append([id, handler], handlers)
    return id
  }
  const unsubscribe = (id: string) => {
    handlers = R.reject(([myId]) => myId === id, handlers)
  }
  const dispatch = (msg: T) => {
    console.log(`sending message `, msg, `and notifying ${handlers.length} handlers`);
    handlers.forEach(([_, handler]) => handler(msg as T))
  }
  const useEventHook = (onEvent: (msg: T) => void): void => {
    useEffect(() => {
      const id = subscribe((msg) => {
        console.log('received message for hook', msg)
        onEvent(msg)
      })
      return () => unsubscribe(id)
    }, [])
  }
  return [useEventHook, dispatch]
}
