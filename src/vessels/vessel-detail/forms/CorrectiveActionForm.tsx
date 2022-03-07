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

const formName = "action";
const formTitle = "Corrective Action";
export default component(
  "ActionForm",
  createSub({
    formId: R.always("action"),
    form: makeFormSelector("action"),
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
      : R.find(R.propEq("docType", "action"))(documents);
    return (
      <FormWrapper>
        <Stack
          spacing={16}
          justifyContent={"center"}
          marginTop={12}
          paddingBottom={240}
        >
          <AddEditFormTitle formId={formId} form={form} formTitle={formTitle}>
            {formTitle}
          </AddEditFormTitle>
          <Stack spacing={8}>
            <Input
              identifier={"title-action"}
              label={"Title of Action"}
              placeholder={"Enter the title of the action..."}
              secondaryLabel={"Required"}
              {...bind("name")}
              {...validator("name", "required")}
            />
            <SimpleGrid columns={2} spacing={4}>
              <Input
                label={"Document No."}
                placeholder={"Enter the document number..."}
                identifier={"doc-number"}
                {...bind("doc_no")}
              />
              <DateField
                label={"Date Issued"}
                identifier={"date-issued"}
                {...bindDate("date_issued")}
                {...validator("date_issued", "date")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                label={"Deadline To Fix"}
                identifier={"rect-deadline"}
                {...bindDate("fix_by_date")}
                {...validator("fix_by_date", "date")}
              />
              <DateField
                label={"Date Completed"}
                identifier={"date-completed"}
                {...bindDate("date_completed")}
                {...validator("date_completed", "date")}
              />
            </SimpleGrid>
            <FileInput
              {...bindFile("attachment")}
              original={document}
              downloadEvent={vesselEvent.DOWNLOAD_DOCUMENT}
            />

            <Textarea
              identifier={"notes"}
              label={"Notes"}
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
