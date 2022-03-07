/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  Button,
  CustomSelect,
  FormFooter,
  FormWrapper,
  Input,
  DateField,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  Box,
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
import { SubitemFormFooter } from "./SubitemFormFooter";
import {
  getSelectOptions,
  makeBind,
  makeBindDate,
  makeBindFile,
  makeBindSelect,
  makeBindSwitch,
  makeValidator,
} from "forms/helpers";
import { FileInput } from "components/FileInput";
import { getDocumentListByChildId, getVesselTags } from "vessels/selectors";
import { vesselEvent } from "vessels/events";
export default component(
  "SafetyEquipmentForm",
  createSub({
    formName: R.always("safetyequipment"),
    form: makeFormSelector("safetyequipment"),
    getFormMode,
    tags: getVesselTags("safetyequipment"),
    documents: getDocumentListByChildId,
    validation: getFormValidation,
  }),
  ({ formName, form, formMode, tags, dispatch, documents, validation }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindSelect = makeBindSelect({ dispatch, formName, form, formMode });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const bindSwitch = makeBindSwitch({
      dispatch,
      formName,
      form,
      formMode,
    });
    const validator = makeValidator({ dispatch, form, validation });
    const options = getSelectOptions(tags);
    const document = !documents
      ? null
      : R.find(R.propEq("docType", "safetyequipment"))(documents);

    return (
      <FormWrapper>
        <Stack
          spacing={16}
          justifyContent={"center"}
          marginTop={12}
          paddingBottom={240}
        >
          <AddEditFormTitle formId={formName} form={form}>
            {"Safety Equipment"}
          </AddEditFormTitle>
          <Stack spacing={8}>
            <Input
              identifier={"equipment-name"}
              label={"Equipment Name"}
              placeholder={"Enter name of the equipment..."}
              secondaryLabel={"Required"}
              {...bind("name")}
              {...validator("name", "required")}
            />

            <SimpleGrid columns={2} spacing={4}>
              <CustomSelect
                identifier={"tags"}
                label={"Category"}
                placeholder={"Select a Category..."}
                secondaryLabel={"Required"}
                options={options}
                {...bindSelect("tag")}
                {...validator("tag", "required")}
              />
              <Input
                label={"Document No."}
                placeholder={"Enter the document number..."}
                identifier={"doc-number"}
                {...bind("doc_no")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                label={"Date Issued"}
                identifier={"date-issued"}
                secondaryLabel={"Required"}
                {...bindDate("date_issued")}
                {...validator("date_issued", "required|date")}
              />
              <DateField
                label={"Expiry Date"}
                identifier={"expiry-date"}
                {...bindDate("expiry_date")}
                {...validator("expiry_date", "date")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={4}>
              <Input
                label={"Location"}
                placeholder={"Enter the location of the equipment..."}
                identifier={"location"}
                {...bind("location")}
              />
              <Box style={{ marginTop: "2rem" }}>
                <Switch
                  label={"Survey Required"}
                  {...bindSwitch("survey_required")}
                />
              </Box>
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
