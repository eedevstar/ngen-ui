/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as R from "ramda";
import { Flex, Text } from "components/standalone";
import { theme } from "styles/theme";
import { Button } from "../Button";
import { Avatar } from "../standalone";
import { dispatch } from "../../store";
import { routeEvent, routeIds } from "../../routes/events";
import { component, createSub } from "framework-x";
import { getCrewStatuses } from "crew/selectors";
import { IconButton } from "@chakra-ui/core";
export default component(
  "GridCrewItem",
  createSub({
    crewStatuses: getCrewStatuses,
  }),
  ({ crewStatuses, image, firstname, lastname, id, ...props }) => {
    let statusIcon = null;
    if (crewStatuses) {
      const crewStatus = R.path(["crewMembers", id], crewStatuses);
      if (crewStatus["overdueCount"] > 0) {
        statusIcon = {
          color: theme.colors.red[300],
          border: `solid 1px ${theme.colors.red[300]}`,
          backgroundColor: `${theme.colors.red[100]} !important`,
          boxShadow: "none !important",
          icon: "warning",
        };
      } else if (crewStatus["upcomingCount"] > 0) {
        statusIcon = {
          color: theme.colors.orange[300],
          border: `solid 1px ${theme.colors.orange[300]}`,
          backgroundColor: `${theme.colors.orange[100]} !important`,
          boxShadow: "none !important",
          icon: "time",
        };
      }
    }

    return (
      <Flex
        css={{
          border: `1px solid ${theme.colors.gray[200]}`,
          borderRadius: 4,
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 12,
          position: "relative",
        }}
        {...props}
      >
        {statusIcon && (
          <IconButton
            size="sm"
            fontSize="2"
            {...statusIcon}
            zIndex="1"
            css={{
              position: "absolute",
              left: 10,
              top: 10,
              cursor: "default",
            }}
          />
        )}
        <Flex
          css={{
            height: 114,
            backgroundColor: theme.colors.gray[100],
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Avatar
            css={{
              height: "100%",
              width: "100%",
              maxHeight: 114,
              borderRadius: "unset",
            }}
            name={`${firstname} ${lastname}`}
          />
          {/*<Image*/}
          {/*  css={{*/}
          {/*    height: image ? '100%' : 48,*/}
          {/*    width: image ? '100%' : 48,*/}
          {/*    maxHeight: 114,*/}
          {/*    objectFit: 'cover',*/}
          {/*    objectPosition: 'center',*/}
          {/*  }}*/}
          {/*  src={image}*/}
          {/*  fallbackSrc={require('../../assets/user-line.svg')}*/}
          {/*/>*/}
        </Flex>
        <Text
          css={{
            height: 40,
            lineHeight: 1.4,
            verticalAlign: "middle",
            textAlign: "center",
            fontSize: theme.fontSizes.sm,
            marginBottom: 12,
          }}
        >
          {firstname} {lastname}
        </Text>
        <Button
          w={184}
          bg={"blue.900"}
          _hover={{ backgroundColor: "blue.800" }}
          onClick={(e) => {
            dispatch(routeEvent.NAV_TO, [routeIds.CREW_DETAIL, { id: id }]);
          }}
        >
          Manage
        </Button>
      </Flex>
    );
  }
);
