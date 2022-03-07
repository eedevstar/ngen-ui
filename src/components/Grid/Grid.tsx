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

export function Grid({
  entityName,
  entities,
  EntityComponent,
  toolbarActions,
}: {
  entities?: { [k: string]: any }[];
  EntityComponent?: Component;
  entityName?: string;
  toolbarActions: {
    type: string;
    onClick: (event: any) => void;
    status?: boolean;
  }[];
}) {
  /* Toolbar functions */
  const RemoveEntity = ({ id }) => {};
  const EditEntity = ({ id }) => {};
  const AddEntity = ({ id }) => {};
  const ResetPassword = ({ id }) => {};

  return (
    <Box>
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
      <Divider marginBottom={8} />
      <ChakraGrid templateColumns="repeat(4, 1fr)" gap={6}>
        {entities ? (
          entities.map((entity, i) => <EntityComponent key={i} {...entity} />)
        ) : (
          <Text css={{ color: theme.colors.gray[300] }}>
            No {entityName.toString().toLowerCase()}s found.
          </Text>
        )}
      </ChakraGrid>
    </Box>
  );
}
