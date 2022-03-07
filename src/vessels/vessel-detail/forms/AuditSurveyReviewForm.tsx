/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  Button,
  FormFooter,
  FormWrapper,
  Input,
  DateField,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "components";
import * as R from "ramda";
import { component, createSub } from "framework-x";
import { routeEvent, routeIds } from "routes/events";
import { formEvt } from "forms/events";
import {
  getFormMode,
  getFormValidation,
  makeFormSelector,
} from "../../../forms/selectors";
import { AddEditFormTitle } from "./AddEditFormTitle";
import { getRouteId } from "../../../routes/selectors";
import {
  getVesselSubEntityLabel,
  getVesselSubEntityName,
} from "vessels/selectors";
import { SubitemFormFooter } from "./SubitemFormFooter";
import {
  makeBind,
  makeBindDate,
  makeBindFile,
  makeValidator,
} from "forms/helpers";
import { FileInput } from "../../../components/FileInput";
import { vesselEvent } from "vessels/events";

const formName = "audit";
const formTitle = "Audit";
export default component(
  "AuditSurveyReviewForm",
  createSub({
    formId: R.always("audit"),
    form: makeFormSelector(formName),
    getRouteId,
    entityName: getVesselSubEntityName,
    entityLabel: getVesselSubEntityLabel,
    getFormMode,
    validation: getFormValidation,
  }),
  ({ formMode, routeId, formId, form, entityLabel, validation, dispatch }) => {
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });
    return (
      <FormWrapper>
        <Stack
          spacing={16}
          justifyContent={"center"}
          marginTop={12}
          paddingBottom={240}
        >
          <AddEditFormTitle>{entityLabel}</AddEditFormTitle>
          <Stack spacing={8}>
            <Input
              identifier={`${formId}-name`}
              label={`${entityLabel} Name`}
              placeholder={`Enter ${(entityLabel || "").toLowerCase()} name...`}
              secondaryLabel={"Required"}
              {...bind("name")}
            />
            <FileInput
              {...bindFile("attachment")}
              downloadEvent={vesselEvent.DOWNLOAD_DOCUMENT}
            />
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                label={"Due Date"}
                identifier={"due-date"}
                {...bindDate("due_date")}
                {...validator("due_date", "date")}
              />
              <DateField
                label={"Date Completed"}
                identifier={"completed-date"}
                {...bindDate("complete_date")}
                {...validator("complete_date", "date")}
              />
            </SimpleGrid>
            <Textarea
              identifier={"notes"}
              label={"Notes"}
              placeholder={"Enter any notes here..."}
              {...bind("description")}
            />
          </Stack>
        </Stack>

        <SubitemFormFooter form={form} />
      </FormWrapper>
    );
  }
);
