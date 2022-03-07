import { FormId, FormName } from "./types";

export const formEvt = {
  SET_VALUE: "form/set-value",
  CLEAR_FORM: "form/clear",
  SUBMIT_FORM: "form/submit",
  SHOW_PASSWORD: "form/show-password",
  HIDE_PASSWORD: "form/hide-password",
  HIDE_ALERT_MODAL: "form/hide-alert-modal",
  SHOW_ALERT_MODAL: "form/show-alert-modal",
  SELECT_ITEM: "form/select-item",
  DESELECT_ITEM: "form/deselect-item",
  SHOW_PWD_RESET_FORM: "form/show-reset-pwd-form",
  HIDE_PWD_RESET_FORM: "form/hide-reset-pwd-form",
  SET_VALIDATION: "form/set-validation",
  RESET_VALIDATION: "form/reset-validation",
  SET_BACK_PAGE_TYPE: "form/set-back-page-type",
  SET_SUB_CUSTOMER_ID: "form/set-sub-customer-id",
  SET_CURRENT_PAGE: "form/set-current-page",
  SET_PAGE_SIZE: "form/set-page-size",
  SET_CATEGORY_FILTER: "form/set-category-filter",
} as const;

export type FormEventPayloads = {
  [formEvt.SET_VALUE]: {
    value: any;
    path: string[];
  };
  [formEvt.CLEAR_FORM]: FormId;
  [formEvt.SUBMIT_FORM]: any;
  [formEvt.SHOW_PASSWORD]: { key: string };
  [formEvt.HIDE_PASSWORD]: { key: string };
  [formEvt.HIDE_ALERT_MODAL]: any;
  [formEvt.SHOW_ALERT_MODAL]: any;
  [formEvt.SELECT_ITEM]: { type: string; value: any };
  [formEvt.DESELECT_ITEM]: { type: string; value: any };
  [formEvt.SHOW_PWD_RESET_FORM]: any;
  [formEvt.HIDE_PWD_RESET_FORM]: any;
  [formEvt.SET_VALIDATION]: { result: any };
  [formEvt.RESET_VALIDATION]: { field: any };
  [formEvt.SET_BACK_PAGE_TYPE]: { type: string };
  [formEvt.SET_SUB_CUSTOMER_ID]: { id: string };
  [formEvt.SET_CURRENT_PAGE]: { page: string; num: number };
  [formEvt.SET_PAGE_SIZE]: { page: string; count: number };
  [formEvt.SET_CATEGORY_FILTER]: { page: string; category: number };
};
