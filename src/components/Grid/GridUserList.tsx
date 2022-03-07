/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { Component, ReactElement } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  Image,
} from "components/standalone";
import { Grid as ChakraGrid } from "@chakra-ui/core";
import { theme } from "styles/theme";
import { GridHeader } from "./GridHeader";
import { ReactComponent as ActiveLogo } from "../../assets/crew-filter/crew_active.svg";
import { ReactComponent as InactiveLogo } from "../../assets/crew-filter/crew_inactive.svg";
import { isRoot } from "../../util";
import { UserRoleEnum } from "../../../gen/ts";
import * as R from "ramda";

export function GridUserList({
  entityName,
  entities,
  EntityComponent,
  toolbarActions,
  currentUser,
  customers,
}: {
  entities?: { [k: string]: any }[];
  EntityComponent?: Component;
  entityName?: string;
  currentUser?: any;
  customers?: any;
  toolbarActions: {
    type: string;
    onClick: (event: any) => void;
    status?: boolean;
  }[];
}) {
  const header = (
    <Flex alignItems={"flex-end"} justifyContent={"space-between"}>
      <GridHeader entities={entities} entityName={entityName} />
      {toolbarActions && (
        <Stack direction={"row"}>
          {toolbarActions.map(({ type, onClick, status }, i) => {
            switch (type) {
              case "remove":
                return (
                  <Button
                    key={i}
                    size={"sm"}
                    variant={"outline"}
                    variantColor={"cyan"}
                    leftIcon={"trash"}
                    onClick={onClick}
                  >
                    Remove
                  </Button>
                );
              case "filter":
                return (
                  <Button
                    key={i}
                    size={"sm"}
                    variant={"outline"}
                    variantColor={"cyan"}
                    onClick={onClick}
                  >
                    {status === true ? (
                      <ActiveLogo style={{ width: 20, fill: "#3CC3E3" }} />
                    ) : (
                      <InactiveLogo style={{ width: 20, fill: "#3CC3E3" }} />
                    )}
                    <span style={{ width: 110 }}>
                      {status === true ? "Show Inactive" : "Hide Inactive"}
                    </span>
                  </Button>
                );
              case "edit":
                return (
                  <Button
                    key={i}
                    size={"sm"}
                    variant={"outline"}
                    variantColor={"cyan"}
                    leftIcon={"edit"}
                    onClick={onClick}
                  >
                    Edit
                  </Button>
                );
              case "add":
                return (
                  <Button
                    key={i}
                    size={"sm"}
                    variant={"outline"}
                    variantColor={"cyan"}
                    leftIcon={"addCircle"}
                    onClick={onClick}
                  >
                    Add
                  </Button>
                );
              case "reset-password":
                return (
                  <Button
                    key={i}
                    size={"sm"}
                    variant={"outline"}
                    variantColor={"cyan"}
                    leftIcon={"lockOpen"}
                    onClick={onClick}
                  >
                    Reset password
                  </Button>
                );
              case "delete-user":
                return (
                  <Button
                    key={i}
                    size={"sm"}
                    variant={"outline"}
                    variantColor={"cyan"}
                    leftIcon={"delete"}
                    onClick={onClick}
                  >
                    Remove
                  </Button>
                );
              default:
                console.error("Unsupported type", type);
                return null;
            }
          })}
        </Stack>
      )}
    </Flex>
  );

  if (isRoot(currentUser)) {
    const rootUsers = entities.filter((item) => item.role == UserRoleEnum.Root);
    const otherUsers = R.groupBy(
      R.prop("customerId"),
      entities.filter((item) => item.role != UserRoleEnum.Root)
    );
    const sortedCustomers = R.sortWith([
      R.ascend(R.compose(R.toLower, R.prop("name"))),
    ])(customers);

    return (
      <Box>
        {header}
        <Divider marginBottom={8} />
        <ChakraGrid templateColumns="repeat(4, 1fr)" gap={6}>
          {rootUsers ? (
            rootUsers.map((entity) => <EntityComponent {...entity} />)
          ) : (
            <Text css={{ color: theme.colors.gray[300] }}>
              No {entityName.toString().toLowerCase()}s found.
            </Text>
          )}
        </ChakraGrid>
        {sortedCustomers &&
          sortedCustomers.map((entity) => {
            if (otherUsers[entity.id]) {
              return (
                <Box paddingTop="15px">
                  {entity.name}
                  <Divider marginBottom={8} />
                  <ChakraGrid templateColumns="repeat(4, 1fr)" gap={6}>
                    {otherUsers[entity.id].map((entity) => (
                      <EntityComponent {...entity} />
                    ))}
                  </ChakraGrid>
                </Box>
              );
            } else {
              return null;
            }
          })}
      </Box>
    );
  } else {
    return (
      <Box>
        {header}
        <Divider marginBottom={8} />
        <ChakraGrid templateColumns="repeat(4, 1fr)" gap={6}>
          {entities ? (
            entities.map((entity) => <EntityComponent {...entity} />)
          ) : (
            <Text css={{ color: theme.colors.gray[300] }}>
              No {entityName.toString().toLowerCase()}s found.
            </Text>
          )}
        </ChakraGrid>
      </Box>
    );
  }
}
