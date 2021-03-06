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
 * @interface Certificate
 */
export interface Certificate {
  /**
   * Certificate unique identifier.
   * @type {string}
   * @memberof Certificate
   */
  readonly id?: string;
  /**
   *
   * @type {string}
   * @memberof Certificate
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof Certificate
   */
  certType?: string;
  /**
   *
   * @type {string}
   * @memberof Certificate
   */
  documentNumber?: string;
  /**
   * Expiry date
   * @type {Date}
   * @memberof Certificate
   */
  expiryDate?: Date;
  /**
   * The date the certificate was issued
   * @type {Date}
   * @memberof Certificate
   */
  issueDate?: Date;
  /**
   * Track if a suvey is required for this document
   * @type {boolean}
   * @memberof Certificate
   */
  surveyRequired?: boolean;
  /**
   * Add any notes regarding the certificate document
   * @type {string}
   * @memberof Certificate
   */
  notes?: string;
  /**
   *
   * @type {boolean}
   * @memberof Certificate
   */
  readonly overdue?: boolean;
  /**
   *
   * @type {string}
   * @memberof Certificate
   */
  vesselId: string;
  /**
   *
   * @type {string}
   * @memberof Certificate
   */
  readonly customerId?: string;
  /**
   *
   * @type {Date}
   * @memberof Certificate
   */
  readonly created?: Date;
}

export function CertificateFromJSON(json: any): Certificate {
  return CertificateFromJSONTyped(json, false);
}

export function CertificateFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Certificate {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: !exists(json, "id") ? undefined : json["id"],
    name: json["name"],
    certType: !exists(json, "cert_type") ? undefined : json["cert_type"],
    documentNumber: !exists(json, "document_number")
      ? undefined
      : json["document_number"],
    expiryDate:
      !exists(json, "expiry_date") || !json["expiry_date"]
        ? undefined
        : new Date(json["expiry_date"]),
    issueDate:
      !exists(json, "issue_date") || !json["issue_date"]
        ? undefined
        : new Date(json["issue_date"]),
    surveyRequired: !exists(json, "survey_required")
      ? undefined
      : json["survey_required"],
    notes: !exists(json, "notes") ? undefined : json["notes"],
    overdue: !exists(json, "overdue") ? undefined : json["overdue"],
    vesselId: json["vessel_id"],
    customerId: !exists(json, "customer_id") ? undefined : json["customer_id"],
    created: !exists(json, "created") ? undefined : new Date(json["created"]),
  };
}

export function CertificateToJSON(value?: Certificate | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
    cert_type: value.certType,
    document_number: value.documentNumber,
    expiry_date: !value.expiryDate ? "" : value.expiryDate.toISOString(),
    issue_date: !value.issueDate ? "" : value.issueDate.toISOString(),
    survey_required: value.surveyRequired,
    notes: !value.notes ? "" : value.notes,
    vessel_id: value.vesselId,
  };
}
