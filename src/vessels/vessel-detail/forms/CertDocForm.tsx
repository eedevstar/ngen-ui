/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
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
  makeBindFile,
  makeBindSelect,
  makeBindSwitch,
  isInvalid,
  makeValidator,
  makeBindDate,
} from "../../../forms/helpers";
import {
  getFormMode,
  getFormValidation,
  makeFormSelector,
} from "../../../forms/selectors";
import { AddEditFormTitle } from "./AddEditFormTitle";
import { SubitemFormFooter } from "./SubitemFormFooter";
import { FileInput } from "../../../components/FileInput";
import { routeEvent } from "../../../routes/events";
import { getRouteId } from "../../../routes/selectors";
import { getDocumentListByChildId, getVesselTags } from "vessels/selectors";
import { vesselEvent } from "vessels/events";
import moment from "moment";
import { getUsers } from "users/selectors";

const formName = "vesselcert";
const formTitle = "Certificate/Document";
export default component(
  "CertDocForm",
  createSub({
    formId: R.always("vesselcert"),
    form: makeFormSelector("vesselcert"),
    formMode: getFormMode,
    tags: getVesselTags("certificate"),
    documents: getDocumentListByChildId,
    validation: getFormValidation,
    users: getUsers,
  }),
  ({
    formId,
    form,
    formMode,
    dispatch,
    tags,
    documents,
    validation,
    users,
  }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindSelect = makeBindSelect({ dispatch, formName, form, formMode });
    const bindSwitch = makeBindSwitch({
      dispatch,
      formName: "vesselcert",
      form,
      formMode,
    });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });
    const options = getSelectOptions(tags);
    let document = !documents
      ? null
      : R.find(R.propEq("docType", "cert"))(documents);

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
              {...bind("name")}
              {...validator("name", "required")}
            />
            <FileInput
              {...bindFile("vessel_file")}
              original={document}
              downloadEvent={vesselEvent.DOWNLOAD_DOCUMENT}
              showDetail={true}
            />
            <SimpleGrid columns={2} spacing={4}>
              <CustomSelect
                identifier={"type"}
                label={"Type"}
                placeholder={"Select an option..."}
                secondaryLabel={"Required"}
                options={options}
                {...validator("cert_type", "required")}
                {...bindSelect("cert_type")}
              />

              <Input
                identifier={"doc-number"}
                label={"Document No."}
                placeholder={"Enter the document number..."}
                {...bind("document_number")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                identifier={"issue-date"}
                label={"Issue Date"}
                {...validator("issue_date", "date")}
                {...bindDate("issue_date")}
              />
              <DateField
                identifier={"expiry-date"}
                label={"Expiry Date"}
                {...validator("expiry_date", "date")}
                {...bindDate("expiry_date")}
              />
            </SimpleGrid>
            <Switch label={"Survey"} {...bindSwitch("survey_required")} />
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
