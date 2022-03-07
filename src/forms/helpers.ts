import * as R from "ramda";
import { fx } from "../store";
import { formEvt } from "./events";
import { theme } from "styles/theme";
import moment from "moment";
import { formatDateForEdit } from "../util";
/**
 * Creates an event fx that handles prepping an edit form
 * @param subj
 */
export const onEdit = (subj, noDataRoute, noDataParams = {}) => (
  { db },
  { id }
) => {
  console.log("on edit of form...");
  // for now, if data isn't loaded yet, ok just to go back to list view
  if (!R.path(["data", subj, id], db)) {
    console.log("no data for that entry");
    return [fx.route(noDataRoute, { id, ...noDataParams })];
  }
  return [fx.db(R.assocPath(["forms", subj], R.path(["data", subj, id], db)))];
};

export const makeBind = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  value: form[name] || "",
  readonly: formMode === "read",
  onChange: (e) => {
    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value: e.target.value,
    });
  },
});

export const makeBindDate = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  value: form[name] || "",
  readonly: formMode === "read",
  onChange: (e) => {
    const value = e.target.value;

    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value: formatDateForEdit(e.target.value),
    });
  },
});
export const makeBindNumber = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  value: form[name] || "",
  readonly: formMode === "read",
  onChange: (val) => {
    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value: val,
    });
  },
});
export const makeBindSwitch = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  isChecked: form[name],
  readonly: formMode === "read",
  onChange: (e) => {
    const value = e.target.checked;
    console.log("switch changed to", value);
    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value,
    });
  },
});
export const makeBindFile = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  value: form[name],
  readonly: formMode === "read",
  onChange: (e) => {
    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value: e.target.files[0],
    });
  },
  onDelete: (docId) => {
    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value: form[name] === "deleted" ? null : "deleted",
    });
    dispatch(formEvt.SET_VALUE, {
      path: [formName, `${name}_deleted`],
      value: docId,
    });
  },
});
export const makeBindThumbnail = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  value: form[name],
  readonly: formMode === "read",
  onChange: (e) => {
    const reader = new FileReader();
    const _handleReaderloaded = (readerEvt) => {
      let binaryString = readerEvt.target.result;
      dispatch(formEvt.SET_VALUE, {
        path: [formName, name],
        value: btoa(binaryString),
      });
    };
    reader.onload = _handleReaderloaded.bind(this);
    reader.readAsBinaryString(e.target.files[0]);
    // dispatch(formEvt.SET_VALUE, {
    //   path: [formName, name],
    //   value: e.target.files[0].name,
    // });
  },
});
export const makeBindSelect = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  value: form[name] || "",
  readonly: formMode === "read",
  onChange: (e) => {
    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value: e == null ? "" : e.value,
    });
    dispatch(formEvt.SET_VALUE, {
      path: [formName, "new_tag"],
      value: e == null || e.__isNew__ == undefined ? false : e.__isNew__,
    });
  },
});
export const makeBindCrewSelect = ({ dispatch, formName, form, formMode }) => (
  name: string
) => ({
  value: form[name] || "",
  readonly: formMode === "read",
  onChange: (e) => {
    dispatch(formEvt.SET_VALUE, {
      path: [formName, name],
      value: !e == null ? [] : R.map((item) => item.value, e),
    });
  },
});
export const setSubmittingFx = (value) =>
  fx.db(R.assocPath(["generic", "submitting"], value));
export const setShowAlertModalFx = (value) =>
  fx.db(R.assocPath(["generic", "show_alert_modal"], value));
export const setProcessingFx = (key, value) =>
  fx.db(R.assocPath(["generic", "processing", key], value));

export const setShowPassword = (key, value) =>
  fx.db(R.assocPath(["show_password", key], value));

export const overDueStatus = {
  NORMAL: 1,
  BEING: 2,
  OVERDUE: 3,
};
export const getOverDueStatus = (row) => {
  let status = overDueStatus.NORMAL;
  if (R.has("completed_date")(row) && row["completed_date"]) {
    return status;
  }
  if (row["maintenance_complete"] || row["complete"]) {
    return status;
  }
  if (
    R.has("expiry_date")(row) ||
    R.has("due_date")(row) ||
    R.has("expiryDate")(row)
  ) {
    let dueDate = null;
    if (R.has("expiry_date")(row)) dueDate = R.path(["expiry_date"], row);
    else if (R.has("expiryDate")(row)) dueDate = R.path(["expiryDate"], row);
    else if (R.has("due_date")(row)) dueDate = R.path(["due_date"], row);

    if (!dueDate) {
      return status;
    }

    let date = new Date(dueDate);
    let curDate = new Date();
    const diff = date.getTime() - curDate.getTime();
    if (diff < 0) {
      status = overDueStatus.OVERDUE;
    } else if (diff < 14 * 24 * 60 * 60 * 1000) {
      status = overDueStatus.BEING;
    }
  }
  return status;
};
export const getTrCssForOverDueStatus = (row, status = null) => {
  if (!status) status = getOverDueStatus(row);
  let css = {};
  let hCss = {};
  if (status == overDueStatus.BEING) {
    css = {
      backgroundColor: theme.colors.orange[100],
      color: theme.colors.orange[500],
      borderColor: theme.colors.orange[200],
    };
    hCss = {
      backgroundColor: theme.colors.orange[200],
      color: theme.colors.orange[700],
    };
  } else if (status == overDueStatus.OVERDUE) {
    css = {
      backgroundColor: theme.colors.red[100],
      color: theme.colors.red[500],
      borderColor: theme.colors.red[200],
    };
    hCss = {
      backgroundColor: theme.colors.red[200],
      color: theme.colors.red[700],
    };
  } else {
    hCss = {
      backgroundColor: theme.colors.cyan[100],
      color: theme.colors.cyan[700],
      borderColor: theme.colors.cyan[200],
    };
  }
  css = R.assoc("cursor", "pointer", css);
  return { css: css, _hover: hCss };
};
export const selectItemFx = (type, value) =>
  fx.db(R.assocPath(["select", type], value));
export const deSelectItemFx = (type) => fx.db(R.dissocPath(["select", type]));
export const setShowRestPwdFormFx = (value) =>
  fx.db(R.assocPath(["modal", "showing_reset_pwd_form"], value));
export const getSelectOptions = (items) => {
  const options = [];
  items.forEach((item) => {
    options.push({ label: item, value: item });
  });
  return options;
};
export const resetFormValidation = () => fx.db(R.dissoc("form-validation"));
export const setFormValidation = (result) =>
  fx.db(R.assoc("form-validation", result));

export const isInvalid = (field: string, validation: any) => {
  return R.has(field)(validation) ? validation[field] : false;
};
export const validateField = (value, rule) => {
  const rules = R.split("|", rule);
  let isValid = true;
  rules.forEach((r) => {
    const [f, p] = R.split(":", r);
    switch (f) {
      case "date":
        isValid =
          !value || value == "__/__/____" ? isValid : !isNaN(Date.parse(value));
        break;
      case "max":
        isValid =
          isNaN(value) || parseInt(value) > parseInt(p) ? false : isValid;
        break;
      case "min":
        isValid =
          isNaN(value) || parseInt(value) < parseInt(p) ? false : isValid;
        break;
      case "required":
      default:
        isValid = value == "" || value == undefined ? false : isValid;
        break;
    }
  });
  return isValid;
};
export const makeValidator = ({ dispatch, form, validation }) => (
  name: string,
  rule: string
) => ({
  isInvalid: isInvalid(name, validation),
  onBlur: (e) => {
    if (validateField(form[name], rule)) {
      dispatch(formEvt.RESET_VALIDATION, { field: name });
    }
  },
});
export const validateForm = (
  form: any,
  fields: Array<{ name: string; rule: string }>
) => {
  let isValid = true;
  let invalidFields = {};
  fields.forEach((item) => {
    if (!validateField(form[item.name], item.rule)) {
      invalidFields[item.name] = true;
      isValid = false;
    }
  });
  return isValid ? isValid : invalidFields;
};
export const setBackPageType = (type: string) =>
  fx.db(R.assocPath(["forms", "back-type"], type));

export const setSubCustomerId = (customerId) => {
  if (!customerId) {
    return sessionStorage.removeItem("sub-customer-id");
  } else {
    return sessionStorage.setItem("sub-customer-id", customerId);
  }
};
