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
  makeBindDate,
  makeBindFile,
  makeBindNumber,
  makeValidator,
} from "../../../forms/helpers";
import { getDocumentListByChildId } from "vessels/selectors";
import { FileInput } from "components/FileInput";
import { vesselEvent } from "vessels/events";

const formName = "part";
const formTitle = "Spare Part";

export default component(
  "SparePartForm",
  createSub({
    formId: R.always("part"),
    form: makeFormSelector("part"),
    getRouteId,
    getFormMode,
    documents: getDocumentListByChildId,
    validation: getFormValidation,
  }),
  ({ formMode, routeId, formId, form, dispatch, documents, validation }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindDate = makeBindDate({ dispatch, formName, form, formMode });
    const bindNumber = makeBindNumber({ dispatch, formName, form, formMode });
    const bindFile = makeBindFile({ dispatch, formName, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });
    const document = !documents
      ? null
      : R.find(R.propEq("docType", "part"))(documents);
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
              identifier={"part-name"}
              label={"Part Name"}
              placeholder={"Enter the name of the spare part..."}
              secondaryLabel={"Required"}
              {...bind("name")}
              {...validator("name", "required")}
            />
            <SimpleGrid columns={2} spacing={4}>
              <DateField
                label={"Date Added"}
                identifier={"date-added"}
                {...bindDate("date_added")}
                {...validator("date_added", "date")}
              />
              <NumberInput
                label={"Quantity"}
                identifier={"quantity"}
                {...bindNumber("quantity")}
              />
            </SimpleGrid>
            <Input
              label={"Location"}
              placeholder={"Enter the location of the equipment..."}
              identifier={"location"}
              secondaryLabel={"Required"}
              {...bind("location")}
              {...validator("location", "required")}
            />
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
