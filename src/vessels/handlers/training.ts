import { dispatch, fx, regEventFx } from "../../store";
import { TrainingFromJSONTyped } from "../../../gen/ts/models";
import { setSubmittingFx, validateForm } from "../../forms/helpers";
import { regFormSubmitHandler } from "../../forms/handlers";
import { routeEvent, routeIds } from "../../routes/events";
import * as R from "ramda";
import { getSelectedSubItemForm, getSelectedVesselId } from "../selectors";
import { getForms } from "forms/selectors";
import { formEvt } from "forms/events";
import { uploadToS3 } from "../../util";
import { vesselEvent } from "vessels/events";

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
  { name: "due_date", rule: "date" },
  { name: "completed_date", rule: "date" },
];

regFormSubmitHandler(["training", "edit"], ({ db }, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = TrainingFromJSONTyped(form, true);
    const oldData = R.path(["data", "training", form.id], db);
    let returnActions = [];
    if (!oldData["completed_date"] && payload["completedDate"]) {
      returnActions.push(
        fx.db(R.assocPath(["forms", "training", "justCompleted"], true))
      );
    } else {
      returnActions.push(
        fx.db(R.assocPath(["forms", "training", "justCompleted"], false))
      );
    }

    returnActions.push(setSubmittingFx(true));
    returnActions.push(
      fx.api(["training", "update", "one"], { id: form.id, payload })
    );
    return returnActions;
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});

regFormSubmitHandler(["training", "create"], (_, { form }) => {
  const validateResult = validateForm(form, validations);
  if (validateResult === true) {
    const payload = TrainingFromJSONTyped(form, true);
    return [
      setSubmittingFx(true),
      fx.db(
        R.assocPath(
          ["forms", "training", "justCompleted"],
          !payload["completedDate"] ? false : true
        )
      ),
      fx.api(["training", "create", "one"], { payload }),
    ];
  } else {
    return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
  }
});
regFormSubmitHandler(["training", "delete"], (_, { form }) => {
  const payload = TrainingFromJSONTyped(form, true);
  return [
    setSubmittingFx(true),
    fx.api(["training", "delete", "one"], { id: form.id }),
  ];
});

const submitFileFx = (file: File, vesselId: string, objId: string) =>
  fx.api(
    ["vessel-document", "create", "one"],
    {
      vesselId,
      docType: "training",
      objId,
      replaceDoc: true,
      file,
    },
    {
      onSuccess: "api/s3-presign-training-success",
    }
  );

regEventFx("api/s3-presign-training-success", ({ db }, rsp) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  const backPage = form["justCompleted"]
    ? fx.dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_TRAINING_ADD])
    : fx.dispatch(routeEvent.BACK);
  return [uploadToS3(rsp, file), setSubmittingFx(false), backPage];
});

// TODO: auto-add these via the api handler?
regEventFx("api/update-one-training-success", ({ db }, { vesselId, id }) => {
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  const backPage = form["justCompleted"]
    ? fx.dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_TRAINING_ADD])
    : fx.route(routeIds.VESSEL_TRAINING, { id: form.vessel_id });

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
  return fileFx;
});

regEventFx("api/create-one-training-success", ({ db }, { vesselId, id }) => {
  console.log("finished creating.", vesselId, id);
  const form = getSelectedSubItemForm(db);
  const file = form?.attachment;
  const backPage = form["justCompleted"]
    ? fx.dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_TRAINING_ADD])
    : fx.route(routeIds.VESSEL_TRAINING, { id: form.vessel_id });
  return [
    ...(file
      ? [submitFileFx(file, vesselId, id)]
      : [setSubmittingFx(false), backPage]),
  ];
});

regEventFx("api/delete-one-training-success", ({ db }, {}) => {
  const form = getForms(db)["training"];
  return [
    setSubmittingFx(false),
    fx.db(R.dissocPath(["forms", "training"])),
    fx.db(R.dissocPath(["data", "training", form.id])),
    fx.route(routeIds.VESSEL_TRAINING, { id: form.vessel_id }),
  ];
});

regEventFx("api/update-one-training-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-training-failure", () => {
  return [setSubmittingFx(false)];
});
regEventFx("api/delete-one-training-failure", () => {
  return [setSubmittingFx(false)];
});
