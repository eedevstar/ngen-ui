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
  Certificate,
  CertificateFromJSON,
  CertificateFromJSONTyped,
  CertificateToJSON,
} from './';

/**
 *
 * @export
 * @interface CertificatePagination
 */
export interface CertificatePagination {
  /**
   *
   * @type {number}
   * @memberof CertificatePagination
   */
  total?: number;
  /**
   *
   * @type {boolean}
   * @memberof CertificatePagination
   */
  hasNext?: boolean;
  /**
   *
   * @type {number}
   * @memberof CertificatePagination
   */
  page?: number;
  /**
   *
   * @type {number}
   * @memberof CertificatePagination
   */
  numPages?: number;
  /**
   *
   * @type {number}
   * @memberof CertificatePagination
   */
  perPage?: number;
  /**
   *
   * @type {Array<Certificate>}
   * @memberof CertificatePagination
   */
  items?: Array<Certificate>;
}

export function CertificatePaginationFromJSON(
  json: any
): CertificatePagination {
  return CertificatePaginationFromJSONTyped(json, false);
}

export function CertificatePaginationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): CertificatePagination {
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
      : (json['items'] as Array<any>).map(CertificateFromJSON),
  };
}

export function CertificatePaginationToJSON(
  value?: CertificatePagination | null
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
        : (value.items as Array<any>).map(CertificateToJSON),
  };
}
