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
import {
  HealthEquipment,
  HealthEquipmentFromJSON,
  HealthEquipmentFromJSONTyped,
  HealthEquipmentToJSON,
} from './';

/**
 *
 * @export
 * @interface HealthEquipmentPagination
 */
export interface HealthEquipmentPagination {
  /**
   *
   * @type {number}
   * @memberof HealthEquipmentPagination
   */
  total?: number;
  /**
   *
   * @type {boolean}
   * @memberof HealthEquipmentPagination
   */
  hasNext?: boolean;
  /**
   *
   * @type {number}
   * @memberof HealthEquipmentPagination
   */
  page?: number;
  /**
   *
   * @type {number}
   * @memberof HealthEquipmentPagination
   */
  numPages?: number;
  /**
   *
   * @type {number}
   * @memberof HealthEquipmentPagination
   */
  perPage?: number;
  /**
   *
   * @type {Array<HealthEquipment>}
   * @memberof HealthEquipmentPagination
   */
  items?: Array<HealthEquipment>;
}

export function HealthEquipmentPaginationFromJSON(
  json: any
): HealthEquipmentPagination {
  return HealthEquipmentPaginationFromJSONTyped(json, false);
}

export function HealthEquipmentPaginationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): HealthEquipmentPagination {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    total: !exists(json, 'total') ? undefined : json['total'],
    hasNext: !exists(json, 'has_next') ? undefined : json['has_next'],
    page: !exists(json, 'page') ? undefined : json['page'],
    numPages: !exists(json, 'num_pages') ? undefined : json['num_pages'],
    perPage: !exists(json, 'per_page') ? undefined : json['per_page'],
    items: !exists(json, 'items')
      ? undefined
      : (json['items'] as Array<any>).map(HealthEquipmentFromJSON),
  };
}

export function HealthEquipmentPaginationToJSON(
  value?: HealthEquipmentPagination | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    total: value.total,
    has_next: value.hasNext,
    page: value.page,
    num_pages: value.numPages,
    per_page: value.perPage,
    items:
      value.items === undefined
        ? undefined
        : (value.items as Array<any>).map(HealthEquipmentToJSON),
  };
}
