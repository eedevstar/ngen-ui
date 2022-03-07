import { fx, regEventFx } from "../store";
import { routeIds } from "../routes/events";
import {
  deSelectItemFx,
  onEdit,
  resetFormValidation,
  setProcessingFx,
  setSubmittingFx,
  validateForm,
} from "forms/helpers";
import * as R from "ramda";
import { regFormSubmitHandler } from "forms/handlers";
import { getForms } from "forms/selectors";
import { getCurrentUser, getCurrentUserId } from "users/selectors";
import { isCustomerAdmin } from "../util";
import { formEvt } from "forms/events";
import { getCustomers } from "./selectors";

const validations: Array<{ name: string; rule: string }> = [
  { name: "name", rule: "required" },
  { name: "licensedvessels", rule: "required|number|min:0|max:%max%" },
];

const getMaxVessels = (db, escapeId = null) => {
  let maxVessels = 0;
  const currentUser = getCurrentUser(db);
  const customers = getCustomers(db);
  if (isCustomerAdmin(currentUser)) {
    customers.forEach((c) => {
      if (c.id == currentUser.customerId) {
        maxVessels += c.licensedvessels - c.deployedVessels;
      } else if (c.parentId == currentUser.customerId && c.id != escapeId) {
        maxVessels -= c.licensedvessels;
      }
    });
    maxVessels = Math.max(0, maxVessels);
    return maxVessels;
  } else {
    return 9999;
  }
};

const realizedValidations = (validations, params) => {
  const newValidations = validations.map((row) => {
    R.forEachObjIndexed((v, k) => {
      row.rule = row.rule.replace(`%${k}%`, v);
    }, params);
    return row;
  });
  return newValidations;
};

regEventFx(routeIds.CUSTOMER_LIST, (_) => {
  return [
    deSelectItemFx("customer"),
    resetFormValidation(),
    fx.api(["customer", "get", "many"], { perPage: 1000 }),
  ];
});

regEventFx(routeIds.CUSTOMER_ADD, ({ db }) => {
  return [fx.db(R.assocPath(["forms", "customer"], {}))];
});

regEventFx(routeIds.CUSTOMER_EDIT, onEdit("customer", routeIds.CUSTOMER_LIST));

regFormSubmitHandler(
  ["customer", "edit"],
  ({ db, form }: { db: any; form: any }) => {
    const maxVessels = getMaxVessels(db, form.id);

    const validateResult = validateForm(
      form,
      realizedValidations(validations, { max: maxVessels })
    );
    if (validateResult !== true) {
      return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
    }
    const payload = R.pipe(R.omit(["created"]))(form);
    return [
      setSubmittingFx(true),
      fx.api(["customer", "update", "one"], { id: form.id, payload }),
    ];
  }
);
regFormSubmitHandler(
  ["customer", "create"],
  ({ db, form }: { db: any; form: any }) => {
    const maxVessels = getMaxVessels(db);
    const validateResult = validateForm(
      form,
      realizedValidations(validations, { max: maxVessels })
    );
    if (validateResult !== true) {
      return [fx.dispatch(formEvt.SET_VALIDATION, { result: validateResult })];
    }
    const user = getCurrentUser(db);

    let payload = R.pipe(R.omit(["created"]))(form);
    if (isCustomerAdmin(user)) {
      payload = R.assoc("parentId", user.customerId, payload);
    }
    return [
      setSubmittingFx(true),
      fx.api(["customer", "create", "one"], { id: form.id, payload }),
    ];
  }
);
regEventFx("api/update-one-customer-success", ({ db }, { id }) => {
  const form = getForms(db).customer;
  return [setSubmittingFx(false), fx.route(routeIds.CUSTOMER_LIST, {})];
});

regEventFx("api/create-one-customer-success", ({ db }, { id }) => {
  const form = getForms(db).customer;
  return [setSubmittingFx(false), fx.route(routeIds.CUSTOMER_LIST, {})];
});
regEventFx("api/update-one-customer-failure", ({ db }, { id }) => {
  return [setSubmittingFx(false)];
});
regEventFx("api/create-one-customer-failure", ({ db }, { id }) => {
  return [setSubmittingFx(false)];
});
regEventFx(routeIds.CUSTOMER_DELETE, ({ db }, { id }) => [
  deSelectItemFx("customer"),
  setProcessingFx(id, true),
  fx.api(["customer", "delete", "one"], { id }),
]);
regEventFx("api/delete-one-customer-success", ({ db }, args) => {
  const url = args.raw.url; //delete api url
  const id = R.last(R.split("/", url));
  return [
    setProcessingFx(id, false),
    fx.db(R.dissocPath(["data", "customer", id])),
  ];
});
