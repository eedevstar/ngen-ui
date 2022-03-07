/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  Box,
  Button,
  Divider,
  FormWrapper,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Flex,
  FormFooter,
} from "components";
import {
  getFormMode,
  getIsSubmitting,
  makeFormSelector,
} from "../../forms/selectors";
import { component, createSub } from "framework-x";
import { authEvent } from "../../auth/events";
import * as R from "ramda";
import { makeBind, makeBindSelect, makeBindSwitch } from "forms/helpers";
import { Skeleton, Spinner } from "@chakra-ui/core";
import { routeEvent, routeIds } from "routes/events";
import { useState } from "react";
import { formEvt } from "forms/events";

const formName = "usersetting";
const getFrequencyOptions = () => [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
];
export default component(
  "Settings",
  createSub({
    formId: R.always("usersetting"),
    form: makeFormSelector("usersetting"),
    formMode: R.always("edit"),
    isSubmitting: getIsSubmitting,
  }),
  ({ formId, form, formMode, isSubmitting, dispatch }) => {
    if (!form) {
      return (
        <FormWrapper>
          <Stack spacing={3} justifyContent={"center"}>
            <Text
              fontFamily={theme.fonts.heading}
              fontSize={"1.8rem"}
              alignSelf={"center"}
            >
              Settings
            </Text>
            <Divider marginBottom={8} marginTop={0} />
            <Stack
              spacing={8}
              marginLeft={"auto"}
              marginRight={"auto"}
              width="500px"
            >
              <SimpleGrid columns={2} spacing={2} alignItems="center">
                <Skeleton height="50px" />
                <Skeleton height="50px" />
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={2} alignItems="center">
                <Skeleton height="50px" />
                <Skeleton height="50px" />
              </SimpleGrid>
            </Stack>
          </Stack>
        </FormWrapper>
      );
    }
    const bind = makeBind({ dispatch, formName, form, formMode });
    const bindSwitch = makeBindSwitch({
      dispatch,
      formName: "usersetting",
      form,
      formMode,
    });
    return (
      <FormWrapper>
        <Stack spacing={3} justifyContent={"center"}>
          <Flex alignItems="flex-end" justifyContent="center">
            <Text
              fontFamily={theme.fonts.heading}
              fontSize={"1.8rem"}
              alignSelf={"center"}
            >
              Settings
            </Text>
          </Flex>
          <Divider marginBottom={8} marginTop={0} />
          <Stack
            spacing={8}
            marginLeft={"auto"}
            marginRight={"auto"}
            position="relative"
          >
            <SimpleGrid columns={2} spacing={2} alignItems="end">
              <Box>
                <Switch
                  label={"Overdue Alert"}
                  isChecked={form["sendOverdueReminders"] || ""}
                  onChange={(e) => {
                    dispatch(formEvt.SET_VALUE, {
                      path: ["usersetting", "sendOverdueReminders"],
                      value: e.target.checked,
                    });
                    form["sendOverdueReminders"] = e.target.checked;
                    dispatch(formEvt.SUBMIT_FORM, {
                      formId: "usersetting",
                      formMode: "edit",
                      form: form,
                    });
                  }}
                />
              </Box>
              <Select
                identifier={"overdue_reminder_frequency"}
                label="Frequency"
                secondaryLabel={"Required"}
                placeholder={"Select a frequency..."}
                css={{
                  minWidth: "250px",
                }}
                value={form["overdueReminderFrequency"] || ""}
                onChange={(e) => {
                  dispatch(formEvt.SET_VALUE, {
                    path: ["usersetting", "overdueReminderFrequency"],
                    value: e.target.value,
                  });
                  form["overdueReminderFrequency"] = e.target.value;
                  dispatch(formEvt.SUBMIT_FORM, {
                    formId: "usersetting",
                    formMode: "edit",
                    form: form,
                  });
                }}
                options={getFrequencyOptions()}
                readonly={!(form["sendOverdueReminders"] || "")}
              />
            </SimpleGrid>
            <SimpleGrid columns={2} spacing={2} alignItems="end">
              <Box>
                <Switch
                  label={"Upcoming Alert"}
                  isChecked={form["sendUpcomingReminders"] || ""}
                  onChange={(e) => {
                    dispatch(formEvt.SET_VALUE, {
                      path: ["usersetting", "sendUpcomingReminders"],
                      value: e.target.checked,
                    });
                    form["sendUpcomingReminders"] = e.target.checked;
                    dispatch(formEvt.SUBMIT_FORM, {
                      formId: "usersetting",
                      formMode: "edit",
                      form: form,
                    });
                  }}
                />
              </Box>
              <Select
                identifier={"upcoming_reminder_frequency"}
                label="Frequency"
                secondaryLabel={"Required"}
                placeholder={"Select a frequency..."}
                css={{
                  minWidth: "250px",
                }}
                value={form["upcomingReminderFrequency"] || ""}
                onChange={(e) => {
                  dispatch(formEvt.SET_VALUE, {
                    path: ["usersetting", "upcomingReminderFrequency"],
                    value: e.target.value,
                  });
                  form["upcomingReminderFrequency"] = e.target.value;
                  dispatch(formEvt.SUBMIT_FORM, {
                    formId: "usersetting",
                    formMode: "edit",
                    form: form,
                  });
                }}
                options={getFrequencyOptions()}
                readonly={!(form["sendUpcomingReminders"] || "")}
              />
            </SimpleGrid>
            {isSubmitting && (
              <Box
                zIndex={10}
                position="absolute"
                left="0"
                top="0"
                w="100%"
                h="100%"
                display="flex"
                justifyContent="center"
                backgroundColor="rgb(255 255 255 / 50%)"
              >
                <Spinner size="md" alignSelf="center" />
              </Box>
            )}
          </Stack>
        </Stack>
      </FormWrapper>
    );
  }
);
