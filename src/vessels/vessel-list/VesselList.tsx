/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Grid, ModalAlert } from "components";
import GridVesselItem from "../../components/Grid/GridVesselItem";
import { Box, Flex } from "@chakra-ui/core";
import { routeEvent, routeIds } from "../../routes/events";
import { component, createSub } from "framework-x";
import { getVessels, getVesselLimit, getVesselStatuses } from "../selectors";
import { formEvt } from "../../forms/events";
import { getIsShowAlertModal } from "forms/selectors";
import { GridSkeleton } from "components/Grid/GridSkeleton";
import { getCurrentCustomer, getCustomers } from "../../customers/selectors";
import * as R from "ramda";

export default component(
  "VesselList",
  createSub({
    getVessels,
    customer: getCurrentCustomer,
    customers: getCustomers,
    isShowAlertModal: getIsShowAlertModal,
    vesselStatuses: getVesselStatuses,
  }),
  ({ vessels, isShowAlertModal, dispatch, customer, customers }) => {
    if (vessels === undefined) {
      return (
        <Box pt={5}>
          <GridSkeleton entityName={"Vessels"} />
        </Box>
      );
    }
    let toolbarActions = {};
    const vesselLimit = !customer ? 0 : customer.licensedvessels;
    const deployedVessels = !customer ? 0 : customer.deployedVessels;
    let subCustomersLimit = 0;
    R.forEach((c) => {
      if (c["parentId"] == customer.id) {
        subCustomersLimit += c["licensedvessels"];
      }
    }, customers);

    if (vesselLimit - deployedVessels - subCustomersLimit > 0) {
      toolbarActions = {
        toolbarActions: [
          {
            type: "add",
            onClick: () => {
              vesselLimit > vessels.length
                ? dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_ADD])
                : dispatch(formEvt.SHOW_ALERT_MODAL);
            },
          },
        ],
      };
    }

    return (
      <Box pt={5} position="relative">
        <Grid
          entityName={`Vessels (Licensed ${vesselLimit} ${
            subCustomersLimit > 0 ? " - " + subCustomersLimit : ""
          }): `}
          EntityComponent={GridVesselItem}
          {...toolbarActions}
          entities={vessels}
        />
        <ModalAlert
          modalTitle="License Exceeded"
          modalContent="The Licensed number of Vessels has been reached, please contact support for more information."
          isOpen={isShowAlertModal}
          onClose={() => dispatch(formEvt.HIDE_ALERT_MODAL)}
        />
      </Box>
    );
  }
);
