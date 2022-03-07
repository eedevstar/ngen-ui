import { regEventFx } from "store";
import { keys as getKeys } from "ramda";

export function uploadToS3(presignedInfo: any, file: Blob) {
  let formData = new FormData();
  getKeys(presignedInfo.fields).forEach((k) => {
    formData.append(k, presignedInfo.fields[k]);
  });
  formData.append("file", file);
  return [
    "fetch",
    [
      {
        url: presignedInfo.url,
        body: formData,
        method: "POST",
      },
      "api/upload-to-s3-success",
      "api/upload-to-s3-failure",
    ],
  ];
}
regEventFx("api/upload-to-s3-success", ({ db }, rsp) => {});
regEventFx("api/upload-to-s3-error", ({ db }, rsp) => {});
