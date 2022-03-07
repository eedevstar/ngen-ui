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
import { Grid } from "components";
import GridAssignCrewItem from "./Grid/GridAssignCrewItem";
import { Button } from "./Button";
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
} from "@chakra-ui/core";
import { dispatch } from "store";
import { routeEvent, routeIds } from "routes/events";
import { vesselEvent } from "../vessels/events";
import { Grid as ChakraGrid } from "@chakra-ui/core";
import { sortCrew } from "../util";

export const ModalAssignCrew = ({
  allCrews,
  vessel,
  isOpen,
  onClose,
  ...props
}: {
  allCrews: any;
  vessel: any;
  crews?: any;
  isOpen: any;
  onClose: any;
}) => {
  return (
    <ChakraModal isCentered isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent
        w={860}
        maxW={"unset"}
        pb={6}
        pt={10}
        px={6}
        borderRadius={4}
      >
        <ModalHeader
          alignSelf={"center"}
          fontFamily={"heading"}
          fontSize={"1xl"}
          width={"100%"}
        >
          Select Crew ({allCrews.length} total)
          <Divider mt={1} mb={1} />
        </ModalHeader>
        <ModalBody mb={8} maxH={"60vh"} overflowY={"auto"}>
          <ChakraGrid templateColumns="repeat(4, 1fr)" gap={6}>
            {allCrews ? (
              sortCrew(allCrews).map((entity) => (
                <GridAssignCrewItem
                  key={`pc-${entity.id}`}
                  checked={vessel.crew.indexOf(entity) >= 0}
                  onUpdateCrew={(add) => {
                    return dispatch(vesselEvent.UPDATE_VESSEL_CREW, {
                      vesselId: vessel.id,
                      crew: entity,
                      add: add,
                    });
                  }}
                  {...entity}
                />
              ))
            ) : (
              <Text css={{ color: theme.colors.gray[300] }}>
                No crews found.
              </Text>
            )}
          </ChakraGrid>
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
