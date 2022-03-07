/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import {
  Flex,
  Image,
  Text,
  IconButton,
  Spinner,
  Stack,
} from "components/standalone";
import { theme } from "styles/theme";
import { Button } from "../Button";
import { dispatch, fx } from "../../store";
import { routeEvent, routeIds } from "../../routes/events";
import { component, createSub } from "framework-x";
import { getProcessingList, getSelectedItem } from "forms/selectors";
import * as R from "ramda";
import { formEvt } from "forms/events";
import { getCurrentUser } from "users/selectors";
import { isCustomerAdmin } from "../../util";
import { setSubCustomerId } from "forms/helpers";

export default component(
  "GridCustomerItem",
  createSub({
    selectedCustomer: getSelectedItem("customer"),
    user: getCurrentUser,
    getProcessingList,
  }),
  ({
    thumbnail,
    name,
    id,
    licensedvessels,
    selectedCustomer,
    processingList,
    user,
    dispatch,
    ...props
  }) => {
    const image = `data:image/png;base64,${thumbnail}`;
    const isProcessing = R.pathOr(null, [id], processingList) == true;
    return (
      <Flex
        css={{
          border: `1px solid ${theme.colors.gray[200]}`,
          background: theme.colors.white,
          borderRadius: 4,
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 16,
          paddingBottom: 28,
          position: "relative",
          cursor: "pointer",
        }}
        boxShadow={selectedCustomer == id ? "outline" : null}
        onClick={() =>
          !isProcessing
            ? selectedCustomer == id
              ? dispatch(formEvt.DESELECT_ITEM, { type: "customer" })
              : dispatch(formEvt.SELECT_ITEM, { type: "customer", value: id })
            : null
        }
        {...props}
      >
        <Spinner
          position={"absolute"}
          left={"11px"}
          display={!isProcessing ? "none" : "block"}
          top={"12px"}
          size="xs"
          color={theme.colors.gray[500]}
        />
        <Flex
          css={{
            height: 80,
            backgroundColor: theme.colors.gray[100],
            width: 80,
            borderRadius: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Image
            css={{
              height: image ? "100%" : 48,
              width: image ? "100%" : 48,
              maxHeight: 114,
              borderRadius: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={image}
            fallbackSrc={require("../../assets/sailboat-line.svg")}
          />
        </Flex>
        <Text
          css={{
            lineHeight: 1.4,
            verticalAlign: "middle",
            textAlign: "center",
            fontSize: theme.fontSizes.sm,
          }}
        >
          {name}
        </Text>
        <Text
          css={{
            lineHeight: 1.4,
            verticalAlign: "middle",
            textAlign: "center",
            fontSize: theme.fontSizes.sm,
          }}
        >
          Licensed Vessel: {licensedvessels}
        </Text>
        {isCustomerAdmin(user) && (
          <Stack marginTop={"10px"}>
            <Button
              w={140}
              bg={"blue.900"}
              _hover={{ backgroundColor: "blue.800" }}
              onClick={(e) => [
                dispatch(formEvt.SET_SUB_CUSTOMER_ID, { id }),
                dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_LIST, {}]),
                e.stopPropagation(),
              ]}
            >
              Manage
            </Button>
          </Stack>
        )}
      </Flex>
    );
  }
);
