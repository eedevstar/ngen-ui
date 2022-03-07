/* tslint:disable */
/* eslint-disable */
/**
 * Navigate API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime';
import {
  PasswordAuth,
  PasswordAuthFromJSON,
  PasswordAuthToJSON,
  RefreshTokenAuth,
  RefreshTokenAuthFromJSON,
  RefreshTokenAuthToJSON,
  ReturnToken,
  ReturnTokenFromJSON,
  ReturnTokenToJSON,
} from '../models';

export interface PostLoginRequest {
  payload: PasswordAuth;
}

export interface PostRefreshRequest {
  payload: RefreshTokenAuth;
}

export interface PostRevokeRefreshRequest {
  payload: RefreshTokenAuth;
}

/**
 *
 */
export class AuthApi extends runtime.BaseAPI {
  /**
   * JWT Test
   */
  async getProtectedRaw(): Promise<runtime.ApiResponse<void>> {
    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['authorization'] = this.configuration.apiKey(
        'authorization'
      ); // apikey authentication
    }

    const response = await this.request({
      path: `/auth/protected`,
      method: 'GET',
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.VoidApiResponse(response);
  }

  /**
   * JWT Test
   */
  async getProtected(): Promise<void> {
    await this.getProtectedRaw();
  }

  /**
   * This API implemented JWT. Token\'s payload contains: \'uid\' (user id), \'exp\' (expiration date of the token), \'iat\' (the time the token is generated)
   * Generate auth token
   */
  async postLoginRaw(
    requestParameters: PostLoginRequest
  ): Promise<runtime.ApiResponse<ReturnToken>> {
    if (
      requestParameters.payload === null ||
      requestParameters.payload === undefined
    ) {
      throw new runtime.RequiredError(
        'payload',
        'Required parameter requestParameters.payload was null or undefined when calling postLogin.'
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request({
      path: `/auth/token`,
      method: 'POST',
      headers: headerParameters,
      query: queryParameters,
      body: PasswordAuthToJSON(requestParameters.payload),
    });

    return new runtime.JSONApiResponse(response, jsonValue =>
      ReturnTokenFromJSON(jsonValue)
    );
  }

  /**
   * This API implemented JWT. Token\'s payload contains: \'uid\' (user id), \'exp\' (expiration date of the token), \'iat\' (the time the token is generated)
   * Generate auth token
   */
  async postLogin(requestParameters: PostLoginRequest): Promise<ReturnToken> {
    const response = await this.postLoginRaw(requestParameters);
    return await response.value();
  }

  /**
   * Refresh auth token
   */
  async postRefreshRaw(
    requestParameters: PostRefreshRequest
  ): Promise<runtime.ApiResponse<ReturnToken>> {
    if (
      requestParameters.payload === null ||
      requestParameters.payload === undefined
    ) {
      throw new runtime.RequiredError(
        'payload',
        'Required parameter requestParameters.payload was null or undefined when calling postRefresh.'
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request({
      path: `/auth/refresh`,
      method: 'POST',
      headers: headerParameters,
      query: queryParameters,
      body: RefreshTokenAuthToJSON(requestParameters.payload),
    });

    return new runtime.JSONApiResponse(response, jsonValue =>
      ReturnTokenFromJSON(jsonValue)
    );
  }

  /**
   * Refresh auth token
   */
  async postRefresh(
    requestParameters: PostRefreshRequest
  ): Promise<ReturnToken> {
    const response = await this.postRefreshRaw(requestParameters);
    return await response.value();
  }

  /**
   * Revoke refresh token
   */
  async postRevokeRefreshRaw(
    requestParameters: PostRevokeRefreshRequest
  ): Promise<runtime.ApiResponse<ReturnToken>> {
    if (
      requestParameters.payload === null ||
      requestParameters.payload === undefined
    ) {
      throw new runtime.RequiredError(
        'payload',
        'Required parameter requestParameters.payload was null or undefined when calling postRevokeRefresh.'
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request({
      path: `/auth/revoke`,
      method: 'POST',
      headers: headerParameters,
      query: queryParameters,
      body: RefreshTokenAuthToJSON(requestParameters.payload),
    });

    return new runtime.JSONApiResponse(response, jsonValue =>
      ReturnTokenFromJSON(jsonValue)
    );
  }

  /**
   * Revoke refresh token
   */
  async postRevokeRefresh(
    requestParameters: PostRevokeRefreshRequest
  ): Promise<ReturnToken> {
    const response = await this.postRevokeRefreshRaw(requestParameters);
    return await response.value();
  }
}
