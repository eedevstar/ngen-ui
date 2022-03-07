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
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  CustomSelect,
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
import { getRouteId } from "../../../routes/selectors";
import {
  getSelectOptions,
  makeBind,
  makeBindDate,
  makeBindFile,
  makeBindSelect,
  makeBindSwitch,
  makeValidator,
} from "../../../forms/helpers";
import { getDocumentListByChildId, getVesselTags } from "vessels/selectors";
import { FileInput } from "components/FileInput";
import { vesselEvent } from "vessels/events";

const formName = "maintenance";
const formTitle = "Maintenance";
export default component(
  "MaintenanceForm",
  createSub({
    formId: R.always("maintenance"),
    form: makeFormSelector("maintenance"),
    tags: getVesselTags("maintenance"),
    getRouteId,
    getFormMode,
    documents: getDocumentListByChildId,
    validation: getFormValidation,
  }),
  ({
    formMode,
    routeId,
    formId,
    form,
    tags,
    dispatch,
    documents,
    validation,
  }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindSelect = makeBindSelect({ dispatch, formName, form, formMode });
    const bindSwitch = makeBindSwitch({
      dispatch,
      formName: "maintenance",
      form,
      formMode,
    });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });
    const options = getSelectOptions(tags);

    const document = !documents
      ? null
      : R.find(R.propEq("docType", "maintenance"))(documents);
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
              identifier={"item-name"}
              label={"Item Name"}
              placeholder={"Enter the name of the maintenance item..."}
              secondaryLabel={"Required"}
              {...bind("name")}
              {...validator("name", "required")}
            />
            <CustomSelect
              placeholder={"Select a category..."}
              options={options}
              onChange={(e) => console.log(e.target.value)}
              identifier={"tags"}
              secondaryLabel={"Required"}
              label={"Category"}
              {...bindSelect("tag")}
              {...validator("tag", "required")}
            />
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                label={"Due Date"}
                identifier={"due-date"}
                {...bindDate("due_date")}
                {...validator("due_date", "date")}
              />
              <Select
                identifier={"reminder-freq"}
                label={"Reminder Frequency"}
                secondaryLabel={"Required"}
                placeholder={"Select a frequency..."}
                options={[{ value: "weekly", label: "Weekly" }]}
                {...bind("reminder_frq")}
                {...validator("reminder_frq", "required")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={4}>
              <Box style={{ marginTop: "2rem" }}>
                <Switch
                  label={"Maintenance Complete"}
                  {...bindSwitch("maintenance_complete")}
                />
              </Box>
              <DateField
                label={"Completed Date"}
                identifier={"due-date"}
                {...bindDate("completed_date")}
                {...validator("completed_date", "date")}
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
