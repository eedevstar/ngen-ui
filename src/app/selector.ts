import { derive } from "framework-x";
import * as R from "ramda";

export const getData = R.path(["data"]);
export const getInitializeStatus = R.pathOr("false", [
  "app",
  "initialize-status",
]);
