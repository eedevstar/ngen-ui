import { dispatch, fx, regEventFx } from "../../store";
import { DrillFromJSONTyped } from "../../../gen/ts/models";
import { setSubmittingFx, validateForm } from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
import { routeEvent, routeIds } from "../../routes/events";
import * as R from "ramda";
import { getSelectedSubItemForm, getSelectedVesselId } from "../selectors";
import { getForms } from "forms/selectors";
import { vesselEvent } from "vessels/events";
import { formEvt } from "forms/events";
import { uploadToS3 } from "../../util";

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
  { name: "tag", rule: "required" },
  { name: "due_date", rule: "required|date" },
  { name: "completed_date", rule: "date" },
];

regFormSubmitHandler(["drill", "edit"], ({ db }, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = DrillFromJSONTyped(form, true);
    const oldData = R.path(["data", "drill", form.id], db);
    let returnActions = [];
    if (!oldData["completed_date"] && payload["completedDate"]) {
      returnActions.push(
        fx.db(R.assocPath(["forms", "drill", "justCompleted"], true))
      );
    } else {
      returnActions.push(
        fx.db(R.assocPath(["forms", "drill", "justCompleted"], false))
      );
    }
    returnActions.push(setSubmittingFx(true));
    returnActions.push(
      fx.api(["drill", "update", "one"], { id: form.id, payload })
    );
    return returnActions;
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["drill", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = DrillFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.db(
        R.assocPath(
          ["forms", "drill", "justCompleted"],
          !payload["completedDate"] ? false : true
        )
      ),
      fx.api(["drill", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["drill", "delete"], (_, { form }) => {
  const payload = DrillFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["drill", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "drill",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-drill-success",
    }
  );

regEventFx("api/s3-presign-drill-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  const backPage = form["justCompleted"]
    ? fx.dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_DRILLS_ADD])
    : fx.dispatch(routeEvent.BACK);
  return [uploadToS3(rsp, file), setSubmittingFx(false), backPage];
});

// TODO: auto-add these via the api handler?
regEventFx("api/update-one-drill-success", ({ db }, { vesselId, id }) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  const newTag = form?.new_tag ? form.tag : false;
  const backPage = form["justCompleted"]
    ? fx.dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_DRILLS_ADD])
    : fx.route(routeIds.VESSEL_DRILLS, { id: form.vessel_id });

  let fileFx = [];
  if (file) {
    if (file === "deleted") {
      fileFx.push(
        fx.dispatch(vesselEvent.DELETE_DOCUMENT, {
          id: form["attachment_deleted"],
        })
      );
      fileFx.push(setSubmittingFx(false));
      fileFx.push(backPage);
    } else {
      fileFx.push(submitFileFx(file, vesselId, id));
    }
  } else {
    fileFx.push(setSubmittingFx(false));
    fileFx.push(backPage);
  }
  return [
    ...(newTag
      ? [
          fx.dispatch(vesselEvent.UPDATE_TAGS, {
            type: "drill",
            tag: newTag,
          }),
        ]
      : []),
    ...fileFx,
  ];
});

regEventFx("api/create-one-drill-success", ({ db }, { vesselId, id }) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  const newTag = form?.new_tag ? form.tag : false;
  const backPage = form["justCompleted"]
    ? fx.dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_DRILLS_ADD])
    : fx.route(routeIds.VESSEL_DRILLS, { id: form.vessel_id });
  return [
    ...(newTag
      ? [
          fx.dispatch(vesselEvent.UPDATE_TAGS, {
            type: "drill",
            tag: newTag,
          }),
        ]
      : []),
    ...(file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), backPage]),
  ];
});

regEventFx("api/delete-one-drill-success", ({ db }, {}) => {
  const form = getForms(db)["drill"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "drill"])),
    fx.db(R.dissocPath(["data", "drill", form.id])),
    fx.route(routeIds.VESSEL_DRILLS, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-drill-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-drill-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-drill-failure", () => {
  return [setSubmittingFx(false)];
});
