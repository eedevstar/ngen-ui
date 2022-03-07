import { getSubCustomerId } from "forms/selectors";
import { derive } from "framework-x";
import * as R from "ramda";
import { getCurrentUser } from "users/selectors";
import { isCustomerAdmin } from "../util";

export const getData = R.path(["data"]);
export const getCustomerList = derive(getData, R.pathOr({}, ["customer"]));
export const getCustomers = derive(getCustomerList, R.values);
export const getCustomer = (id) =>
  derive(getCustomerList, (customerList) => R.prop(id, customerList));
export const getCurrentCustomer = derive(
  getCustomerList,
  getCurrentUser,
  (customerList, currentUser) => {
    const subCustomerId = getSubCustomerId();
    return R.prop(
      isCustomerAdmin(currentUser) && subCustomerId
        ? subCustomerId
        : currentUser.customerId,
      customerList
    );
  }
);
