import * as R from "ramda";
import { derive } from "framework-x";
import { formIds, Forms } from "./types";
import { getRouteId } from "../routes/selectors";
import { PAGINATION_PER_PAGE } from "../util";

const EMPTY_JS_OBJECT = {};

export const getForms = R.pathOr(EMPTY_JS_OBJECT, ["forms"]);

const makeFormSelectors = <T extends Readonly<(keyof Forms)[]>>(
  ids: T
): { [K in keyof Forms]: (db: any) => Forms[K] } => {
  return ids.reduce((a, id) => {
    a[id] = derive(getForms, R.path([id]));
    return a;
  }, {} as { [K in keyof Forms]: (db: any) => Forms[K] });
};

export const formSelectors = makeFormSelectors(formIds);

export const makeFormSelector = (name) => R.path(["forms", name]);

// const x = formSelectors.crew({})
export const getIsSubmitting = R.pathOr(false, ["generic", "submitting"]);
export const getIsShowAlertModal = R.pathOr(false, [
  "generic",
  "show_alert_modal",
]);
export const getIsOpenConfirm = R.pathOr(false, ["isConfirmOpen"]);
export const getConfirmDeleteOnModal = R.pathOr(false, [
  "confirmDeleteOnModal",
]);

export const getFormMode = derive(getRouteId, (id) =>
  id.endsWith("/edit") ? "edit" : id.endsWith("/detail") ? "read" : "create"
);

export const getProcessingList = R.pathOr({}, ["generic", "processing"]);

export const getShowPassword = (name) =>
  R.pathOr(false, ["show_password", name]);

export const getSelectedItem = (type) => R.pathOr(false, ["select", type]);
export const getisShowResetPwdForm = R.pathOr(false, [
  "modal",
  "showing_reset_pwd_form",
]);

export const getFormValidation = R.pathOr({}, ["form-validation"]);

export const getBackPageType = R.pathOr(null, ["forms", "back-type"]);

export const getSubCustomerId = () => sessionStorage.getItem("sub-customer-id");

export const getPageSize = (page) =>
  R.pathOr(PAGINATION_PER_PAGE, ["pagination", page, "page-size"]);

export const getCurrentPageNumber = (page) =>
  R.pathOr(1, ["pagination", page, "current"]);
