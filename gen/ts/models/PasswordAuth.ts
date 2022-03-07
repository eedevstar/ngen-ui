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

import { exists, mapValues } from '../runtime';
/**
 *
 * @export
 * @interface PasswordAuth
 */
export interface PasswordAuth {
  /**
   *
   * @type {string}
   * @memberof PasswordAuth
   */
  email: string;
  /**
   *
   * @type {string}
   * @memberof PasswordAuth
   */
  password: string;
  /**
   *
   * @type {string}
   * @memberof PasswordAuth
   */
  deviceId?: string;
}

export function PasswordAuthFromJSON(json: any): PasswordAuth {
  return PasswordAuthFromJSONTyped(json, false);
}

export function PasswordAuthFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PasswordAuth {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    email: json['email'],
    password: json['password'],
    deviceId: !exists(json, 'device_id') ? undefined : json['device_id'],
  };
}

export function PasswordAuthToJSON(value?: PasswordAuth | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    email: value.email,
    password: value.password,
    device_id: value.deviceId,
  };
}