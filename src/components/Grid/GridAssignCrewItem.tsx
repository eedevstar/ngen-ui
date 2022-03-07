/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { component, createSub } from "framework-x";
import { Flex, Text } from "components/standalone";
import { theme } from "styles/theme";
import { Button } from "../Button";
import { Avatar } from "../standalone";
import { dispatch } from "../../store";
import { routeEvent, routeIds } from "../../routes/events";
import { Checkbox, Spinner } from "@chakra-ui/core";
import { getProcessingList } from "forms/selectors";

export default component(
  "GridAssignCrewItem",
  createSub({
    processingList: getProcessingList,
  }),
  ({
    processingList,
    image,
    firstname,
    lastname,
    id,
    checked,
    onUpdateCrew,
    ...props
  }) => {
    const isProcessing = !processingList[id] ? false : true;
    return (
      <Flex
        position={"relative"}
        css={{
          border: `1px solid ${theme.colors.gray[200]}`,
          borderRadius: 4,
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 12,
          cursor: "pointer",
        }}
        {...props}
        onClick={() => [isProcessing ? null : onUpdateCrew(!checked)]}
      >
        <Flex
          css={{
            height: 100,
            backgroundColor: theme.colors.gray[100],
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
            position: "relative",
          }}
        >
          <Avatar
            css={{
              height: "100%",
              width: "100%",
              maxHeight: 100,
              borderRadius: "unset",
            }}
            name={`${firstname} ${lastname}`}
          />
          <Checkbox
            css={{ position: "absolute", top: 10, left: 10 }}
            display={isProcessing ? "none" : "block"}
            isChecked={checked}
            onClick={(e) => [e.stopPropagation()]}
            onChange={(e) => [
              isProcessing ? null : onUpdateCrew(e.target.checked),
            ]}
          ></Checkbox>
        </Flex>
        <Text
          css={{
            height: 40,
            lineHeight: 1.4,
            verticalAlign: "middle",
            textAlign: "center",
            fontSize: theme.fontSizes.sm,
            marginBottom: 0,
          }}
        >
          {`${firstname} ${lastname}`}
        </Text>
        <Spinner
          position={"absolute"}
          left={"11px"}
          display={!isProcessing ? "none" : "block"}
          top={"12px"}
          size="xs"
          color="white"
        />
      </Flex>
    );
  }
);
