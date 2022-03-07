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
import { dispatch } from "store";
import { routeEvent, routeIds } from "routes/events";
import { vesselEvent } from "../vessels/events";
import * as R from "ramda";
import { sortCrew } from "../util";

export const ModalCrew = ({
  crew,
  vessel,
  isOpen,
  onClose,
  ...props
}: {
  crew: typeof Array.prototype;
  vessel: typeof Array.prototype;
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
            <div css={{ width: 96 }}>&nbsp;</div>
            <span>Assigned Crew</span>
            <Button
              size={"sm"}
              variant={"outline"}
              variantColor={"cyan"}
              css={{ width: 96 }}
              onClick={() => dispatch(vesselEvent.SHOW_CREW_ASSIGN)}
            >
              Modify
            </Button>
          </Flex>
          <Divider mt={3} mb={3} />
        </ModalHeader>
        <ModalBody mb={8} maxH={"60vh"} overflowY={"auto"}>
          <Stack spacing={4}>
            {crew.length > 0 ? (
              sortCrew(crew).map((member) => (
                <React.Fragment key={`ac-${member.id}`}>
                  <Flex justifyContent={"space-between"}>
                    <Link css={{ width: 180 }}>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={3}
                      >
                        <Avatar
                          src={member.imageSrc}
                          size={"sm"}
                          name={member.name}
                          css={{
                            "& > *": {
                              fontFamily: theme.fonts.heading,
                              fontWeight: theme.fontWeights.bold,
                            },
                          }}
                        />
                        <Text
                          fontSize={"sm"}
                        >{`${member.firstname} ${member.lastname}`}</Text>
                      </Stack>
                    </Link>
                    <Flex justifyContent={"space-between"} css={{ width: 90 }}>
                      <Button
                        size={"sm"}
                        bg={"blue.900"}
                        _hover={{ backgroundColor: "blue.800" }}
                        css={{
                          width: 96,
                        }}
                        onClick={() => {
                          dispatch(routeEvent.NAV_TO, [
                            routeIds.CREW_DETAIL,
                            { id: member.id },
                          ]);
                        }}
                      >
                        Manage
                      </Button>
                    </Flex>
                  </Flex>
                  <Divider mt={3} mb={3} />
                </React.Fragment>
              ))
            ) : (
              <Text textAlign={"center"} fontSize={"sm"}>
                {"No crew currently assigned to this vessel"}
              </Text>
            )}
          </Stack>
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
