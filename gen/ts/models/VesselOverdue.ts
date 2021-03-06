/* tslint:disable */
/* eslint-disable */
/**
 * Navigate API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI VesselOverdue: 1.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";

interface Item {
  id: string;
  category: string;
  name: string;
  dueDate: Date;
}
function getItemListFromJson(json: any[]): Item[] {
  let result: Array<Item> = [];
  json.map((v: Object) =>
    result.push({
      id: v["id"],
      category: v["category"],
      name: v["name"],
      dueDate: new Date(v["due_date"]),
    })
  );
  return result;
}

interface VesselItem {
  id: string;
  name: string;
  overdue: Item[];
  overdueCount: number;
  upcoming: Item[];
  upcomingCount: number;
}

function getVesselListFromJson(json: {
  [key: string]: any;
}): { [key: string]: VesselItem } {
  let result = {};
  Object.keys(json).forEach(
    (k) =>
      (result[k] = {
        id: k,
        name: json[k].name,
        overdue: getItemListFromJson(json[k].overdue),
        overdueCount: json[k].overdue_count,
        upcoming: getItemListFromJson(json[k].upcoming),
        upcomingCount: json[k].upcoming_count,
      })
  );
  return result;
}
/**
 *
 * @export
 * @interface VesselOverdue
 */
export interface VesselOverdue {
  /**
   *
   * @type {VesselItem}
   * @memberof VesselOverdue
   */
  vessels?: {};
  /**
   *
   * @type {number}
   * @memberof VesselOverdue
   */
  totalOverdueCount?: number;
  /**
   *
   * @type {number}
   * @memberof VesselOverdue
   */
  totalUpcomingCount?: number;
}

export function VesselOverdueFromJSON(json: any): VesselOverdue {
  return VesselOverdueFromJSONTyped(json, false);
}
export function VesselOverdueFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): VesselOverdue {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    vessels: !exists(json, "vessels")
      ? {}
      : getVesselListFromJson(json["vessels"]),
    totalOverdueCount: !exists(json, "total_overdue_count")
      ? undefined
      : json["total_overdue_count"],
    totalUpcomingCount: !exists(json, "total_upcoming_count")
      ? undefined
      : json["total_upcoming_count"],
  };
}

export function VesselOverdueToJSON(value?: VesselOverdue | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    vessels: value.vessels,
    total_overdue_count: value.totalOverdueCount,
    total_upcoming_count: value.totalUpcomingCount,
  };
}
