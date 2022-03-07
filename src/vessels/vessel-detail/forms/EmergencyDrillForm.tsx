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
  Text,
  Textarea,
} from "components";
import * as R from "ramda";
import { component, createSub } from "framework-x";
import { routeEvent, routeIds } from "routes/events";
import { formEvt } from "forms/events";
import { AddEditFormTitle } from "./AddEditFormTitle";
import { SubitemFormFooter } from "./SubitemFormFooter";
import {
  getFormMode,
  getFormValidation,
  makeFormSelector,
} from "../../../forms/selectors";
import { getRouteId } from "../../../routes/selectors";
import {
  getSelectOptions,
  makeBind,
  makeBindDate,
  makeBindFile,
  makeBindSelect,
  makeValidator,
} from "../../../forms/helpers";
import { FileInput } from "components/FileInput";
import { getDocumentListByChildId, getVesselTags } from "vessels/selectors";
import { vesselEvent } from "vessels/events";

const formName = "drill";
const formTitle = "Emergency Drills";
export default component(
  "DrillForm",
  createSub({
    formId: R.always("drill"),
    form: makeFormSelector("drill"),
    getRouteId,
    getFormMode,
    tags: getVesselTags("drill"),
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
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });
    const options = getSelectOptions(tags);
    const document = !documents
      ? null
      : R.find(R.propEq("docType", "drill"))(documents);
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
              identifier={"emergency-title"}
              label={"Title of Emergency Drill"}
              placeholder={"Enter a title name for the emergency drill..."}
              secondaryLabel={"Required"}
              description={"Provide the title of the drill you are adding"}
              {...bind("name")}
              {...validator("name", "required")}
            />
            <CustomSelect
              identifier={"tags"}
              label={"Category"}
              placeholder={"Select a category..."}
              secondaryLabel={"Required"}
              options={options}
              {...bindSelect("tag")}
              {...validator("tag", "required")}
            />
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                label={"Due Date"}
                identifier={"due-date"}
                secondaryLabel={"Required"}
                {...bindDate("due_date")}
                {...validator("due_date", "date")}
              />
              <DateField
                label={"Completed Date"}
                identifier={"completed-date"}
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
