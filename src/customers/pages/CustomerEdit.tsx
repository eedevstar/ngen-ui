/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import { routeEvent, routeIds } from "../../routes/events";
import { dispatch, fx } from "../../store";
import { component, createSub } from "framework-x";
import * as R from "ramda";

import {
  Button,
  FormFooter,
  FormWrapper,
  Input,
  NumberInput,
  Stack,
  Switch,
  Text,
} from "components";
import {
  getFormMode,
  getShowPassword,
  makeFormSelector,
  getIsSubmitting,
  getFormValidation,
} from "forms/selectors";
import {
  makeBind,
  makeBindNumber,
  makeBindSwitch,
  makeValidator,
} from "forms/helpers";
import { getRouteId } from "routes/selectors";
import { formEvt } from "forms/events";
import { getCurrentUser } from "../../users/selectors";
import { Skeleton } from "@chakra-ui/core";
import { getCustomers } from "../selectors";
import { isCustomerAdmin } from "../../util";

const MAX_VALUE = 99999;
export default component(
  "CustomerEdit",
  createSub({
    formId: R.always("customer"),
    form: makeFormSelector("customer"),
    formMode: getFormMode,
    routeId: getRouteId,
    getIsSubmitting,
    getCurrentUser,
    getCustomers,
    validation: getFormValidation,
  }),
  ({
    formId,
    form,
    formMode,
    routeId,
    isSubmitting,
    currentUser,
    customers,
    validation,
    dispatch,
  }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName: formId, form, formMode });
    const bindNumber = makeBindNumber({
      dispatch,
      formName: formId,
      form,
      formMode,
    });
    const validator = makeValidator({ dispatch, form, validation });

    if (!currentUser) {
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
              {formMode == "create" ? "Add" : formMode == "edit" ? "Edit" : ""}{" "}
              Customer
            </Text>
            <Skeleton height="50px" />
            <Skeleton height="50px" />
          </Stack>
        </FormWrapper>
      );
    }
    let maxVessels = 0;
    if (isCustomerAdmin(currentUser)) {
      customers.forEach((c) => {
        if (c.id == currentUser.customerId) {
          maxVessels += c.licensedvessels - c.deployedVessels;
        } else if (
          c.parentId == currentUser.customerId &&
          R.prop("id", form) != c.id
        ) {
          maxVessels -= c.licensedvessels;
        }
      });
      maxVessels = Math.max(0, maxVessels);
    }
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
            {formMode == "create" ? "Add" : formMode == "edit" ? "Edit" : ""}{" "}
            Customer
          </Text>
          <Stack spacing={8}>
            <Input
              identifier={"name"}
              label={"Name"}
              placeholder={"Enter a name..."}
              secondaryLabel={"Required"}
              {...validator("name", "required")}
              {...bind("name")}
            />
            <Input
              identifier={"licensedvessels"}
              label={"Licensed Vessels"}
              placeholder={"Enter a number of licenced vessels"}
              secondaryLabel={"Required"}
              type={"number"}
              description={
                isCustomerAdmin(currentUser)
                  ? `(limited to ${maxVessels})`
                  : null
              }
              {...validator(
                "licensedvessels",
                `required|min:0|max:${
                  isCustomerAdmin(currentUser) ? maxVessels : MAX_VALUE
                }`
              )}
              {...bind("licensedvessels")}
            />
          </Stack>
        </Stack>
        {formMode == "read" && (
          <FormFooter
            leftButtonLabel={"Close"}
            leftButtonOnClick={() =>
              dispatch(routeEvent.NAV_TO, [routeIds.CUSTOMER_LIST])
            }
          />
        )}
        {formMode != "read" && (
          <FormFooter
            leftButtonLabel={"Cancel"}
            leftButtonOnClick={() =>
              dispatch(routeEvent.NAV_TO, [routeIds.CUSTOMER_LIST])
            }
            leftButtonDisabled={isSubmitting}
            rightButtonLabel={"Confirm"}
            rightButtonDisabled={isSubmitting}
            rightButtonOnClick={() =>
              dispatch(formEvt.SUBMIT_FORM, { formId, formMode })
            }
          />
        )}
      </FormWrapper>
    );
  }
);
