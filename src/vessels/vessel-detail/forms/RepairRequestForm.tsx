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
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  Select,
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
import { SubitemFormFooter } from "./SubitemFormFooter";
import { getRouteId } from "../../../routes/selectors";
import {
  makeBind,
  makeBindCrewSelect,
  makeBindDate,
  makeBindFile,
  makeBindNumber,
  makeValidator,
} from "../../../forms/helpers";
import { getSelectedVesselDetail } from "vessels/selectors";
import { FileInput } from "components/FileInput";
import { vesselEvent } from "vessels/events";

const formName = "requests";
const formTitle = "Repair Request";

export default component(
  "RepairRequest",
  createSub({
    formId: R.always(formName),
    form: makeFormSelector(formName),
    vessel: getSelectedVesselDetail,
    getRouteId,
    getFormMode,
    validation: getFormValidation,
  }),
  ({ formMode, routeId, formId, form, vessel, dispatch, validation }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindNumber = makeBindNumber({ dispatch, formName, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });
    const { crew } = vessel;
    const crewOptions = R.map(
      (c) => ({
        label: `${c.firstname} ${c.lastname}`,
        value: c.id,
      }),
      crew
    );
    const priorityOptions = [
      { label: 1, value: 1 },
      { label: 2, value: 2 },
      { label: 3, value: 3 },
    ];

    if (!form.priority) form.priority = 3;

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
              identifier={"description"}
              label={"Description"}
              placeholder={"Enter the description..."}
              secondaryLabel={"Required"}
              {...bind("description")}
              {...validator("description", "required")}
            />
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                label={"Reported Date"}
                identifier={"reported-date"}
                secondaryLabel={"Required"}
                {...bindDate("reported_date")}
                {...validator("reported_date", "required|date")}
              />
              <Select
                identifier={"reported-by"}
                label={"Reported By"}
                placeholder={"Select"}
                options={crewOptions}
                {...bind("reported_by")}
              />
            </SimpleGrid>
            <Textarea
              identifier={"required-action"}
              label={"Required Action"}
              placeholder={"Enter the required action..."}
              secondaryLabel={"Required"}
              {...bind("required_action")}
              {...validator("required_action", "required")}
            />
            <SimpleGrid columns={2} spacing={4}>
              <Select
                identifier={"priority"}
                label={"Priority"}
                placeholder={"Select"}
                options={priorityOptions}
                {...bind("priority")}
              />
              <DateField
                label={"Due Date"}
                identifier={"due_date"}
                {...bindDate("due_date")}
                {...validator("due_date", "date")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={4}>
              <Select
                identifier={"signed-off-by"}
                label={"Signed Off By"}
                placeholder={"Select"}
                options={crewOptions}
                {...bind("signed_off_by")}
              />
              <DateField
                label={"Date Completed"}
                identifier={"date_completed"}
                {...bindDate("date_completed")}
                {...validator("date_completed", "date")}
              />
            </SimpleGrid>
          </Stack>
        </Stack>
        <SubitemFormFooter form={form} />
      </FormWrapper>
    );
  }
);
