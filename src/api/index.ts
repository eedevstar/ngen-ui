import * as R from "ramda";
import { API_ENDPOINT } from "config";
import { fx, regEventFx, regFx } from "../store";
import { regResultFx, success, failure } from "./util";
import {
  Document,
  CrewDetails,
  CrewDetailsPagination,
  VesselPagination,
  DocumentPagination,
  Vessel,
  UserPagination,
  TagPagination,
  Tag,
  VesselOverdue,
  CrewOverdue,
  UserSetting,
} from "../../gen/ts/models";
import {
  CrewApi,
  DocumentApi,
  GetCrewDetailsListRequest,
  GetCrewItemRequest,
  GetCrewMemberDocumentListRequest,
  PostCrewListRequest,
  PostCrewMemberDocumentListRequest,
  PostVesselListRequest,
  PutCrewItemRequest,
  PostDocumentListRequest,
  GetDocumentListRequest,
  UserApi,
  VesselApi,
  CustomerApi,
  PostUserListRequest,
  TagApi,
  PostTagRequest,
  GetTagListRequest,
  PutTagRequest,
  OverdueApi,
  GetOverdueRequest,
  GetCrewOverdueRequest,
  CrewOverdueApi,
  GetUserSettingRequest,
  UserSettingApi,
} from "../../gen/ts/apis";
import { Configuration, ConfigurationParameters } from "../../gen/ts";
import { updateIn } from "../util";
import { readTokenInfo } from "../auth/handlers";

export type APITopic =
  | "crew"
  | "document"
  | "vessel"
  | "user"
  | "usersetting"
  | "customer"
  | "tag"
  | "overdue"
  | "crewoverdue";
export type APISubj =
  | "crew"
  | "crew-document"
  | "vessel-document"
  | "vessel"
  | "user"
  | "usersetting"
  | "task"
  | "vesselcert"
  | "action"
  | "drill"
  | "audit"
  | "health"
  | "survey"
  | "review"
  | "training"
  | "part"
  | "requests"
  | "safetyequipment"
  | "customer"
  | "crewcert"
  | "overdue"
  | "crewoverdue"
  | "tag";

const API_SUBJ: Readonly<APISubj[]> = [
  "crew",
  "crew-document",
  "vessel-document",
  "vessel",
  "user",
  "usersetting",
  "vesselcert",
  "action",
  "drill",
  "audit",
  "health",
  "survey",
  "review",
  "training",
  "safetyequipment",
  "requests",
  "part",
  "crewcert",
  "customer",
  "overdue",
  "crewoverdue",
] as const;

export type APIVerb = "create" | "update" | "get" | "delete";

const API_VERB: Readonly<APIVerb[]> = [
  "create",
  "update",
  "get",
  "delete",
] as const;

export type APIQuantifier = "one" | "many" | "all";

const API_QUANTIFIER: Readonly<APIQuantifier[]> = [
  "one",
  "many",
  "all",
] as const;

export type APITuple = [APISubj, APIVerb, APIQuantifier];

type CrewAPITypes = {
  get: {
    all: {
      args: GetCrewDetailsListRequest;
      returnType: CrewDetailsPagination[];
    };
    one: {
      args: GetCrewItemRequest;
      returnType: CrewDetails;
    };
  };
  create: {
    one: {
      // swagger codegen seems to have given this a weird name
      args: PostCrewListRequest;
      returnType: CrewDetails;
    };
  };
  update: {
    one: {
      args: PutCrewItemRequest;
      returnType: PutCrewItemRequest;
    };
  };
};

type CrewDocumentAPITypes = {
  get: {
    one: {
      args: GetCrewMemberDocumentListRequest;
      returnType: DocumentPagination;
    };
  };
  create: {
    one: {
      args: PostCrewMemberDocumentListRequest;
      returnType: Document;
    };
  };
};

type VesselAPITypes = {
  create: {
    one: {
      args: PostVesselListRequest;
      returnType: Vessel;
    };
  };
};
type VesselDocumentAPITypes = {
  get: {
    one: {
      args: GetDocumentListRequest;
      returnType: DocumentPagination;
    };
  };
  create: {
    one: {
      args: PostDocumentListRequest;
      returnType: Document;
    };
  };
};
type UserAPITypes = {
  create: {
    one: {
      args: PostUserListRequest;
      returnType: UserPagination;
    };
  };
};
type TagAPITypes = {
  get: {
    many: {
      args: GetTagListRequest;
      returnType: TagPagination;
    };
  };
  create: {
    one: {
      args: PostTagRequest;
      returnType: Tag;
    };
  };
  put: {
    one: {
      args: PutTagRequest;
      returnType: Tag;
    };
  };
};
type OverdueAPITypes = {
  get: {
    one: {
      args: GetOverdueRequest;
      returnType: VesselOverdue;
    };
  };
};
type CrewOverdueAPITypes = {
  get: {
    one: {
      args: GetCrewOverdueRequest;
      returnType: CrewOverdue;
    };
  };
};
type UserSettingApiTypes = {
  get: {
    one: {
      args: GetUserSettingRequest;
      returnType: UserSetting;
    };
  };
};

export type APITypes = {
  crew: CrewAPITypes;
  "crew-document": CrewDocumentAPITypes;
  vessel: VesselAPITypes;
  "vessel-document": VesselDocumentAPITypes;
  user: UserAPITypes;
  usersetting: UserSettingAPITypes;
  tag: TagAPITypes;
  overdue: OverdueAPITypes;
  crewoverdue: CrewOverdueAPITypes;
};

export const makeRequestPayload = {
  crew: {
    get: {
      all: (): APITypes["crew"]["get"]["all"]["args"] => ({
        perPage: 1000,
      }),
      one: ({ id }): APITypes["crew"]["get"]["one"]["args"] => ({
        id,
      }),
    },
    create: {
      one: (args: CrewDetails): APITypes["crew"]["create"]["one"]["args"] => ({
        payload: args,
      }),
    },
  },
  "crew-document": {
    get: {
      one: ({ id }): APITypes["crew-document"]["get"]["one"]["args"] => ({
        objId: id,
      }),
    },
    create: {
      one: ({
        crewId,
        docType,
        file,
      }): APITypes["crew-document"]["create"]["one"]["args"] => ({
        crewId,
        docType,
        file,
      }),
    },
  },
} as const;

const makeAPIClients = (
  config: ConfigurationParameters
): { [K in APITopic]: any } => {
  const conf = new Configuration(config);

  const crew = new CrewApi(conf);
  const document = new DocumentApi(conf);
  const vessel = new VesselApi(conf);
  const user = new UserApi(conf);
  const usersetting = new UserSettingApi(conf);
  const customer = new CustomerApi(conf);
  const tag = new TagApi(conf);
  const overdue = new OverdueApi(conf);
  const crewoverdue = new CrewOverdueApi(conf);

  return {
    crew,
    document,
    vessel,
    user,
    usersetting,
    customer,
    tag,
    overdue,
    crewoverdue,
  };
};

type SVOMethod<
  S = APISubj,
  V extends string = APIVerb,
  O extends string = APIQuantifier
> = {
  crew: { [K in V]: { [K in O]: keyof CrewApi } };
  "crew-document": { [K in V]: { [K in O]: keyof DocumentApi } };
  vessel: { [K in V]: { [K in O]: keyof VesselApi } };
  "vessel-document": { [K in V]: { [K in O]: keyof DocumentApi } };
  user: { [K in V]: { [K in O]: keyof UserApi } };
  usersetting: { [K in V]: { [K in O]: keyof UserSettingApi } };
  tag: { [K in V]: { [K in O]: keyof TagApi } };
  overdue: { [K in V]: { [K in O]: keyof OverdueApi } };
  crewoverdue: { [K in V]: { [K in O]: keyof CrewOverdueApi } };
};

/**
 * Use this for exceptions only
 */
const apiVerbToApiClientMethodNameMap: {
  [K in APISubj]: Partial<SVOMethod[K]>;
} = {
  crew: {
    get: {
      many: "getCrewDetailsList",
    },
  } as SVOMethod["crew"],
  "crew-document": {
    create: {
      one: "postCrewMemberDocumentList",
    },
    delete: {
      one: "deleteCrewMemberDocumentItem",
    },
    get: {
      many: "getCrewMemberDocumentList",
    },
  } as SVOMethod["crew-document"],
  "vessel-document": {
    create: {
      one: "postDocumentList",
    },
    delete: {
      one: "deleteDocumentItem",
    },
    get: {
      many: "getDocumentList",
    },
  } as SVOMethod["vessel-document"],
  user: {
    delete: {
      one: "deleteUserItemRaw",
    },
  },
  vessel: {
    delete: {
      one: "deleteVesselItemRaw",
    },
  },
  vesselcert: {
    update: {
      one: "putCertificateItem",
    },
    create: {
      one: "postCertificateList",
    },
    delete: {
      one: "deleteCertificateItemRaw",
    },
  },
  action: {
    update: {
      one: "putActionItem",
    },
    create: {
      one: "postActionList",
    },
    delete: {
      one: "deleteActionItemRaw",
    },
  },
  audit: {
    update: {
      one: "putAuditItem",
    },
    create: {
      one: "postAuditList",
    },
    delete: {
      one: "deleteAuditItemRaw",
    },
  },
  survey: {
    update: {
      one: "putSurveyItem",
    },
    create: {
      one: "postSurveyList",
    },
    delete: {
      one: "deleteSurveyItemRaw",
    },
  },
  review: {
    update: {
      one: "putReviewItem",
    },
    create: {
      one: "postReviewList",
    },
    delete: {
      one: "deleteReviewItemRaw",
    },
  },
  training: {
    update: {
      one: "putTrainingItem",
    },
    create: {
      one: "postTrainingList",
    },
    delete: {
      one: "deleteTrainingItemRaw",
    },
  },
  requests: {
    update: {
      one: "putRepairItem",
    },
    create: {
      one: "postRepairList",
    },
    delete: {
      one: "deleteRepairItemRaw",
    },
  },
  part: {
    update: {
      one: "putPartItem",
    },
    create: {
      one: "postPartList",
    },
    delete: {
      one: "deletePartItemRaw",
    },
  },
  maintenance: {
    update: {
      one: "putMaintenanceItem",
    },
    create: {
      one: "postMaintenanceList",
    },
    delete: {
      one: "deleteMaintenanceItemRaw",
    },
  },
  drill: {
    update: {
      one: "putDrillItem",
    },
    create: {
      one: "postDrillList",
    },
    delete: {
      one: "deleteDrillItemRaw",
    },
  },
  safetyequipment: {
    update: {
      one: "putSafetyEquipmentItem",
    },
    create: {
      one: "postSafetyEquipmentList",
    },
    delete: {
      one: "deleteSafetyEquipmentItemRaw",
    },
  },
  health: {
    update: {
      one: "putEquipmentItem",
    },
    create: {
      one: "postEquipmentList",
    },
    delete: {
      one: "deleteEquipmentItemRaw",
    },
  },
  crewcert: {
    get: {
      many: "getCrewCert",
      one: "getCrewCertItem",
    },
    update: {
      one: "putCrewCertItem",
    },
    create: {
      one: "postCrewCert",
    },
    delete: {
      one: "deleteCrewCertItemRaw",
    },
  },
  customer: {
    get: {
      many: "getCustomerList",
    },
    delete: {
      one: "deleteCustomerRaw",
    },
  },
  tag: {
    get: {
      many: "getTagList",
    },
    create: {
      one: "postTag",
    },
    update: {
      one: "putTag",
    },
  },
  overdue: {
    get: {
      one: "getOverdue",
    },
  },
  crewoverdue: {
    get: {
      one: "getCrewOverdue",
    },
  },
  usersetting: {
    get: {
      one: "getUserSetting",
    },
    update: {
      one: "putUserSetting",
    },
  },
} as const;

const verbsToMethods = {
  get: "get",
  create: "post",
  update: "put",
};

const apiVerbToApiClientMethodName = ([subj, verb, quantifier]: APITuple) => {
  const guess = () => {
    const method = verbsToMethods[verb];
    const entity = subj[0].toUpperCase() + subj.substring(1);
    const suffix = verb === "create" || quantifier === "many" ? "List" : "Item";
    return `${method}${entity}${suffix}`;
  };
  return R.pathOr(
    guess(),
    [subj, verb, quantifier],
    apiVerbToApiClientMethodNameMap
  );
};

export const apiEventName = ([subj, verb, quantifier]: APITuple) =>
  `api/${verb}-${quantifier}-${subj}`;

const makeRegAPIResponseEventFx = (regEventFx) => {
  return (
    [subj, verb, quantifier]: Readonly<APITuple>,
    { onSuccess, onFailure }
  ) => {
    // console.log('auto', [subj,verb,quantifier], '->', apiEventName([subj, verb, quantifier]), onSuccess, onFailure)
    regEventFx(
      success(apiEventName([subj, verb, quantifier]) as any),
      (a, b) => {
        return onSuccess(a, b);
      }
    );
    regEventFx(
      failure(apiEventName([subj, verb, quantifier]) as any),
      (a, b) => {
        return onFailure(a, b);
      }
    );
  };
};

const regAPIResponseEventFx = makeRegAPIResponseEventFx(regEventFx);

/** Provide automatic success handlers */
for (let subj of API_SUBJ) {
  for (let verb of API_VERB as Exclude<APIVerb, "delete">[]) {
    for (let quantifier of API_QUANTIFIER) {
      const onSuccess = (() => {
        switch (quantifier) {
          case "many":
          case "all":
            switch (verb) {
              case "create":
              case "get":
              case "update":
                return (_, res) => {
                  return [
                    fx.db(
                      updateIn(
                        ["data", subj],
                        // @ts-ignore
                        (m = {}) =>
                          R.merge(m, R.indexBy(R.prop("id"), res.items))
                      )
                    ),
                  ];
                };
              default:
                return;
            }
          case "one":
            switch (verb) {
              case "create":
              case "get":
              case "update":
                return (_, res) => {
                  if (subj == "crew-document" || subj == "vessel-document") {
                    return [];
                  }
                  return [
                    !res.id
                      ? fx.db(R.assocPath(["data", subj], res))
                      : fx.db(R.assocPath(["data", subj, res.id], res)),
                    ...(verb === "get" ? [] : [fx.toast({ title: "Saved." })]),
                  ];
                };
              case "delete":
                return (_, res) => {
                  return [fx.toast({ title: "Deleted." })];
                };
            }
        }
      })();
      regAPIResponseEventFx([subj, verb, quantifier], {
        onSuccess,
        onFailure: (_, res) => {
          // const title = `${res.message || "API Error"}`;
          const title = "API Error";
          const description = res.errors
            ? R.join("<br />", R.values(res.errors))
            : `${
                res.statusText || "Internal processing error."
              } (${verb} ${quantifier} ${subj})`;
          return [fx.toast({ status: "error", title: title, description })];
        },
      });
    }
  }
}

const subjToApiClient = (subj: string) => {
  if (["crew-document", "vessel-document"].includes(subj)) return "document";
  if (["crew", "crewcert"].includes(subj)) return "crew";
  if (["customer"].includes(subj)) return "customer";
  if (["user"].includes(subj)) return "user";
  if (["tag"].includes(subj)) return "tag";
  if (["overdue"].includes(subj)) return "overdue";
  if (["crewoverdue"].includes(subj)) return "crewoverdue";
  if (["usersetting"].includes(subj)) return "usersetting";
  return "vessel";
};
export const regAPIFx = (dispatch, rawConfig: ConfigurationParameters) => {
  const config = R.assoc(
    "apiKey",
    () => {
      const tokenInfo = readTokenInfo();
      if (tokenInfo) {
        return `Bearer ${tokenInfo.access_token}`;
      }
    },
    rawConfig
  );
  const apiClients = makeAPIClients(config);

  const apiFx = async (env, args) => {
    const token = readTokenInfo();
    if (!token) {
      // window.location = '/login'
      return;
    }

    const [subj, verb, quantifier]: APITuple = args[0];
    const payload = args[1];
    // const continuationEvent = args[2];
    const { onSuccess, onFailure } = args[2] || {};

    const apiClient = apiClients[subjToApiClient(subj)];

    const apiClientMethodName = apiVerbToApiClientMethodName([
      subj,
      verb,
      quantifier,
    ]);
    console.log(
      "Managed API call starting:",
      apiClient,
      [subj, verb, quantifier],
      "->",
      apiClientMethodName
    );
    if (!apiClient[apiClientMethodName]) {
      throw new Error(
        `Could not find method ${subj}.${apiClientMethodName} (${subj} ${verb} ${quantifier})`
      );
    }
    const method = apiClient[apiClientMethodName].bind(apiClient);
    let res = null;
    try {
      res = await method(payload);
    } catch (e) {
      console.error("API error:", e);
      const error = await e.json();
      dispatch(failure(apiEventName([subj, verb, quantifier]) as any), error);
      if (onFailure) {
        dispatch(onFailure);
      }
    }
    if (res) {
      dispatch(success(apiEventName([subj, verb, quantifier]) as any), res);
    }
    if (onSuccess) {
      //add request data
      if (res) res["payload"] = payload;
      dispatch(onSuccess, res);
    }
  };
  regFx("api", apiFx);
};
