/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as R from "ramda";
import { ModalConfirmDelete } from "components";
import { GridUserList } from "components/Grid/GridUserList";
import { Box } from "@chakra-ui/core";
import { routeEvent, routeIds } from "../../routes/events";
import { component, createSub } from "framework-x";
import { getCurrentUser, getUsers } from "../selectors";
import GridUserItem from "components/Grid/GridUserItem";
import { formEvt } from "forms/events";
import {
  getConfirmDeleteOnModal,
  getIsOpenConfirm,
  getisShowResetPwdForm,
  getIsSubmitting,
  getSelectedItem,
} from "forms/selectors";
import { evt } from "app/events";
import ModalResetUserPwd from "components/ModalResetUserPwd";
import { userEvent } from "users/handlers/events";
import { getCustomers } from "customers/selectors";

export default component(
  "UserList",
  createSub({
    getUsers,
    isSubmiting: getIsSubmitting,
    selectedUser: getSelectedItem("user"),
    confirmDeleteOnModal: getConfirmDeleteOnModal,
    isOpenConfirm: getIsOpenConfirm,
    isShowResetPwdForm: getisShowResetPwdForm,
    currentUser: getCurrentUser,
    customers: getCustomers,
  }),
  ({
    users,
    selectedUser,
    isOpenConfirm,
    confirmDeleteOnModal,
    isShowResetPwdForm,
    isSubmitting,
    currentUser,
    customers,
    dispatch,
  }) => {
    let toolbar = [];
    let selectedUserName = "";
    if (selectedUser) {
      toolbar.push({
        type: "reset-password",
        onClick: () => dispatch(userEvent.RESET_USER_PWD, { id: selectedUser }),
      });
      toolbar.push({
        type: "delete-user",
        onClick: () => dispatch(evt.SHOW_CONFIRM_MODAL),
      });
      console.log("selectedUser", users, selectedUser);
      selectedUserName = R.find(R.propEq("id", selectedUser))(users)[
        "fullname"
      ];
    }
    toolbar.push({
      type: "add",
      onClick: () => dispatch(routeEvent.NAV_TO, [routeIds.USER_ADD]),
    });
    return (
      <Box pt={5}>
        <GridUserList
          entityName={"User"}
          EntityComponent={GridUserItem}
          toolbarActions={toolbar}
          entities={users}
          currentUser={currentUser}
          customers={customers}
        />
        {selectedUser && (
          <ModalConfirmDelete
            isOpen={isOpenConfirm}
            onClose={() => dispatch(evt.HIDE_CONFIRM_MODAL)}
            header={"Confirm deletion?"}
            entityName={"user"}
            isConfirmed={confirmDeleteOnModal}
            onConfirm={() =>
              dispatch(routeIds.USER_DELETE, { id: selectedUser })
            }
            body={`Are you sure you wish to remove the user '${selectedUserName}'? This can not be undone.`}
          />
        )}
        {selectedUser && (
          <ModalResetUserPwd
            isOpen={isShowResetPwdForm}
            onClose={() => dispatch(formEvt.HIDE_PWD_RESET_FORM)}
          />
        )}
      </Box>
    );
  }
);
