/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as R from "ramda";
import React from "react";
import { component, createSub } from "framework-x";
import {
  getConfirmDeleteOnModal,
  getFormMode,
  getIsOpenConfirm,
} from "../../../forms/selectors";
import { Button, Text, Stack, ModalConfirmDelete } from "../../../components";
import { Flex } from "../../../components/standalone";
import { theme } from "../../../styles/theme";
import { dispatch, fx } from "../../../store";
import { routeEvent, routeIds } from "../../../routes/events";
import { SimpleGrid } from "@/components";
import { getRouteId } from "../../../routes/selectors";
import {
  getSelectedVesselId,
  getSelectedVesselSubItemId,
} from "../../selectors";
import { formEvt } from "forms/events";
import { evt } from "app/events";

export const AddEditFormTitle = component(
  "AddEditFormTitle",
  createSub({
    getFormMode,
    getRouteId,
    isOpenConfirm: getIsOpenConfirm,
    confirmDeleteOnModal: getConfirmDeleteOnModal,
    vesselId: getSelectedVesselId,
    childId: getSelectedVesselSubItemId,
  }),
  ({
    children,
    formMode,
    vesselId,
    childId,
    routeId,
    isOpenConfirm,
    confirmDeleteOnModal,
    formId,
    form,
  }) => {
    return (
      <Flex
        alignItems={"flex-end"}
        justifyContent={"center"}
        css={{ marginBottom: "2rem" }}
      >
        {(formMode == "read" || formMode == "edit") && (
          <div
            css={{
              display: "flex",
              marginRight: "auto",
              visibility: "hidden",
            }}
          >
            <Button
              size={"sm"}
              variant={"outline"}
              variantColor={"cyan"}
              leftIcon={"edit"}
            >
              Edit
            </Button>
          </div>
        )}
        <div
          css={{
            display: "flex",
            alignSelf: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Text
            fontFamily={theme.fonts.heading}
            fontSize={"1.8rem"}
            alignSelf={"center"}
          >
            {formMode === "create" ? "Add" : formMode === "edit" ? "Edit" : ""}{" "}
            {children}
          </Text>
        </div>
        {formMode == "read" && (
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
              leftIcon={"edit"}
              onClick={() => {
                dispatch(routeEvent.NAV_TO, [
                  routeId.replace("/detail", "/edit"),
                  {
                    id: vesselId,
                    childId,
                  },
                ]);
              }}
            >
              Edit
            </Button>
          </div>
        )}

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
              entityName={children}
              isConfirmed={confirmDeleteOnModal}
              onConfirm={() =>
                dispatch(formEvt.SUBMIT_FORM, {
                  formId,
                  formMode: "delete",
                  form,
                })
              }
              body={`Are you sure you wish to remove the ${children} "${form.name}" from the system? This can not be undone.`}
            />
          </div>
        )}
      </Flex>
    );
  }
);
