import { routeIds } from "../routes/events";

export const vesselEvent = {
  DELETE_VESSEL: "vessel/delete",
  SHOW_CREW_LIST: "vessel/show-crew-list",
  HIDE_CREW_LIST: "vessel/hide-crew-list",
  UPDATE_VESSEL_CREW: "vessel/update-vessel-crew",
  SHOW_CREW_ASSIGN: "vessel/show-select-crew",
  HIDE_CREW_ASSIGN: "vessel/HIDE-select-crew",
  DOWNLOAD_DOCUMENT: "vessel/download-document",
  UPDATE_TAGS: "vessel/update-tags",
  SORT_TABLE: "vessel/sort-table",
  SWITCH_OVERDUE_TABLE: "vessel/switch-overdue-table",
  DELETE_DOCUMENT: "vessel/delete-document",
} as const;

export type VesselEventPayloads = {
  [vesselEvent.DELETE_VESSEL]: { id: string | number };
  [routeIds.VESSEL_LIST]: any;
  [routeIds.VESSEL_DETAIL]: { id: string };
  [vesselEvent.SHOW_CREW_LIST]: any;
  [vesselEvent.HIDE_CREW_LIST]: any;
  [vesselEvent.UPDATE_VESSEL_CREW]: {
    vesselId: string | number;
    crew: any;
    add: boolean;
  };
  [vesselEvent.SHOW_CREW_ASSIGN]: any;
  [vesselEvent.HIDE_CREW_ASSIGN]: any;
  [vesselEvent.DOWNLOAD_DOCUMENT]: { id: string };
  [vesselEvent.DELETE_DOCUMENT]: { id: string };
  [vesselEvent.UPDATE_TAGS]: {
    type: string;
    tag: string;
  };
  [vesselEvent.SORT_TABLE]: {
    table: string;
    key: string;
    dir: string;
  };
  [vesselEvent.SWITCH_OVERDUE_TABLE]: { type: string };
};
