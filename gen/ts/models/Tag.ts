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

import { exists, mapValues } from "../runtime";
/**
 *
 * @export
 * @interface Tag
 */
export interface Tag {
  /**
   * Tag unique identifier.
   * @type {string}
   * @memberof Tag
   */
  readonly id?: string;
  /**
   *
   * @type {Array}
   * @memberof Tag
   */
  certificate: Array<String>;
  /**
   *
   * @type {Array}
   * @memberof Tag
   */
  drill: Array<String>;
  /**
   *
   * @type {Array}
   * @memberof Tag
   */
  safetyequipment: Array<String>;
  /**
   *
   * @type {Array}
   * @memberof Tag
   */
  healthandsafety: Array<String>;
  /**
   *
   * @type {Array}
   * @memberof Tag
   */
  maintenance: Array<String>;
  /**
   *
   * @type {Array}
   * @memberof Tag
   */
  ships_particulars: Array<String>;
  /**
   *
   * @type {Array}
   * @memberof Tag
   */
  audit: Array<String>;
  /**
   *
   * @type {string}
   * @memberof Tag
   */
  readonly customerId?: string;
  /**
   *
   * @type {Date}
   * @memberof Tag
   */
  readonly created?: Date;
}

export function TagFromJSON(json: any): Tag {
  return TagFromJSONTyped(json, false);
}

export function TagFromJSONTyped(json: any, ignoreDiscriminator: boolean): Tag {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: !exists(json, "id") ? undefined : json["id"],
    certificate: !exists(json, "certificate") ? [] : json["certificate"],
    drill: !exists(json, "drill") ? [] : json["drill"],
    safetyequipment: !exists(json, "safetyequipment")
      ? []
      : json["safetyequipment"],
    healthandsafety: !exists(json, "healthandsafety")
      ? []
      : json["healthandsafety"],
    maintenance: !exists(json, "maintenance") ? [] : json["maintenance"],
    ships_particulars: !exists(json, "ships_particulars")
      ? []
      : json["ships_particulars"],
    audit: !exists(json, "audit") ? [] : json["audit"],
    customerId: !exists(json, "customer_id") ? undefined : json["customer_id"],
    created: !exists(json, "created") ? undefined : new Date(json["created"]),
  };
}

export function TagToJSON(value?: Tag | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    certificate: value.certificate,
    drill: value.drill,
    safetyequipment: value.safetyequipment,
    healthandsafety: value.healthandsafety,
    maintenance: value.maintenance,
    ships_particulars: value.ships_particulars,
    audit: value.audit,
  };
}
