/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  Button,
  FormFooter,
  FormWrapper,
  Input,
  Stack,
  Text,
  ModalConfirmDelete,
  ImageInput,
} from "components";
import { FormControl, Flex } from "components/standalone";
import * as R from "ramda";
import { component, createSub, derive } from "framework-x";
import { formEvt } from "../../forms/events";
import { routeEvent } from "../../routes/events";
import { getRouteId } from "../../routes/selectors";
import {
  formSelectors,
  getIsSubmitting,
  getConfirmDeleteOnModal,
  getIsOpenConfirm,
  getFormMode,
  getFormValidation,
} from "../../forms/selectors";
import {
  makeBind,
  makeBindFile,
  makeBindThumbnail,
  makeValidator,
} from "../../forms/helpers";
import { FileInput } from "../../components/FileInput";
import { evt } from "app/events";
import {
  getDocumentByVesselId,
  getVesselShipParticular,
} from "vessels/selectors";
import { vesselEvent } from "vessels/events";
export default component(
  "VesselAddEdit",
  createSub({
    formId: R.always("vessel"),
    formMode: getFormMode,
    isOpenConfirm: getIsOpenConfirm,
    confirmDeleteOnModal: getConfirmDeleteOnModal,
    form: formSelectors["vessel"],
    getIsSubmitting,
    shipParticular: getVesselShipParticular,
    validation: getFormValidation,
  }),
  ({
    form,
    formId,
    formMode,
    isOpenConfirm,
    confirmDeleteOnModal,
    isSubmitting,
    shipParticular,
    dispatch,
    validation,
  }) => {
    if (!form) return null;

    const bind = makeBind({ dispatch, formName: "vessel", form, formMode });
    const bindFile = makeBindFile({
      dispatch,
      formName: "vessel",
      form,
      formMode,
    });
    const bindThumbnail = makeBindThumbnail({
      dispatch,
      formName: "vessel",
      form,
      formMode,
    });
    const validator = makeValidator({ dispatch, form, validation });

    return (
      <FormWrapper>
        <Stack
          spacing={16}
          justifyContent={"center"}
          marginTop={12}
          paddingBottom={240}
        >
          <Flex alignItems={"flex-end"} justifyContent={"center"}>
            <Text
              fontFamily={theme.fonts.heading}
              fontSize={"1.8rem"}
              alignSelf={"center"}
            >
              {formMode === "create" ? "Add Vessel" : "Edit Vessel"}
            </Text>

            {formMode == "edit" && (
              <div
                css={{
                  display: "flex",
                  alignSelf: "flex-end",
                  marginLeft: "auto",
                }}
              >
                <Button
                  size={"sm"}
                  variant={"outline"}
                  variantColor={"cyan"}
                  leftIcon={"delete"}
                  onClick={() => dispatch(evt.SHOW_CONFIRM_MODAL)}
                >
                  Remove
                </Button>
                <ModalConfirmDelete
                  isOpen={isOpenConfirm}
                  onClose={() => dispatch(evt.HIDE_CONFIRM_MODAL)}
                  header={"Confirm deletion?"}
                  entityName={"Vessel"}
                  isConfirmed={confirmDeleteOnModal}
                  onConfirm={() =>
                    dispatch(formEvt.SUBMIT_FORM, {
                      formId,
                      formMode: "delete",
                      form,
                    })
                  }
                  body={`Are you sure you wish to remove the Vessel "${form.name}" from the system? This can not be undone.`}
                />
              </div>
            )}
          </Flex>
          <Stack spacing={8}>
            <Input
              identifier={"vessel-name"}
              label={"Vessel Name"}
              placeholder={"Enter a vessel name..."}
              description={"Provide the name of the vessel you are adding"}
              secondaryLabel={"Required"}
              {...bind("name")}
              {...validator("name", "required")}
            />
            <FormControl flexGrow={1} position={"relative"}>
              <ImageInput
                {...bindThumbnail("thumbnail")}
                identifier={"thumbnail-file"}
                label={"Image"}
                placeholder={"Browse for an image..."}
                description={"Upload an image of the vessel"}
              />
              <Input
                identifier={"thumbnail"}
                type={"hidden"}
                {...bind("thumbnail")}
              />
            </FormControl>
            <FormControl flexGrow={1} position={"relative"}>
              <FileInput
                {...bindFile("vessel_particulars")}
                original={shipParticular}
                downloadEvent={vesselEvent.DOWNLOAD_DOCUMENT}
                identifier={"vessel-particulars"}
                label={"Ships Particulars"}
                placeholder={"Browse for a file..."}
                description={
                  "Upload a PDF, PNG, JPG or JPEG of the ships details"
                }
              />
            </FormControl>
            <Stack isInline spacing={4}>
              <Input
                identifier={"radio-call-sign"}
                label={"Radio Call Sign"}
                placeholder={"Enter Radio Call Sign..."}
                {...bind("callsign")}
              />
              <Input
                identifier={"mnz-number"}
                label={"IMO/Official number"}
                placeholder={"Enter IMO/Official Number..."}
                {...bind("registrationNumber")}
              />
            </Stack>
            <Input
              identifier={"vessel-registry"}
              label={"Port of Registry"}
              placeholder={"Enter the port of registry..."}
              {...bind("registrationPort")}
            />
          </Stack>
        </Stack>
        <FormFooter
          leftButtonLabel={"Cancel"}
          leftButtonOnClick={() =>
            // TODO. confirm no changes/dirtyform
            dispatch(routeEvent.BACK)
          }
          leftButtonDisabled={isSubmitting}
          rightButtonLabel={"Confirm"}
          rightButtonDisabled={isSubmitting}
          rightButtonOnClick={() =>
            dispatch(formEvt.SUBMIT_FORM, { formId, formMode })
          }
        />
      </FormWrapper>
    );
  }
);
