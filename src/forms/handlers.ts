import { EventTuple, fx, regEventFx } from "../store";
import { formEvt } from "./events";
import * as R from "ramda";
import { getForms } from "./selectors";
import { failure, success } from "../api/util";
import { CrewDetails } from "../../gen/ts-node/model/crewDetails";
import { apiEventName } from "../api";
import { crewEvent } from "../crew/events";
import { FormId } from "./types";
import { routeEvent, routeIds } from "../routes/events";
import {
  deSelectItemFx,
  selectItemFx,
  setBackPageType,
  setFormValidation,
  setShowAlertModalFx,
  setShowPassword,
  setShowRestPwdFormFx,
  setSubCustomerId,
} from "./helpers";

regEventFx(formEvt.SET_VALUE, (_, { path, value }) => {
  return [fx.db(R.assocPath(R.prepend("forms", path), value))];
});

regEventFx(formEvt.CLEAR_FORM, (_, formName: FormId) => {
  return [fx.db(R.dissocPath(["forms", formName]))];
});

export type CrewForm = CrewDetails & {
  medicalCertImage: { name: string; type: string; file: File };
  firstAidCertImage: { name: string; type: string; file: File };
};

export const makeRegFormSubmitHandler = <FormIds>(
  regEventFx,
  formIds?: FormIds
) => {
  return ([formId, formMode], handlerFn) => {
    if (!formId || !formMode) {
      throw new Error("regFormSubmitHandler: formId and formMode are required");
    }
    regEventFx(`form-handler/${formId}/${formMode}`, (allFx, eventArgs) => {
      const form = R.propOr({}, formId, getForms(allFx.db));
      return handlerFn({ ...allFx, form }, eventArgs);
    });
  };
};

export const regFormSubmitHandler = makeRegFormSubmitHandler(regEventFx);

regEventFx(
  success(apiEventName(["crew", "create", "one"]) as any) as any,
  ({ db }, res: CrewDetails) => {
    const crewId = res.id;
    const form = getForms(db)["crew"];
    return [
      fx.db(R.assocPath(["data", "crews", crewId], res)),
      fx.api(["crew-document", "create", "one"], form.medicalCertImage),
    ];
  }
);
// const saveAPIResponse = ([subj,verb,quantifier]:[APISubj,APIVerb,APIQuantifier])=>{
//   return (res)=> {
//     if (quantifier==='one') {
//       return [fx.dispatch('api/save-response',
//         R.assocPath(['data',subj,subj.id],)
//     }
//     return ['api/save-response', [{ res, path:['data',subj,res.id],
//       value:res}]]
//   }
//
//
// }
// regEventFx('api/save-response',(_,{res,path,value})=>{
//   return [fx.db(R.assoc(path,value))]
// })

regEventFx(success("form/crew-create"), ({ db }, res: CrewDetails) => {
  const form = getForms(db)["crew"];

  const uploadMedicalCert = [
    crewEvent.UPLOAD_MEDICAL_CERT_IMAGE,
    { medicalCertImage: R.path(["medicalCertImage"], form) },
  ] as EventTuple;

  const uploadFirstAidCert = [
    crewEvent.UPLOAD_FIRST_AID_CERT_IMAGE,
    { crewId: res.id, medicalCertImage: R.path(["firstAidCertImage"], form) },
  ] as EventTuple;

  return [
    fx.dispatch(routeEvent.NAV_TO, [routeIds.CREW_LIST]),
    // fx.api(
    //   ['crew-document', 'create', 'one'],
    //   {} as APITypes['crew-document']['create']['one']
    // ),
    // fx.dispatch(crewEvent.UPLOAD_MEDICAL_CERT_IMAGE, {
    //   medicalCertImage: R.path(['medicalCertImage'], form),
    // }),
    // fx.dispatch(crewEvent.UPLOAD_FIRST_AID_CERT_IMAGE, {
    //   crewId: res.id,
    //   medicalCertImage: R.path(['firstAidCertImage'], form),
    // }),
  ];
});

regEventFx(failure("form/crew-create"), ({ db }, res: CrewDetails) => {
  const form = getForms(db)["crew"];
  console.log(res);
});

regEventFx(formEvt.SUBMIT_FORM, (_, { formId, formMode, form }) => {
  console.log("form submitted", formId, formMode);
  return [
    fx.dispatch(`form-handler/${formId}/${formMode}` as any, {
      formId,
      formMode,
      form,
    }),
  ];
  // return [fx.db(R.assocPath(R.prepend('forms', path), value))];
});

regEventFx(formEvt.SHOW_PASSWORD, (_, key) => {
  return [setShowPassword(key, true)];
});
regEventFx(formEvt.HIDE_PASSWORD, (_, key) => {
  return [setShowPassword(key, false)];
});
regEventFx(formEvt.SHOW_ALERT_MODAL, (_) => {
  return [setShowAlertModalFx(true)];
});
regEventFx(formEvt.HIDE_ALERT_MODAL, (_) => {
  return [setShowAlertModalFx(false)];
});

regEventFx(formEvt.SELECT_ITEM, (_, { type, value }) => {
  return [selectItemFx(type, value)];
});
regEventFx(formEvt.DESELECT_ITEM, (_, { type }) => {
  return [deSelectItemFx(type)];
});

regEventFx(formEvt.SHOW_PWD_RESET_FORM, (_) => {
  return [setShowRestPwdFormFx(true)];
});
regEventFx(formEvt.HIDE_PWD_RESET_FORM, (_) => {
  return [setShowRestPwdFormFx(false)];
});
regEventFx(formEvt.RESET_VALIDATION, (_, { field = null }) => {
  if (!field) return [fx.db(R.dissoc("form-validation"))];
  else return [fx.db(R.dissocPath(["form-validation", field]))];
});
regEventFx(formEvt.SET_VALIDATION, (_, { result }) => {
  return [setFormValidation(result)];
});
regEventFx(formEvt.SET_BACK_PAGE_TYPE, (_, { type }) => {
  return [setBackPageType(type)];
});
regEventFx(formEvt.SET_SUB_CUSTOMER_ID, (_, { id }) => {
  setSubCustomerId(id);
  return [fx.db(R.dissocPath(["data", "vessel"]))];
});
regEventFx(formEvt.SET_PAGE_SIZE, (_, { page, count }) => {
  return [fx.db(R.assocPath(["pagination", page, "page-size"], count))];
});
regEventFx(formEvt.SET_CURRENT_PAGE, (_, { page, num }) => {
  return [fx.db(R.assocPath(["pagination", page, "current"], num))];
});
regEventFx(formEvt.SET_CATEGORY_FILTER, (_, { page, category }) => {
  return [fx.db(R.assocPath(["category-filter", page], category))];
});
