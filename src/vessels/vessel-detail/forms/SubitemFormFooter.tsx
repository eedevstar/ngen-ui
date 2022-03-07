/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Button, FormFooter } from "../../../components";
import { dispatch } from "../../../store";
import { routeEvent, routeIds } from "../../../routes/events";
import {
  getBackPageType,
  getFormMode,
  getIsSubmitting,
} from "../../../forms/selectors";
import { getRouteId } from "../../../routes/selectors";
import {
  getSelectedVesselId,
  getSelectedVesselSubItemId,
  getVesselSubEntityName,
  getVesselSubEntityDetailRoute,
} from "../../selectors";
import { component, createSub } from "framework-x";
import { formEvt } from "../../../forms/events";
import { isFromEditPage } from "../../../util";

export const SubitemFormFooter = component(
  "SubitemFormFooter",
  createSub({
    entityName: getVesselSubEntityName,
    detailRoute: getVesselSubEntityDetailRoute,
    backPage: getBackPageType,
    getFormMode,
    getRouteId,
    vesselId: getSelectedVesselId,
    childId: getSelectedVesselSubItemId,
    isSubmitting: getIsSubmitting,
  }),
  ({
    entityName,
    formMode,
    backPage,
    vesselId,
    childId,
    routeId,
    detailRoute,
    isSubmitting,
    form,
  }) => {
    if (formMode === "read") {
      return (
        <FormFooter
          leftButtonLabel={"Close"}
          leftButtonOnClick={() => {
            backPage == "vessel"
              ? dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_DETAIL], {
                  vesselId,
                })
              : dispatch(routeEvent.NAV_TO, [detailRoute]);
          }}
        />
      );
    }
    return (
      <FormFooter
        leftButtonLabel={"Cancel"}
        leftButtonOnClick={() => {
          formMode == "create"
            ? dispatch(routeEvent.NAV_TO, [detailRoute])
            : dispatch(routeEvent.NAV_TO, [
                routeId.replace("/edit", "/detail"),
              ]);
        }}
        leftButtonDisabled={isSubmitting}
        rightButtonLabel={"Confirm"}
        rightButtonDisabled={isSubmitting}
        rightButtonOnClick={() =>
          dispatch(formEvt.SUBMIT_FORM, { formId: entityName, formMode, form })
        }
      />
    );
  }
);
