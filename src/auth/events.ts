export const authEvent = {
  LOGIN: 'auth/login',
  LOGGED_IN: 'auth/login-success',
  LOGOUT: 'auth/logout',
  DENIED: 'auth/login-failure',
  REFRESH_TOKEN: 'auth/refresh-token',
  TOKEN_REFRESHED: 'auth/refresh-token-success'
} as const;

export type AuthEventPayloads = {
  [authEvent.LOGIN]: { username: string, password: string }
  [authEvent.LOGOUT]: any
  [authEvent.LOGGED_IN]: any
  [authEvent.DENIED]: any
  [authEvent.REFRESH_TOKEN]: any
  [authEvent.TOKEN_REFRESHED]: any
}
