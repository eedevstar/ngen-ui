import assoc from "ramda/es/assoc";
import dissoc from "ramda/es/dissoc";
import pick from "ramda/es/pick";
import { readTokenInfo } from "./auth/handlers";
import * as R from "ramda";
import { updateIn } from "./util";

const keys = [
  "body",
  "bodyUsed",
  "ok",
  "status",
  "statusText",
  "headers",
  "redirected",
  "url",
  "type",
];

export const makeFetchFx = ({
  dispatch,
  fetch,
  withAuth,
  apiBasePath,
  isDownload,
}: {
  dispatch: Function;
  fetch: Function;
  withAuth?: boolean;
  apiBasePath?: string;
  isDownload?: boolean;
}) => {
  return (
    env,
    [urlOrReq, successEventOrEventVector, failureEventOrEventVector]
  ) => {
    let isVector = { success: true, failure: true };
    let successEventName = successEventOrEventVector;
    let failureEventName = failureEventOrEventVector;
    if (typeof successEventOrEventVector === "string") {
      isVector.success = false;
    } else {
      successEventName = successEventOrEventVector[0];
    }
    if (typeof failureEventOrEventVector === "string") {
      isVector.failure = false;
    } else {
      failureEventName = failureEventOrEventVector[0];
    }
    (async () => {
      try {
        let rawReq =
          typeof urlOrReq === "string" ? { url: urlOrReq } : urlOrReq;

        if (withAuth) {
          console.log("We have a raw api request", urlOrReq, apiBasePath);
          const tokenInfo = readTokenInfo();
          if (!tokenInfo) {
            console.warn(
              "Attempted to access authorized route without a token."
            );
            return;
          }
          rawReq = R.pipe(
            updateIn(["url"], (url) => `${apiBasePath}${url}`),
            R.assocPath(
              ["headers", "authorization"],
              `Bearer ${tokenInfo.access_token}`
            ),
            R.assocPath(["headers", "content-type"], "application/json")
          )(rawReq);
        }

        const req = new Request(rawReq.url, dissoc("url", rawReq));

        const res = await fetch(req);
        const data = pick(keys, res);
        if (isDownload != true) {
          const json = await res
            .json()
            .catch((e) => console.error("error .json()ing", e));

          if (res.ok) {
            dispatch(
              successEventName,
              isVector.success
                ? {
                    res: assoc("json", json, data),
                    args: successEventOrEventVector[1],
                  }
                : assoc("json", json, data)
            );
          } else {
            dispatch(
              failureEventName,
              isVector.failure
                ? {
                    res: assoc("json", json, data),
                    args: failureEventOrEventVector[1],
                  }
                : assoc("json", json, data)
            );
          }
        } else {
          const blob = await res
            .blob()
            .catch((e) => console.error("error .blob()ing", e));
          if (res.ok) {
            dispatch(
              successEventName,
              isVector.success
                ? {
                    res: assoc("blob", blob, data),
                    args: successEventOrEventVector[1],
                  }
                : assoc("blob", blob, data)
            );
          } else {
            dispatch(
              failureEventName,
              isVector.failure
                ? {
                    res: assoc("blob", blob, data),
                    args: failureEventOrEventVector[1],
                  }
                : assoc("blob", blob, data)
            );
          }
        }
      } catch (e) {
        dispatch(
          failureEventName,
          isVector.failure ? { res: e, args: failureEventOrEventVector[1] } : e
        );
      }
    })();
  };
};
