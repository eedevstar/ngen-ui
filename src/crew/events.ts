import { CrewType } from "./db";
import { success } from "../api/util";
import { routeIds } from "../routes/events";

export const crewEvent = {
  ENTER: "crew/enter",
  EXIT: "crew/exit",
  DELETE_CREW: "crew/delete",
  DOWNLOAD_DOCUMENT: "crew/download-document",
  DELETE_DOCUMENT: "crew/delete-document",
  UPLOAD_MEDICAL_CERT_IMAGE: "crew/upload-medical-cert-image",
  UPLOAD_FIRST_AID_CERT_IMAGE: "crew/upload-first-aid-cert-image",
} as const;

export type CrewEventPayloads = {
  [crewEvent.DELETE_CREW]: any;
  [crewEvent.ENTER]: any;
  [crewEvent.EXIT]: any;
  [crewEvent.DOWNLOAD_DOCUMENT]: { id: string };
  [crewEvent.DELETE_DOCUMENT]: { id: string };

  // reusing the route ids as enters
  [routeIds.CREW_LIST]: never;
  [routeIds.CREW_DETAIL]: { id: string };
  [routeIds.CREW_ADD]: never;
  [routeIds.CREW_EDIT]: { id: string };
};
