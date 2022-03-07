import { readTokenInfo } from "auth/handlers";
import { derive } from "framework-x";
import * as R from "ramda";
import jwt_decode from "jwt-decode";

export const getData = R.pathOr({}, ["data"]);
export const getUser = derive(getData, R.path(["user"]));
export const getUsers = derive(getUser, R.values);

export const getCurrentUserId = () => {
  const tokenInfo = readTokenInfo();
  if (!tokenInfo) return null;
  const access = jwt_decode(tokenInfo.access_token);
  const curUID = access["uid"];
  return curUID;
};
export const getCurrentUser = derive(getData, (db) => {
  const curUID = getCurrentUserId();
  return R.pathOr(null, ["user", curUID], db);
});
