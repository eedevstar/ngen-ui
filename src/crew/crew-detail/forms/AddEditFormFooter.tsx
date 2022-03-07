/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Button, FormFooter } from "../../../components";
import { dispatch } from "../../../store";
import { routeEvent, routeIds } from "../../../routes/events";
import { getFormMode, getIsSubmitting } from "../../../forms/selectors";
import { getRouteId } from "../../../routes/selectors";
import {
  getCrewSubEntityDetailRoute,
  getCrewSubEntityName,
  getSelectedCrewId,
} from "../../selectors";
import { component, createSub } from "framework-x";
import { formEvt } from "../../../forms/events";
import { isFromEditPage } from "../../../util";

export const AddEditFormFooter = component(
  "AddEditFormFooter",
  createSub({
    entityName: getCrewSubEntityName,
    detailRoute: getCrewSubEntityDetailRoute,
    getFormMode,
    getRouteId,
    isSubmitting: getIsSubmitting,
  }),
  ({ entityName, formMode, routeId, detailRoute, isSubmitting, form }) => {
    if (formMode === "read") {
      return (
        <FormFooter
          leftButtonLabel={"Close"}
          leftButtonOnClick={() => {
            dispatch(routeEvent.BACK);
          }}
        />
      );
    }
    return (
      <FormFooter
        leftButtonLabel={"Cancel"}
        leftButtonOnClick={() => {
          dispatch(routeEvent.BACK);
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
