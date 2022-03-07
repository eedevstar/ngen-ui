/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
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
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/core";

export const ModalAlert = ({
  modalTitle,
  modalContent,
  isOpen,
  onClose,
  ...props
}: {
  modalTitle: String;
  modalContent: String;
  isOpen: any;
  onClose: any;
}) => {
  return (
    <ChakraModal isCentered isOpen={isOpen} onClose={onClose} {...props}>
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
          <Flex alignItems={"flex-end"} justifyContent={"space-between"}>
            {modalTitle}
          </Flex>
          <Divider mt={3} mb={3} />
        </ModalHeader>
        <ModalBody mb={8} maxH={"60vh"} overflowY={"auto"}>
          <Text>{modalContent}</Text>
        </ModalBody>
        <ModalFooter>
          <Flex>
            <Button
              flexGrow={1}
              bg={"blue.900"}
              _hover={{ backgroundColor: "blue.800" }}
              onClick={onClose}
            >
              Close
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
