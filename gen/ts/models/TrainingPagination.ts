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
  Training,
  TrainingFromJSON,
  TrainingFromJSONTyped,
  TrainingToJSON,
} from './';

/**
 *
 * @export
 * @interface TrainingPagination
 */
export interface TrainingPagination {
  /**
   *
   * @type {number}
   * @memberof TrainingPagination
   */
  total?: number;
  /**
   *
   * @type {boolean}
   * @memberof TrainingPagination
   */
  hasNext?: boolean;
  /**
   *
   * @type {number}
   * @memberof TrainingPagination
   */
  page?: number;
  /**
   *
   * @type {number}
   * @memberof TrainingPagination
   */
  numPages?: number;
  /**
   *
   * @type {number}
   * @memberof TrainingPagination
   */
  perPage?: number;
  /**
   *
   * @type {Array<Training>}
   * @memberof TrainingPagination
   */
  items?: Array<Training>;
}

export function TrainingPaginationFromJSON(json: any): TrainingPagination {
  return TrainingPaginationFromJSONTyped(json, false);
}

export function TrainingPaginationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): TrainingPagination {
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
      : (json['items'] as Array<any>).map(TrainingFromJSON),
  };
}

export function TrainingPaginationToJSON(
  value?: TrainingPagination | null
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
        : (value.items as Array<any>).map(TrainingToJSON),
  };
}
