/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  Button,
  FormFooter,
  DateField,
  FormWrapper,
  Input,
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
import { SubitemFormFooter } from "./SubitemFormFooter";
import {
  makeBind,
  makeBindDate,
  makeBindFile,
  makeValidator,
} from "forms/helpers";
import { FileInput } from "../../../components/FileInput";
import { getDocumentListByChildId } from "vessels/selectors";
import { vesselEvent } from "vessels/events";

const formName = "survey";
const formTitle = "Survey";
export default component(
  "SurveyForm",
  createSub({
    formId: R.always("survey"),
    form: makeFormSelector("survey"),
    getRouteId,
    getFormMode,
    documents: getDocumentListByChildId,
    validation: getFormValidation,
  }),
  ({ formMode, routeId, formId, form, dispatch, documents, validation }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });
    const document = !documents
      ? null
      : R.find(R.propEq("docType", "survey"))(documents);
    return (
      <FormWrapper>
        <Stack
          spacing={16}
          justifyContent={"center"}
          marginTop={12}
          paddingBottom={240}
        >
          <AddEditFormTitle formId={formId} form={form}>
            {formTitle}
          </AddEditFormTitle>
          <Stack spacing={8}>
            <Input
              identifier={`${formId}-name`}
              label={`${formTitle} Name`}
              placeholder={`Enter ${(formTitle || "").toLowerCase()} name...`}
              secondaryLabel={"Required"}
              {...bind("name")}
              {...validator("name", "required")}
            />
            <FileInput
              {...bindFile("attachment")}
              original={document}
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
                {...validator("completed_date", "date")}
                {...bindDate("completed_date")}
              />
            </SimpleGrid>
            <Textarea
              identifier={"notes"}
              label={"Description"}
              placeholder={"Enter any notes here..."}
              {...bind("notes")}
            />
          </Stack>
        </Stack>
        <SubitemFormFooter form={form} />
      </FormWrapper>
    );
  }
);
