/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  Box,
  Button,
  DateField,
  FormFooter,
  FormWrapper,
  Input,
  Stack,
  Switch,
  Text,
  Textarea,
} from "components";
import { SimpleGrid } from "@chakra-ui/core";
import { component, createSub, derive } from "framework-x";
import * as R from "ramda";
import { routeEvent } from "../../routes/events";
import { formEvt } from "../../forms/events";
import {
  formSelectors,
  getFormValidation,
  getIsSubmitting,
} from "../../forms/selectors";
import { getRouteId } from "../../routes/selectors";
import {
  makeBind,
  makeBindDate,
  makeBindFile,
  makeBindSwitch,
  makeValidator,
} from "../../forms/helpers";
import { FileInput } from "../../components/FileInput";
import { crewEvent } from "crew/events";
import { getDocumentListByCrewId } from "crew/selectors";

export default component(
  "CrewAddEdit",
  createSub({
    formId: R.always("crew"),
    formMode: derive(getRouteId, (id) =>
      id.includes("edit") ? "edit" : "create"
    ),
    form: formSelectors["crew"],
    getIsSubmitting,
    validation: getFormValidation,
    documents: getDocumentListByCrewId,
  }),
  ({
    formId,
    formMode,
    form,
    isSubmitting,
    dispatch,
    validation,
    documents,
  }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName: "crew", form, formMode });
    const bindDate = makeBindDate({
      dispatch,
      formName: "crew",
      form,
      formMode,
    });
    const bindSwitch = makeBindSwitch({
      dispatch,
      formName: "crew",
      form,
      formMode,
    });
    const bindFile = makeBindFile({
      dispatch,
      formName: "crew",
      form,
      formMode,
    });
    const validator = makeValidator({ dispatch, form, validation });
    console.log("crewdocument", documents);
    const firstAidCertFile = R.find(R.propEq("docType", "first-aid-cert"))(
      documents
    );
    const medicalCertFile = R.find(R.propEq("docType", "medical-cert"))(
      documents
    );
    return (
      <FormWrapper>
        <Stack
          spacing={16}
          justifyContent={"center"}
          marginTop={12}
          paddingBottom={240}
        >
          <Text
            fontFamily={theme.fonts.heading}
            fontSize={"1.8rem"}
            alignSelf={"center"}
          >
            {formMode === "create" ? "Add Crew" : "Edit Crew"}
          </Text>
          <Stack spacing={8}>
            <SimpleGrid columns={2} spacing={4}>
              <Input
                identifier={"firstname"}
                label={"First name"}
                placeholder={"Enter a first name..."}
                secondaryLabel={"Required"}
                {...bind("firstname")}
                {...validator("firstname", "required")}
              />
              <Input
                identifier={"lastname"}
                label={"Last name"}
                placeholder={"Enter a last name..."}
                secondaryLabel={"Required"}
                {...bind("lastname")}
                {...validator("lastname", "required")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={4}>
              <Input
                identifier={"role"}
                label={"Role"}
                placeholder={"Select a role..."}
                secondaryLabel={"Required"}
                // options={[{ value: 'mate', label: 'Mate' }]}
                {...bind("role")}
                {...validator("role", "required")}
              />
            </SimpleGrid>
            <SimpleGrid columns={1} spacing={4}>
              <Switch label={"Active Crew"} {...bindSwitch("active_crew")} />
            </SimpleGrid>
            <Box
              borderWidth={1}
              borderRadius={4}
              borderColor={"gray.100"}
              p={4}
            >
              <Text color={"cyan.400"} mb={6} fontFamily={"heading"}>
                Entitlements
              </Text>
              <SimpleGrid columns={2} spacing={2}>
                <Switch label={"Coastal"} {...bindSwitch("coastal")} />
                <Switch label={"Local Limits"} {...bindSwitch("locallimits")} />
                <Switch label={"Off shore"} {...bindSwitch("offshore")} />
                <Switch
                  label={"Restricted Limits"}
                  {...bindSwitch("restrictedlimits")}
                />
              </SimpleGrid>
            </Box>
            <Box
              borderWidth={1}
              borderRadius={4}
              borderColor={"gray.100"}
              p={4}
            >
              <Text color={"cyan.400"} mb={6} fontFamily={"heading"}>
                Medical Certificate
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                <Input
                  identifier={"medical-cert-number"}
                  label={"Medical Certificate No."}
                  placeholder={"Enter the medical certificate number..."}
                  {...bind("medicalcertno")}
                />
                <FileInput
                  {...bindFile("medCertFile")}
                  original={medicalCertFile}
                  downloadEvent={crewEvent.DOWNLOAD_DOCUMENT}
                />
                <DateField
                  label={"Issued Date"}
                  identifier={"issued-date"}
                  {...bindDate("medicalcertissued")}
                  {...validator("medicalcertissued", "date")}
                />
                <DateField
                  label={"Expiry Date"}
                  identifier={"expiry-date"}
                  {...bindDate("medicalcertexpiry")}
                  {...validator("medicalcertexpiry", "date")}
                />
              </SimpleGrid>
            </Box>
            <Box
              borderWidth={1}
              borderRadius={4}
              borderColor={"gray.100"}
              p={4}
            >
              <Text color={"cyan.400"} mb={6} fontFamily={"heading"}>
                First Aid Certificate
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                <Input
                  identifier={"first-aid-cert-number"}
                  label={"First Aid Certificate No."}
                  placeholder={"Enter the first aid certificate number..."}
                  {...bind("firstaidno")}
                />
                <FileInput
                  {...bindFile("firstAidCertFile")}
                  original={firstAidCertFile}
                  downloadEvent={crewEvent.DOWNLOAD_DOCUMENT}
                />
                <DateField
                  label={"Issued Date"}
                  identifier={"issued-date"}
                  {...bindDate("firstaidissued")}
                  {...validator("firstaidissued", "date")}
                />
                <DateField
                  label={"Expiry Date"}
                  identifier={"expiry-date"}
                  {...bindDate("firstaidexpiry")}
                  {...validator("firstaidexpiry", "date")}
                />
              </SimpleGrid>
            </Box>
            <Textarea
              identifier={"notes"}
              label={"Notes"}
              placeholder={"Enter any notes here..."}
              {...bind("notes")}
            />
          </Stack>
        </Stack>
        <FormFooter
          leftButtonLabel={"Cancel"}
          leftButtonOnClick={() => dispatch(routeEvent.BACK)}
          leftButtonDisabled={isSubmitting}
          rightButtonLabel={"Confirm"}
          // TODO. confirm no changes/dirtyform
          rightButtonDisabled={isSubmitting}
          form={form}
          formId={formId}
          formMode={formMode}
          rightButtonOnClick={() =>
            dispatch(formEvt.SUBMIT_FORM, { formId, formMode })
          }
        />
      </FormWrapper>
    );
  }
);
