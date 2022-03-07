/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import { routeEvent, routeIds } from "../../routes/events";
import { dispatch } from "../../store";
import { component, createSub } from "framework-x";
import * as R from "ramda";

import {
  Button,
  FormFooter,
  FormWrapper,
  Input,
  Stack,
  Switch,
  Text,
  Select,
} from "components";
import {
  getFormMode,
  getShowPassword,
  makeFormSelector,
  getIsSubmitting,
  getFormValidation,
} from "forms/selectors";
import { makeBind, makeBindSwitch, makeValidator } from "forms/helpers";
import { getRouteId } from "routes/selectors";
import { formEvt } from "forms/events";
import { getCustomers } from "customers/selectors";
import { getCurrentUser } from "users/selectors";
import { isRoot, isCustomerAdmin, isAdmin, UserRoles } from "../../util";

export default component(
  "UserAdd",
  createSub({
    show: getShowPassword("password"),
    showConfirm: getShowPassword("confirm_password"),
    formId: R.always("user"),
    form: makeFormSelector("user"),
    formMode: getFormMode,
    routeId: getRouteId,
    customers: getCustomers,
    currentUser: getCurrentUser,
    getIsSubmitting,
    validation: getFormValidation,
  }),
  ({
    show,
    showConfirm,
    formId,
    form,
    formMode,
    routeId,
    isSubmitting,
    customers,
    currentUser,
    dispatch,
    validation,
  }) => {
    if (!form) return null;
    const bind = makeBind({ dispatch, formName: formId, form, formMode });
    const validator = makeValidator({ dispatch, form, validation });

    let roleOptions = [];
    if (isRoot(currentUser) || isCustomerAdmin(currentUser)) {
      roleOptions.push({ label: "Superuser", value: UserRoles.CUSTOMER_ADMIN });
      roleOptions.push({ label: "Admin", value: UserRoles.ADMIN });
    }
    if (
      isRoot(currentUser) ||
      isCustomerAdmin(currentUser) ||
      isAdmin(currentUser)
    ) {
      roleOptions.push({ label: "Readonly", value: UserRoles.READONLY });
    }

    if (isCustomerAdmin(currentUser)) {
      customers = R.filter(
        (item) =>
          item["parentId"] == currentUser.customerId ||
          item["id"] == currentUser.customerId,
        customers
      );
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
            User
          </Text>
          <Stack spacing={8}>
            {(isRoot(currentUser) || isCustomerAdmin(currentUser)) && (
              <Select
                identifier={"customer_id"}
                label={"Select Customer"}
                placeholder={"Select Customer"}
                secondaryLabel={"Required"}
                options={customers.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                {...bind("customer_id")}
                {...validator("customer_id", "required")}
              />
            )}
            <Input
              identifier={"name"}
              label={"Name"}
              placeholder={"Enter a name..."}
              secondaryLabel={"Required"}
              {...bind("fullname")}
              {...validator("fullname", "required")}
            />
            <Input
              identifier={"email"}
              label={"E-mail address"}
              placeholder={"Enter an e-mail address..."}
              description={`The user's new password will be sent to this email address`}
              {...bind("email")}
            />
            <Select
              identifier={"role"}
              placeholder={"Select a role..."}
              options={roleOptions}
              label={"User Role"}
              {...bind("role")}
              {...validator("role", "required")}
            />
            {formMode != "read" && (
              <Input
                type={show ? "text" : "password"}
                identifier={"password"}
                label={"Password"}
                placeholder="Enter password..."
                {...bind("password")}
                rightElement={
                  <Button
                    h="1.75rem"
                    mr={2}
                    bg={"cyan.400"}
                    _hover={{ backgroundColor: "cyan.600" }}
                    onClick={(e) =>
                      dispatch(
                        show ? formEvt.HIDE_PASSWORD : formEvt.SHOW_PASSWORD,
                        "password"
                      )
                    }
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                }
              />
            )}
            {formMode != "read" && (
              <Input
                type={showConfirm ? "text" : "password"}
                identifier={"confirm-password"}
                label={"Confirm password"}
                placeholder="Enter password..."
                {...bind("confirm_password")}
                rightElement={
                  <Button
                    h="1.75rem"
                    mr={2}
                    bg={"cyan.400"}
                    _hover={{ backgroundColor: "cyan.600" }}
                    onClick={(e) =>
                      dispatch(
                        showConfirm
                          ? formEvt.HIDE_PASSWORD
                          : formEvt.SHOW_PASSWORD,
                        "confirm_password"
                      )
                    }
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </Button>
                }
              />
            )}
          </Stack>
        </Stack>
        {formMode == "read" && (
          <FormFooter
            leftButtonLabel={"Close"}
            leftButtonOnClick={() =>
              dispatch(routeEvent.NAV_TO, [routeIds.USER_LIST])
            }
          />
        )}
        {formMode != "read" && (
          <FormFooter
            leftButtonLabel={"Cancel"}
            leftButtonOnClick={() =>
              dispatch(routeEvent.NAV_TO, [routeIds.USER_LIST])
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
