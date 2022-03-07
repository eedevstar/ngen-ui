/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  Button,
  FormFooter,
  FormWrapper,
  Input,
  SimpleGrid,
  DateField,
  Stack,
  Text,
  Textarea,
  MultiSelect,
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
  makeBindCrewSelect,
  makeValidator,
} from "forms/helpers";
import { FileInput } from "../../../components/FileInput";
import {
  getDocumentListByChildId,
  getSelectedVesselDetail,
} from "vessels/selectors";
import { vesselEvent } from "vessels/events";

const formName = "training";
const formTitle = "Training";
export default component(
  "TrainingForm",
  createSub({
    formId: R.always("training"),
    form: makeFormSelector("training"),
    getRouteId,
    vessel: getSelectedVesselDetail,
    getFormMode,
    documents: getDocumentListByChildId,
    validation: getFormValidation,
  }),
  ({
    formMode,
    routeId,
    formId,
    form,
    dispatch,
    documents,
    vessel,
    validation,
  }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const bindSelect = makeBindCrewSelect({
      dispatch,
      formName,
      form,
      formMode,
    });
    const validator = makeValidator({ dispatch, form, validation });
    const document = !documents
      ? null
      : R.find(R.propEq("docType", "training"))(documents);

    const { crew } = vessel;
    let crewOptions = [];
    R.forEach((citem) => {
      crewOptions.push({
        label: `${citem.firstname} ${citem.lastname}`,
        value: citem.id,
      });
    }, crew);

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
                {...bindDate("completed_date")}
                {...validator("completed_date", "date")}
              />
            </SimpleGrid>
            <Textarea
              identifier={"notes"}
              label={"Notes"}
              placeholder={"Enter any notes here..."}
              {...bind("notes")}
            />
            <MultiSelect
              identifier={"crew_members"}
              label={"Crew Members"}
              placeholder={"Select a crew members..."}
              options={crewOptions}
              isMulti={true}
              {...bindSelect("crew_members")}
              // {...validator("crew_members", "required")}
            />
          </Stack>
        </Stack>
        <SubitemFormFooter form={form} />
      </FormWrapper>
    );
  }
);
