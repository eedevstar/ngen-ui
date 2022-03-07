import getUserLocale from "get-user-locale";
import * as R from "ramda";
import moment from "moment";

export type Values<M> = M[keyof M];

export const rename = <
  M extends { [k: string]: any },
  RenameMap extends { [k in keyof M]: string }
>(
  smap: RenameMap,
  m: M
) =>
  Object.entries(m).reduce((a, [k, v]) => {
    a[smap[k] || k] = v;
    return a;
  }, {});

export const updateIn = R.curry((ks, f, m) =>
  R.assocPath(ks, f(R.path(ks, m)), m)
);

export function formatDate(date: string) {
  try {
    let originDate = Date.parse(date);
    let convertedDate = new Date(originDate);
    let convertedMonth = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(convertedDate);
    let convertedDay = convertedDate.getDate();
    let convertedYear = convertedDate.getFullYear();
    let formattedDate = `${convertedMonth} ${convertedDay}, ${convertedYear}`;
    return formattedDate;
  } catch {
    return "";
  }
}

export function explodeDate(date: string) {
  let originDate = Date.parse(date);
  let convertedDate = new Date(originDate);
  return convertedDate;
}

/**
 * Take an an array of fields and call a transformer function on them. Probably there is something like this in
 * ramda already but too lazy to comb through their docs :-)
 */
export const transformFields = R.curry(
  (dateFields: [string], fn: (origValue: any) => any, payload: object) =>
    R.reduce(
      (obj, field) => R.assoc(field, fn(obj[field]), obj),
      payload,
      dateFields
    )
);

export const emptyObj: Readonly<object> = {};
export const emptyArray: ReadonlyArray<any> = [];

export function isFromEditPage() {
  return document.referrer.indexOf("/edit") >= 0;
}

export const UserRoles: { [k: string]: string } = {
  ROOT: "root",
  ADMIN: "admin",
  CUSTOMER_ADMIN: "cu_admin",
  READONLY: "readonly",
};
export const isRoot = (user: any) => {
  return user?.role === UserRoles.ROOT;
};
export const isAdmin = (user: any) => {
  return user?.role === UserRoles.ADMIN;
};
export const isCustomerAdmin = (user: any) => {
  return user?.role === UserRoles.CUSTOMER_ADMIN;
};
export const sortCrew = (list) => {
  const sortFn = R.sortWith([
    R.ascend(R.compose(R.toLower, R.prop("firstname"))),
    R.ascend(R.compose(R.toLower, R.prop("lastname"))),
  ]);
  return sortFn(list);
};

export const getDateFormat = () =>
  getUserLocale() == "en-GB" ? "DD/MM/YYYY" : "MM/DD/YYYY";
export const formatDateForEdit = (value) => {
  const dateFormat = getDateFormat();
  const formatedDate = moment(value, dateFormat, true).format();
  return formatedDate === "Invalid date" ? value : formatedDate;
};

export const PAGINATION_PER_PAGE = 10;

export const sortStringArray = (arr) => {
  const sortBy = R.sortBy(R.compose(R.toLower, R.prop(0)));
  return sortBy(arr);
};
