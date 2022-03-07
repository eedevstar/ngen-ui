/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import { component, createSub } from "framework-x";
import { theme } from "styles/theme";
import {
  Divider,
  Flex,
  Avatar,
  Stack,
  Link,
  Text,
} from "components/standalone";
import { Button } from "./Button";
import { Input } from "./Input";
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/core";
import * as R from "ramda";
import { dispatch } from "store";
import { routeEvent, routeIds } from "routes/events";
import { vesselEvent } from "../vessels/events";
import { getShowPassword, makeFormSelector } from "forms/selectors";
import { formEvt } from "forms/events";
import { makeBind } from "forms/helpers";
const getDb = (db: Db) => db;

export default component(
  "ModalResetUserPwd",
  createSub({
    show: getShowPassword("password"),
    formId: R.always("user"),
    form: makeFormSelector("user"),
    showConfirm: getShowPassword("confirm_password"),
    formMode: R.always("edit"),
    getDb,
  }),
  ({
    show,
    showConfirm,
    user,
    formId,
    form,
    formMode,
    isOpen,
    db,
    onClose,
  }) => {
    if (!form) return null;
    console.log(db);
    const bind = makeBind({ dispatch, formName: formId, form, formMode });
    return (
      <ChakraModal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          w={504}
          maxW={"unset"}
          pb={6}
          pt={10}
          px={6}
          borderRadius={4}
        >
          <ModalHeader
            alignSelf={"center"}
            fontFamily={"heading"}
            fontSize={"2xl"}
            width={"100%"}
          >
            <Flex alignItems={"center"}>
              <span>Reset Password</span>
            </Flex>
            <Divider mt={3} mb={3} />
          </ModalHeader>
          <ModalBody mb={8} maxH={"60vh"} overflowY={"auto"}>
            <Stack spacing={4}>
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
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="space-between" width="100%">
              <Button
                width={100}
                bg={"blue.900"}
                _hover={{ backgroundColor: "blue.800" }}
                onClick={onClose}
              >
                Close
              </Button>

              <Button
                w={100}
                bg={"cyan.400"}
                _hover={{ backgroundColor: "cyan.600" }}
                onClick={() =>
                  // [dispatch(formEvt.HIDE_PWD_RESET_FORM),
                  [dispatch(formEvt.SUBMIT_FORM, { formId, formMode })]
                }
              >
                Reset
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    );
  }
);
