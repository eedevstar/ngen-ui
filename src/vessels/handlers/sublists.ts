import * as R from "ramda";
import { fx, regEventFx } from "../../store";
import { routeIds, vesselSubListRouteIds } from "../../routes/events";
import {
  resetFormValidation,
  setBackPageType,
  setSubmittingFx,
} from "../../forms/helpers";
import { updateIn } from "../../util";
import { routeToEntityName } from "../selectors";
import { CertificateFromJSONTyped } from "../../../gen/ts/models";
import { regFormSubmitHandler } from "../../forms/handlers";
import { getForms, getSubCustomerId } from "forms/selectors";
import { getCurrentUser } from "users/selectors";
import { isCustomerAdmin } from "../../util";
import { getCustomer } from "customers/selectors";

// enter into table list routes
Object.entries(vesselSubListRouteIds).map(([k, v]) =>
  regEventFx(v, ({ db }, { id }) => {
    const user = getCurrentUser(db);
    if (!user) {
      return [];
    }
    const customerId = isCustomerAdmin(user)
      ? getSubCustomerId()
      : user.customerId;

    const entityName = routeToEntityName[v]["name"];
    return [
      fx.api(["vessel", "get", "many"], {
        perPage: 1000,
        customerId,
      }),
      fx.api(["vessel-document", "get", "many"], {
        vesselId: id,
        perPage: 1000,
      }),
      fx.api(["tag", "get", "many"], { perPage: 1000 }),
      fx.api(["user", "get", "many"], {
        perPage: 1000,
      }),
      fx.fetchApi({
        req: `/${entityName}/?vessel_id=${id}&per_page=1000`,
        success: ["api/sub-entities-success", { vesselId: id, entityName }],
        failure: "api/sub-entities-failure",
      }),
    ];
  })
);

// entry into detail routes (just grab all the children for now)
Object.entries(vesselSubListRouteIds).map(([k, routeId]) =>
  regEventFx(`${routeId}/detail`, ({ db }, { id, childId }) => {
    const entityName = routeToEntityName[routeId]["name"];
    const user = getCurrentUser(db);
    if (!user) return [];
    const customerId = isCustomerAdmin(user)
      ? getSubCustomerId()
      : user.customerId;

    return [
      fx.api(["vessel", "get", "many"], {
        perPage: 1000,
        customerId,
      }),
      fx.api(["vessel-document", "get", "many"], {
        vesselId: id,
        perPage: 1000,
      }),
      fx.api(["tag", "get", "many"], { perPage: 1000 }),
      fx.api(["user", "get", "many"], {
        perPage: 1000,
      }),
      fx.api(["crew", "get", "many"], { perPage: 1000 }),
      fx.fetchApi({
        req: `/${entityName}/?vessel_id=${id}&per_page=1000`,
        success: [
          "api/sub-entity-success",
          { childId, entityName, populateForm: true },
        ],
        failure: "api/sub-entities-failure",
      }),
    ];
  })
);

// emtry into create routes
Object.entries(vesselSubListRouteIds).map(([k, routeId]) =>
  regEventFx(`${routeId}/add`, ({ db }, { id }) => {
    const entityName = routeToEntityName[routeId]["name"];
    let defaultData = { vessel_id: id };
    let noticeMessage = null;
    if (
      routeId == routeIds.VESSEL_DRILLS ||
      routeId == routeIds.VESSEL_TRAINING
    ) {
      if (R.pathOr(false, ["forms", entityName, "justCompleted"], db)) {
        defaultData = R.pathOr(defaultData, ["forms", entityName], db);
        //Remove Due Date
        defaultData = R.dissocPath(["due_date"], defaultData);
        defaultData = R.dissocPath(["completed_date"], defaultData);
        defaultData = R.dissocPath(["justCompleted"], defaultData);
        defaultData = R.dissocPath(["attachment"], defaultData);

        noticeMessage = `Don't forget to enter when the next ${entityName} is due.`;
      }
    }
    console.log(`entering route to ADD ${entityName} under ${id} default data`);
    console.log(defaultData, noticeMessage);
    return [
      resetFormValidation(),
      ...(noticeMessage
        ? [
            fx.toast({
              status: "warning",
              description: noticeMessage,
              duration: 10000,
            }),
          ]
        : []),
      ...(entityName == "training" || entityName == "requests"
        ? [fx.api(["crew", "get", "many"], { perPage: 1000 })]
        : []),
      fx.db(R.assocPath(["forms", entityName], defaultData)),
    ];
  })
);

const fillFormFx = (entityName, childId, db) =>
  fx.db(
    R.assocPath(
      ["forms", entityName],
      R.path(["data", entityName, childId], db)
    )
  );

// entry into edit routes
Object.entries(vesselSubListRouteIds).map(([k, routeId]) =>
  regEventFx(`${routeId}/edit`, ({ db }, { id, childId }) => {
    const entityName = routeToEntityName[routeId]["name"];
    console.log(
      `entering route to EDIT ${entityName} '${childId}' under ${id}`
    );
    // Note: sad that it is param name for vessel id is id instead of vesselId. Should refactor at some point as its making some
    // things wonky
    if (!R.path(["data", entityName, childId], db)) {
      console.log("no data for that entry");
      // @ts-ignore
      return [fx.route(`${routeId}/detail`, { id, childId })];
    }
    return [resetFormValidation(), fillFormFx(entityName, childId, db)];
  })
);

// create
Object.entries(vesselSubListRouteIds).map(([k, routeId]) =>
  regEventFx(`${routeId}/edit`, ({ db }, { id, childId }) => {
    const entityName = routeToEntityName[routeId]["name"];
    console.log(
      `entering route to EDIT ${entityName} '${childId}' under ${id}`
    );
    // Note: sad that it is param name for vessel id is id instead of vesselId. Should refactor at some point as its making some
    // things wonky
    if (!R.path(["data", entityName, childId], db)) {
      console.log("no data for that entry");
      // @ts-ignore
      return [fx.route(`${routeId}/detail`, { id, childId })];
    }
    return [fillFormFx(entityName, childId, db)];
  })
);

/**
 * Fetched list success
 */
regEventFx(
  "api/sub-entities-success",
  ({ db }, { res: { json }, args: { vesselId, entityName } }) => {
    console.log("success in loading subentites!", vesselId, entityName, json);
    // @ts-ignore
    return [
      fx.db(
        updateIn(
          ["data", entityName],
          // @ts-ignore
          (m = {}) => R.merge(m, R.indexBy(R.prop("id"), json.items))
        )
      ),
    ];
  }
);

/**
 * Fetched item (as part of list) success
 */
// regEventFx('api/sub-entity-success', ({ db }, { res: { json }, args: { entityName, childId, populateForm } }) => {
//   console.log('success in loading the targeted subentity!', entityName, childId, json)
//   // @ts-ignore
//   const updateData =
//     updateIn(
//       ['data', entityName],
//       // @ts-ignore
//       (m = {}) =>
//         R.merge(m, R.indexBy(R.prop('id'), json.items)),
//     )
//   const fxr = !populateForm ? [fx.db(updateData)]
//     : [fx.db(updateData), fillFormFx(entityName, childId, updateData(db))]
//   console.log(fxr)
//   return fxr
// })

regEventFx(
  "api/sub-entity-success",
  ({ db }, { res: { json }, args: { entityName, childId, populateForm } }) => {
    console.log(
      "success in loading the targeted subentity!",
      entityName,
      childId,
      json
    );
    // @ts-ignore
    const updateData = updateIn(
      ["data", entityName],
      // @ts-ignore
      (m = {}) => R.merge(m, R.indexBy(R.prop("id"), json.items))
    );
    return [
      fx.db(updateData),
      ...(!populateForm
        ? []
        : [fillFormFx(entityName, childId, updateData(db))]),
    ];
  }
);

regEventFx("api/sub-entities-failure", (_, r) => {
  console.log("failure!", r);
  return [fx.toast({ status: "error", title: "Could not load data." })];
});
