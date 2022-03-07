import { dispatch, regFx } from "./store";
import { makeFetchFx } from "./fetch";
import { regAPIFx } from "./api";
import { API_BASE_PATH } from "config";
import { Events } from "./events";
import { generateStateHook, generateEventHook } from "./util";

regFx("fetch", makeFetchFx({ dispatch, fetch: window.fetch }));
regFx(
  "apiRaw",
  makeFetchFx({
    dispatch,
    fetch: window.fetch,
    withAuth: true,
    apiBasePath: API_BASE_PATH,
    isDownload: false,
  })
);
regFx(
  "apiRawFile",
  makeFetchFx({
    dispatch,
    fetch: window.fetch,
    withAuth: true,
    apiBasePath: API_BASE_PATH,
    isDownload: true,
  })
);
regFx("dispatchAsync", (_, [type, payload]: [keyof Events, any]) =>
  setTimeout(() => dispatch(type, payload), 1)
);

regAPIFx(dispatch, {
  basePath: API_BASE_PATH,
  // headers: {
  //   Authorization:
  //     'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1ZjVlZmZhZWZlNDcxODU0ZTdmMTZkODYiLCJleHAiOjE2MDI1NDYzODMsImlhdCI6MTYwMjU0Mjc4M30.tthb62_okueAeDiy5j6VeAH1Y8fIZrUFZWMAZH6hIN0',
  //   // 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1ZjVlZmZhZWZlNDcxODU0ZTdmMTZkODYiLCJleHAiOjE2MDI1NDMwMzUsImlhdCI6MTYwMjUzOTQzNX0.JxAgXTdB2fPCCdQDESrvmKFLsB5OliotCqxZgZDMt5I',
  // },
});

regFx("write-storage", (_, [key, value]) => {
  localStorage.setItem(key, value);
});

const jobs = {};
regFx("schedule", (_, { jobName, delay, fn }) => {
  if (jobs[jobName]) {
    clearTimeout(jobs[jobName]);
  }
  jobs[jobName] = setTimeout(fn, delay);
});
regFx("schedule-cancel", (_, { jobName }) => {
  if (jobs[jobName]) {
    clearTimeout(jobs[jobName]);
  }
});
regFx("noop", () => {});

type ToastMessage = {
  title: string;
  description?: string;
};
export const [useToastFx, sendToast] = generateEventHook<ToastMessage>();
regFx("toast", (_, msg: ToastMessage) => {
  console.log("should output toaster", msg);
  sendToast(msg);
});
