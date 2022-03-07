/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import { Checkbox, Flex, Text } from "components/standalone";
import { Button } from "./Button";
import {
  Modal as ChakraModal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/core";
import { dispatch } from "store";
import { formEvt } from "forms/events";
import { getConfirmDeleteOnModal } from "forms/selectors";
import { evt } from "app/events";

export const ModalConfirmDelete = ({
  entityName,
  header,
  body,
  isOpen,
  onClose,
  onConfirm,
  isConfirmed,
  ...props
}: {
  entityName: string;
  header: string;
  body: any;
  isOpen: any;
  onClose: any;
  onConfirm: any;
  isConfirmed: any;
}) => {
  return (
    <ChakraModal isCentered isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent
        w={600}
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
        >
          {header}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={8}>
          <Text>{body}</Text>
          <Checkbox
            size={"md"}
            w={"100%"}
            justifyContent={"center"}
            mt={8}
            checked={isConfirmed}
            onClick={(e) => {
              const _isChecked = e.target.checked;
              if (_isChecked !== undefined) {
                dispatch(evt.TOGGLE_CONFIRM_DELETE, _isChecked);
              }
            }}
          >
            I understand this {entityName} will be deleted
          </Checkbox>
        </ModalBody>
        <ModalFooter>
          <Flex width={"100%"}>
            <Button
              mr={8}
              w={140}
              bg={"blue.900"}
              _hover={{ backgroundColor: "blue.800" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              css={{
                flexGrow: 1,
                backgroundColor: theme.colors.cyan[400],
                ":hover": {
                  backgroundColor: theme.colors.cyan[600],
                },
              }}
              disabled={!isConfirmed}
              onClick={() => {
                onClose();
                onConfirm();
              }}
            >
              Delete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
