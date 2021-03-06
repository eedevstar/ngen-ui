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
 * @interface Action
 */
export interface Action {
  /**
   * Survey unique identifier.
   * @type {string}
   * @memberof Action
   */
  readonly id?: string;
  /**
   *
   * @type {string}
   * @memberof Action
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof Action
   */
  docNo?: string;
  /**
   * Due date
   * @type {Date}
   * @memberof Action
   */
  dateIssued?: Date;
  /**
   * Due date
   * @type {Date}
   * @memberof Action
   */
  // fixDate?: Date;
  // /**
  //  * Due date
  //  * @type {Date}
  //  * @memberof Action
  //  */
  dateCompleted?: Date;
  /**
   * fix_by_date
   * @type {Date}
   * @memberof Action
   */
  fixByDate?: Date;
  /**
   *
   * @type {string}
   * @memberof Action
   */
  notes: string;
  /**
   *
   * @type {boolean}
   * @memberof Action
   */
  readonly overdue?: boolean;
  /**
   *
   * @type {string}
   * @memberof Action
   */
  vesselId: string;
  /**
   *
   * @type {string}
   * @memberof Action
   */
  readonly customerId?: string;
  /**
   *
   * @type {Date}
   * @memberof Action
   */
  readonly created?: Date;
}

export function ActionFromJSON(json: any): Action {
  return ActionFromJSONTyped(json, false);
}

export function ActionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Action {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: !exists(json, "id") ? undefined : json["id"],
    name: json["name"],
    docNo: !exists(json, "doc_no") ? undefined : json["doc_no"],
    dateIssued:
      !exists(json, "date_issued") || !json["date_issued"]
        ? undefined
        : new Date(json["date_issued"]),
    // fixDate: !exists(json, "fixed_date") ? undefined : new Date(json["fixed_date"]),
    dateCompleted:
      !exists(json, "date_completed") || !json["date_completed"]
        ? undefined
        : new Date(json["date_completed"]),
    notes: json["notes"],
    overdue:
      !exists(json, "overdue") || !json["overdue"]
        ? undefined
        : json["overdue"],
    fixByDate:
      !exists(json, "fix_by_date") || !json["fix_by_date"]
        ? undefined
        : new Date(json["fix_by_date"]),
    vesselId: json["vessel_id"],
    customerId: !exists(json, "customer_id") ? undefined : json["customer_id"],
    created: !exists(json, "created") ? undefined : new Date(json["created"]),
  };
}

export function ActionToJSON(value?: Action | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
    doc_no: value.docNo,
    date_issued: !value.dateIssued ? "" : value.dateIssued.toISOString(),
    // fixed_date:
    //   value.fixDate === undefined ? undefined : value.fixDate.toISOString(),
    fix_by_date: !value.fixByDate ? "" : value.fixByDate.toISOString(),
    date_completed: !value.dateCompleted
      ? ""
      : value.dateCompleted.toISOString(),
    notes: !value.notes ? "" : value.notes,
    vessel_id: value.vesselId,
  };
}
