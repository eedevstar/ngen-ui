/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import {
  CustomSelect,
  FormWrapper,
  Input,
  DateField,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Textarea,
} from "components";
import { Button, Flex } from "components/standalone";
import * as R from "ramda";
import { component, createSub } from "framework-x";
import {
  getSelectOptions,
  makeBind,
  makeBindDate,
  makeBindFile,
  makeBindSelect,
  makeBindSwitch,
  makeValidator,
} from "../../../forms/helpers";
import {
  getFormMode,
  getFormValidation,
  makeFormSelector,
} from "../../../forms/selectors";
import { AddEditFormTitle } from "./AddEditFormTitle";
import { AddEditFormFooter } from "./AddEditFormFooter";
import { FileInput } from "../../../components/FileInput";
import { routeEvent } from "../../../routes/events";
import { getRouteId } from "../../../routes/selectors";
import { getDocumentList } from "crew/selectors";
import { crewEvent } from "crew/events";
import { getUsers } from "users/selectors";

const formName = "crewcert";
const formTitle = "Certificate/Document";
export default component(
  "CertDocForm",
  createSub({
    formId: R.always("crewcert"),
    form: makeFormSelector("crewcert"),
    formMode: getFormMode,
    documents: getDocumentList,
    validation: getFormValidation,
    users: getUsers,
  }),
  ({ formId, form, formMode, dispatch, documents, validation, users }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    // const options = getSelectOptions(tags);
    const validator = makeValidator({ dispatch, form, validation });
    let document = !documents
      ? null
      : R.find(R.propEq("objId", form.id))(documents);

    if (document) {
      document = R.assoc(
        "modifierName",
        R.propOr(
          "",
          "fullname",
          R.find(R.propEq("id", document.uploadedBy))(users)
        ),
        document
      );
    }
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
              identifier={"cert-doc-name"}
              label={`${formTitle} Name`}
              placeholder={`Enter the ${formTitle} name...`}
              secondaryLabel={"Required"}
              {...bind("qualification")}
              {...validator("qualification", "required")}
            />
            <FileInput
              {...bindFile("crew_file")}
              original={document}
              downloadEvent={crewEvent.DOWNLOAD_DOCUMENT}
              showDetail={true}
            />
            <Input
              identifier={"cert_number"}
              label={"Document No."}
              placeholder={"Enter the document number..."}
              {...bind("cert_number")}
            />
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                identifier={"issue-date"}
                label={"Issue Date"}
                {...bindDate("issue_date")}
                {...validator("issue_date", "date")}
              />
              <DateField
                identifier={"expiry-date"}
                label={"Expiry Date"}
                {...bindDate("expiry_date")}
                {...validator("expiry_date", "date")}
              />
            </SimpleGrid>
            <Textarea
              identifier={"notes"}
              label={"Notes"}
              placeholder={"Enter any notes here..."}
              {...bind("notes")}
            />
          </Stack>
        </Stack>
        <AddEditFormFooter form={form} />
      </FormWrapper>
    );
  }
);
