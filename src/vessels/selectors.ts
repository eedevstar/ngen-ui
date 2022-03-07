import { derive } from "framework-x";
import * as R from "ramda";
import { Db, Vessel } from "./db";
import { getRouteId, getRouteParams } from "../routes/selectors";
import { getCrewList } from "../crew/selectors";
import { CrewDetails, Document } from "../../gen/ts/models";
import { routeIds } from "../routes/events";
import {
  getBackPageType,
  getCurrentPageNumber,
  getForms,
  getPerPage,
} from "../forms/selectors";
import { fx } from "store";
import { PAGINATION_PER_PAGE } from "../util";

export type VesselAdd = { source: string };

// @ts-ignore
export const getPagination = R.pathOr({}, ["pagination"]);
export const getCategoryFilter = R.pathOr({}, ["category-filter"]);
export const getData = R.pathOr({}, ["data"]);
export const getTable = R.pathOr({}, ["table"]);
export const getVessel = derive(getData, R.path(["vessel"]));
export const getVessels = derive(getVessel, R.values);

export const getSelectedVesselId = derive([getRouteParams], R.path(["id"]));
export const getSelectedChildId = derive([getRouteParams], R.path(["childId"]));

// TODO. db should have vessel members indexed by id by default
export const getVesselById = derive(getVessels, R.indexBy(R.prop("id")));

export const getShowCrewListModal = R.path(["vesselList", "showCrewList"]);
export const getShowCrewAssignModal = R.path(["vesselList", "showCrewAssign"]);

export const getCrewByVesselId = derive(getCrewList, (list) =>
  R.reduce(
    (acc, crew: CrewDetails) => {
      // mutable is ok in an accumulator -- as long as we remember that we can't curry the outer reduce
      crew.assignedVessels.forEach((id) => {
        acc[id] = acc[id] || [];
        acc[id].push(crew);
      });
      return acc;
    },
    {},
    list
  )
);
export const getDocument = derive(getData, R.pathOr({}, ["vessel-document"]));
export const getDocumentList = derive(getDocument, R.values);
export const getDocumentListByVesselId = derive(
  [getDocumentList, getSelectedVesselId],
  (list, vesselId) =>
    R.filter((doc: Document) => {
      return doc.vesselId == vesselId;
    }, list)
);
export const getVesselShipParticular = derive(
  [getDocumentListByVesselId],
  (docList) => R.find(R.propEq("docType", "ship_particulars"))(docList)
);

export const getDocumentListByChildId = derive(
  [getDocumentListByVesselId, getSelectedChildId],
  (docList, childId) =>
    R.filter((doc: Document) => {
      return doc.objId == childId;
    }, docList)
);

export const getSelectedVesselDetail: (db: Db) => Vessel = derive(
  [
    getSelectedVesselId,
    getVesselById,
    getCrewByVesselId,
    getDocumentListByVesselId,
  ],
  (id, vesselMap, crewByVesselId, documentList) => {
    const vessel = R.assoc("crew", crewByVesselId[id] || [], vesselMap[id]);
    return R.assoc("document", documentList || [], vessel);
  }
);

export const routeToEntityName = {
  [routeIds.VESSEL_CERTS]: {
    name: "vesselcert",
    label: "Certifications & Documents",
  },
  [routeIds.VESSEL_AUDITS]: { name: "audit", label: "Audits" },
  [routeIds.VESSEL_SURVEYS]: { name: "survey", label: "Surveys" },
  [routeIds.VESSEL_REVIEWS]: { name: "review", label: "Reviews" },
  [routeIds.VESSEL_DRILLS]: { name: "drill", label: "Emergency Drills" },
  [routeIds.VESSEL_TRAINING]: { name: "training", label: "Training" },
  [routeIds.VESSEL_EQUIP]: { name: "safetyequipment", label: "Equipment" },
  [routeIds.VESSEL_SAFETY]: { name: "health", label: "Health & Safety" },
  [routeIds.VESSEL_MAINT]: { name: "maintenance", label: "Maintenance" },
  [routeIds.VESSEL_PARTS]: { name: "part", label: "Spare Parts" },
  [routeIds.VESSEL_ACTIONS]: { name: "action", label: "Corrective Actions" },
  [routeIds.VESSEL_REPAIRS]: { name: "requests", label: "Repair Requests" },
};

export const getVesselSubEntityName = derive(getRouteId, (id) => {
  return R.prop(
    id.replace("/edit", "").replace("/detail", "").replace("/add", ""),
    routeToEntityName
  )["name"];
});
export const getVesselSubEntityLabel = derive(getRouteId, (id) => {
  return R.prop(
    id.replace("/edit", "").replace("/detail", "").replace("/add", ""),
    routeToEntityName
  )["label"];
});
export const getVesselSubEntityDetailRoute = derive(getRouteId, (id) => {
  return id.replace("/edit", "").replace("/detail", "").replace("/add", "");
});
export const getVesselSubEntityList = derive(
  [getVesselSubEntityName, getData, getSelectedVesselId],
  (entityName, data, vesselId) =>
    R.filter(
      (row) => row.vesselId === vesselId || row.vessel_id === vesselId,
      R.values(data[entityName])
    )
);

export const getVesselSubColumnNames = derive(
  getVesselSubEntityName,
  (entityName: string) => {
    switch (entityName) {
      case "vesselcert":
        return [
          "name",
          "cert_type",
          "document_number",
          "issue_date",
          "expiry_date",
          "survey_required",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "audit":
        return [
          "name",
          "due_date",
          "completed_date",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "survey":
      case "review":
      case "training":
        return [
          "name",
          "completed_date",
          "due_date",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "drill":
        return [
          "name",
          "tag",
          "completed_date",
          "due_date",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "safetyequipment":
        return [
          "name",
          "tag",
          "doc_no",
          "date_issued",
          "expiry_date",
          "location",
          "survey_required",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "health":
        return [
          "name",
          "tag",
          "due_date",
          "reminder_frq",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "maintenance":
        return [
          "name",
          "tag",
          "due_date",
          "reminder_frq",
          "maintenance_complete",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "part":
        return ["name", "date_added", "quantity", "location"];
      case "action":
        return [
          "name",
          "doc_no",
          "date_issued",
          "date_completed",
          "fix_by_date",
          // "overdue",
          // "upcoming",
          // "created",
        ];
      case "requests":
        return [
          "description",
          "reported_date",
          "reported_by",
          "priority",
          "required_action",
          "due_date",
          "date_completed",
          "signed_off_by",
          // "overdue",
          // "upcoming",
          // "created",
        ];
    }
  }
);

export const getSelectedVesselSubItemId = derive(
  [getRouteParams],
  R.path(["childId"])
);
export const getSelectedSubItemDetail: (db: Db) => any = derive(
  [getVesselSubEntityName, getSelectedVesselSubItemId, getData],
  (name, subitemId, data) => R.path([name, subitemId], data)
);
export const getSelectedSubItemForm: (db: Db) => any = derive(
  [getVesselSubEntityName, getForms],
  (name, data) => {
    // console.log({name, data})
    return R.path([name], data);
  }
);
export const getVesselLimit = derive(getData, (data) => {
  const customers = R.values(R.propOr({}, "customer", data));
  if (R.length(customers) > 0) {
    const r = customers[0];
    return R.propOr(0, "licensedvessels", r);
  }
  return 0;
});

export const getVesselStatuses = derive(getData, (data) =>
  R.pathOr(null, ["overdue"], data)
);

export const getVesselTags = (type) =>
  derive(getData, (data) => R.pathOr([], ["vessels_tags", type], data));

export const getTableSortBy = (table) =>
  R.pathOr(null, ["table", table, "sort"]);

export const getVesselOverdueListType = R.path([
  "vesselList",
  "overdueTableType",
]);

export const getVesselSubPageSize = derive(
  [getPagination, getVesselSubEntityName],
  (db, entity) => R.pathOr(PAGINATION_PER_PAGE, [entity, "page-size"], db)
);
export const getVesselSubCurrentPage = derive(
  [getPagination, getVesselSubEntityName],
  (db, entity) => R.pathOr(1, [entity, "current"], db)
);
export const getVesselSubTableSortBy = derive(
  [getTable, getVesselSubEntityName],
  (db, entity) => R.pathOr(null, [entity, "sort"], db)
);
export const getVesselSubEntityTags = derive(
  [getData, getVesselSubEntityName],
  (data, labelName) => {
    let tagLabel = "";
    switch (labelName) {
      case "health":
        tagLabel = "healthandsafety";
        break;
      case "vesselcert":
        tagLabel = "certificate";
        break;
      default:
        tagLabel = labelName;
        break;
    }
    return R.pathOr([], ["vessels_tags", tagLabel], data);
  }
);
export const getVesselSubCurrentTag = derive(
  [getCategoryFilter, getVesselSubEntityName],
  (data, labelName) => R.propOr("All", labelName, data)
);
