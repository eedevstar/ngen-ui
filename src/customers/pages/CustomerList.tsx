import React from "react";
import { Box } from "@chakra-ui/core";
import { Grid, ModalConfirmDelete } from "components";
import { GridSkeleton } from "components/Grid/GridSkeleton";
import GridCustomerItem from "components/Grid/GridCustomerItem";

import { component, createSub } from "framework-x";
import { getCustomers } from "../selectors";
import * as R from "ramda";
import { routeEvent, routeIds } from "routes/events";
import {
  getConfirmDeleteOnModal,
  getIsOpenConfirm,
  getSelectedItem,
} from "forms/selectors";
import { userEvent } from "users/handlers/events";
import { evt } from "app/events";
import { getCurrentUser } from "users/selectors";
import { isCustomerAdmin } from "../../util";

export default component(
  "CustomerList",
  createSub({
    customers: getCustomers,
    confirmDeleteOnModal: getConfirmDeleteOnModal,
    currentUser: getCurrentUser,
    isOpenConfirm: getIsOpenConfirm,
    selectedCustomer: getSelectedItem("customer"),
  }),
  ({
    dispatch,
    customers,
    currentUser,
    selectedCustomer,
    confirmDeleteOnModal,
    isOpenConfirm,
  }) => {
    if (!customers || customers.length == 0) {
      return (
        <Box pt={5}>
          <GridSkeleton entityName={"Customers"} />
        </Box>
      );
    }
    if (isCustomerAdmin(currentUser)) {
      //Filter by customer id
      customers = R.filter(
        (item) =>
          item["parentId"] == currentUser.customerId ||
          item["id"] == currentUser.customerId,
        customers
      );
    }
    let toolbarActions = [];
    let selectedCustomerName = "";
    if (selectedCustomer) {
      toolbarActions.push({
        type: "edit",
        onClick: () =>
          dispatch(routeEvent.NAV_TO, [
            routeIds.CUSTOMER_EDIT,
            { id: selectedCustomer },
          ]),
      });
      if (currentUser && currentUser.customerId != selectedCustomer) {
        toolbarActions.push({
          type: "remove",
          onClick: () => dispatch(evt.SHOW_CONFIRM_MODAL),
        });
      }
      selectedCustomerName = R.find(R.propEq("id", selectedCustomer))(
        customers
      )["name"];
    }
    toolbarActions.push({
      type: "add",
      onClick: () => dispatch(routeEvent.NAV_TO, [routeIds.CUSTOMER_ADD]),
    });
    return (
      <Box pt={5} position="relative">
        <Grid
          entityName={"Customers"}
          EntityComponent={GridCustomerItem}
          toolbarActions={toolbarActions}
          entities={customers}
        />
        {selectedCustomer && (
          <ModalConfirmDelete
            isOpen={isOpenConfirm}
            onClose={() => dispatch(evt.HIDE_CONFIRM_MODAL)}
            header={"Confirm deletion?"}
            entityName={"customer"}
            isConfirmed={confirmDeleteOnModal}
            onConfirm={() =>
              dispatch(routeIds.CUSTOMER_DELETE, { id: selectedCustomer })
            }
            body={`Are you sure you wish to remove the customer '${selectedCustomerName}'? This can not be undone.`}
          />
        )}
      </Box>
    );
  }
);
