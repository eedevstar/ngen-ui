import React from 'react'
import * as R from 'ramda'
import { createRouter, createSub, component } from 'framework-x'
import { createBrowserHistory } from 'history'
import { fx, regEventFx, regFx } from '../store'
import { getLocationAndMatch, getRouteParams, getRouteId } from './selectors'
import { routeEvent } from './events'
import { routes } from './routes'

/* NOTE: Not strictly necessary to use history.js library */
export const history = createBrowserHistory()
export const { pushNamedRoute, replaceNamedRoute, listen } = createRouter({
  history,
  routes,
})

export type LocationAndMatch = {
  location: { pathname: string; search: string; hash: string };
  match: {
    route: { id: string; path: string };
    params: { [k: string]: string };
  };
  type: 'INITIAL' | string;
  search: { [param: string]: string };
};

export const startRouter = dispatch =>
  listen(locationAndMatch => {
    dispatch(routeEvent.CHANGED, locationAndMatch)
  })

const getIdFromLAndM = (locationAndMatch: LocationAndMatch) =>
  R.path(['match', 'id'], locationAndMatch) ||
  R.path(['match', 'route', 'id'], locationAndMatch)

regEventFx(routeEvent.CHANGED, (context, locationAndMatch) => {
  const id = getIdFromLAndM(locationAndMatch)
  if (!id) throw new Error('Internal error')

  const { db } = context

  const getOnExitFx = () => {
    const lastLocationAndMatch = getLocationAndMatch(db)
    const lastId = getIdFromLAndM(lastLocationAndMatch)

    if (lastId === 'not-found' || !lastId) return []

    const onExitFn = R.pathOr((..._) => [], ['match', 'route', 'onExit'])(
      lastLocationAndMatch,
    )
    return onExitFn(context, lastLocationAndMatch, locationAndMatch) || []
  }

  const exitFx = getOnExitFx()

  const getOnEnterInstructions = () => {
    if (id === 'not-found') return []
    const onEnterFn = R.pathOr((..._) => null, ['match', 'route', 'onEnter'])(
      locationAndMatch,
    )
    return onEnterFn(context, locationAndMatch) || []
  }

  const enterFx = getOnEnterInstructions()
  // console.log('fx for entering route', id, enterFx)

  return [...exitFx, ...enterFx, fx.db(R.assoc('router', locationAndMatch))]
})

/* Request to navigate to a link. Optimistically set in db to make sure effects are immediate */
regEventFx(routeEvent.NAV_TO, ({ db }, [id, params]) => {
  const existingParams = getRouteParams(db)
  const nextParams = params || existingParams
  return [fx.route(id, nextParams)]
})

regFx('route', (env, args) => {
  pushNamedRoute.apply(null, args)
})

regFx('redirect', (env, args) => {
  return replaceNamedRoute.apply(null, args)
})

regEventFx(routeEvent.BACK, () => [['route/back']])
regFx('route/back', () => {
  history.goBack()
})


export const RouteNotFound = component(
  'RouteNotFound',
  createSub({ getRouteId }),
  () => <div>Not found</div>,
)
