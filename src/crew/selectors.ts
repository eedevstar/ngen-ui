import { derive } from "framework-x";
import * as R from "ramda";
import { CrewType, Db } from "./db";
import { getRouteId, getRouteParams } from "../routes/selectors";
import { emptyObj } from "../util";
import { CrewDetails } from "../../gen/ts/models";
import { routeIds } from "routes/events";

export type CrewAdd = { source: string };

// @ts-ignore
export const getData = R.path(["data"]);
export const getCrew = derive(getData, R.pathOr(emptyObj, ["crew"]));
export const getCrewList = derive(getCrew, R.values);

export const getSelectedCrewId = derive([getRouteParams], R.prop("id"));
export const getSelectedChildId = derive([getRouteParams], R.path(["childId"]));
export const getCrewCertsById = R.path(["data", "crewcert"]);
export const getCrewCertsList = derive(getCrewCertsById, R.values);

export const getCertsByCrewId = derive(
  getCrewCertsList,
  R.groupBy(R.prop("crewId"))
);

export const getSelectedCrewDetail: (db: Db) => any = derive(
  [getSelectedCrewId, getCrew, getCertsByCrewId],
  (id, crewMap, certsByCrewId) =>
    R.assoc("certs", certsByCrewId[id] || [], crewMap[id])
);
export const getCrewStatuses = derive(getData, (data) =>
  R.pathOr(null, ["crewoverdue"], data)
);

export const routeToEntityName = {
  [routeIds.CREW_CERTS]: {
    name: "crewcert",
    label: "Certifications & Documents",
  },
};
export const getCrewSubEntityName = derive(getRouteId, (id) => {
  return R.prop(
    id.replace("/edit", "").replace("/detail", "").replace("/add", ""),
    routeToEntityName
  )["name"];
});
export const getCrewSubEntityLabel = derive(getRouteId, (id) => {
  return R.prop(
    id.replace("/edit", "").replace("/detail", "").replace("/add", ""),
    routeToEntityName
  )["label"];
});
export const getCrewSubEntityDetailRoute = derive(getRouteId, (id) => {
  return id.replace("/edit", "").replace("/detail", "").replace("/add", "");
});

export const getDocument = derive(getData, R.pathOr({}, ["crew-document"]));
export const getDocumentList = derive(getDocument, R.values);
export const getDocumentListByCrewId = derive(
  [getDocumentList, getSelectedCrewId],
  (list, crewId) =>
    R.filter((doc: Document) => {
      return doc.crewId == crewId;
    }, list)
);
export const getCertDocumentById = derive(
  getDocumentList,
  (list) => (certId) => {
    const docs = R.filter((doc: Document) => {
      return doc.objId == certId;
    }, list);
    return !docs ? null : docs[0];
  }
);
