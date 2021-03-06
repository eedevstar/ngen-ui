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
 * @interface CrewDetails
 */
export interface CrewDetails {
  /**
   * Crew Member unique identifier.
   * @type {string}
   * @memberof CrewDetails
   */
  readonly id?: string;
  /**
   *
   * @type {string}
   * @memberof CrewDetails
   */
  firstname?: string;
  /**
   *
   * @type {string}
   * @memberof CrewDetails
   */
  lastname?: string;
  /**
   *
   * @type {string}
   * @memberof CrewDetails
   */
  role?: string;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  active_crew?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  coastal?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  locallimits?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  offshore?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  restrictedlimits?: boolean;
  /**
   * The certificate number on the medical cert
   * @type {string}
   * @memberof CrewDetails
   */
  medicalcertno?: string;
  /**
   * Date medical cert issued date
   * @type {Date}
   * @memberof CrewDetails
   */
  medicalcertissued?: Date;
  /**
   * Date medical cert expires
   * @type {Date}
   * @memberof CrewDetails
   */
  medicalcertexpiry?: Date;
  /**
   * The certificate number on the first aid cert
   * @type {string}
   * @memberof CrewDetails
   */
  firstaidno?: string;
  /**
   * Date first aid cert issued
   * @type {Date}
   * @memberof CrewDetails
   */
  firstaidissued?: Date;
  /**
   * Date first aid cert expired
   * @type {Date}
   * @memberof CrewDetails
   */
  firstaidexpiry?: Date;
  /**
   *
   * @type {string}
   * @memberof CrewDetails
   */
  notes?: string;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  readonly certoverdue?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  readonly certupcoming?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  readonly firstaidoverdue?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof CrewDetails
   */
  readonly firstaidupcoming?: boolean;
  /**
   *
   * @type {string}
   * @memberof CrewDetails
   */
  readonly customerId?: string;
  /**
   *
   * @type {Date}
   * @memberof CrewDetails
   */
  readonly created?: Date;
  /**
   *
   * @type {Array<string>}
   * @memberof CrewDetails
   */
  assignedVessels?: Array<string>;
}

export function CrewDetailsFromJSON(json: any): CrewDetails {
  return CrewDetailsFromJSONTyped(json, false);
}

export function CrewDetailsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): CrewDetails {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: !exists(json, "id") ? undefined : json["id"],
    firstname: !exists(json, "firstname") ? undefined : json["firstname"],
    lastname: !exists(json, "lastname") ? undefined : json["lastname"],
    role: !exists(json, "role") ? undefined : json["role"],
    active_crew: !exists(json, "active_crew") ? undefined : json["active_crew"],
    coastal: !exists(json, "coastal") ? undefined : json["coastal"],
    locallimits: !exists(json, "locallimits") ? undefined : json["locallimits"],
    offshore: !exists(json, "offshore") ? undefined : json["offshore"],
    restrictedlimits: !exists(json, "restrictedlimits")
      ? undefined
      : json["restrictedlimits"],
    medicalcertno: !exists(json, "medicalcertno")
      ? undefined
      : json["medicalcertno"],
    medicalcertissued:
      !exists(json, "medicalcertissued") || !json["medicalcertissued"]
        ? undefined
        : new Date(json["medicalcertissued"]),
    medicalcertexpiry:
      !exists(json, "medicalcertexpiry") || !json["medicalcertexpiry"]
        ? undefined
        : new Date(json["medicalcertexpiry"]),
    firstaidno: !exists(json, "firstaidno") ? undefined : json["firstaidno"],
    firstaidissued:
      !exists(json, "firstaidissued") || !json["firstaidissued"]
        ? undefined
        : new Date(json["firstaidissued"]),
    firstaidexpiry:
      !exists(json, "firstaidexpiry") || !json["firstaidexpiry"]
        ? undefined
        : new Date(json["firstaidexpiry"]),
    notes: !exists(json, "notes") ? undefined : json["notes"],
    certoverdue: !exists(json, "certoverdue") ? undefined : json["certoverdue"],
    certupcoming: !exists(json, "certupcoming")
      ? undefined
      : json["certupcoming"],
    firstaidoverdue: !exists(json, "firstaidoverdue")
      ? undefined
      : json["firstaidoverdue"],
    firstaidupcoming: !exists(json, "firstaidupcoming")
      ? undefined
      : json["firstaidupcoming"],
    customerId: !exists(json, "customer_id") ? undefined : json["customer_id"],
    created: !exists(json, "created") ? undefined : new Date(json["created"]),
    assignedVessels: !exists(json, "assigned_vessels")
      ? undefined
      : json["assigned_vessels"],
  };
}

export function CrewDetailsToJSON(value?: CrewDetails | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    firstname: value.firstname,
    lastname: value.lastname,
    role: value.role,
    coastal: value.coastal,
    active_crew: value.active_crew,
    locallimits: value.locallimits,
    offshore: value.offshore,
    restrictedlimits: value.restrictedlimits,
    medicalcertno: value.medicalcertno,
    medicalcertissued: !value.medicalcertissued
      ? ""
      : value.medicalcertissued.toISOString(),
    medicalcertexpiry: !value.medicalcertexpiry
      ? ""
      : value.medicalcertexpiry.toISOString(),
    firstaidno: value.firstaidno,
    firstaidissued: !value.firstaidissued
      ? ""
      : value.firstaidissued.toISOString(),
    firstaidexpiry: !value.firstaidexpiry
      ? ""
      : value.firstaidexpiry.toISOString(),
    notes: !value.notes ? "" : value.notes,
    assigned_vessels: value.assignedVessels,
  };
}
