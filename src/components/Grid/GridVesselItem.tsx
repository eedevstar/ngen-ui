/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Flex, Image, Text, IconButton } from "components/standalone";
import { theme } from "styles/theme";
import { Button } from "../Button";
import { dispatch } from "../../store";
import { routeEvent, routeIds } from "../../routes/events";
import { component, createSub } from "framework-x";
import { getVesselStatuses } from "../../vessels/selectors";
import * as R from "ramda";
import { Tooltip } from "@chakra-ui/core";

const TooltipContent = ({
  overDue,
  upComing,
}: {
  overDue: number;
  upComing: number;
}) => {
  return (
    <div css={{ padding: "5px", fontWeight: "normal" }}>
      {overDue > 0 && <p>{overDue} Overdue</p>}
      {upComing > 0 && <p>{upComing} Upcoming</p>}
    </div>
  );
};

const StatusIcon = ({
  overDue,
  upComing,
}: {
  overDue: number;
  upComing: number;
}) => {
  var statusIcon = null;
  if (overDue > 0) {
    statusIcon = {
      color: theme.colors.red[300],
      border: `solid 1px ${theme.colors.red[300]}`,
      backgroundColor: `${theme.colors.red[100]} !important`,
      boxShadow: "none !important",
      icon: "warning",
    };
  } else if (upComing > 0) {
    statusIcon = {
      color: theme.colors.orange[300],
      border: `solid 1px ${theme.colors.orange[300]}`,
      backgroundColor: `${theme.colors.orange[100]} !important`,
      boxShadow: "none !important",
      icon: "time",
    };
  } else {
    statusIcon = {
      color: theme.colors.green[300],
      border: `solid 1px ${theme.colors.green[300]}`,
      backgroundColor: `${theme.colors.green[100]} !important`,
      boxShadow: "none !important",
      icon: "check",
    };
  }
  var iconButton = (
    <IconButton
      size="sm"
      fontSize="2"
      {...statusIcon}
      css={{
        position: "absolute",
        left: 10,
        top: 10,
        cursor: "default",
      }}
    />
  );
  if (overDue > 0 || upComing > 0) {
    return (
      <Tooltip
        bg={overDue > 0 ? theme.colors.red[100] : theme.colors.orange[100]}
        color={overDue > 0 ? theme.colors.red[300] : theme.colors.orange[300]}
        label={<TooltipContent upComing={upComing} overDue={overDue} />}
        placement="right-start"
      >
        {iconButton}
      </Tooltip>
    );
  } else {
    return iconButton;
  }
};

export default component(
  "GridVesselItem",
  createSub({
    vesselStatuses: getVesselStatuses,
  }),
  ({ vesselStatuses, thumbnail, name, id, ...props }) => {
    const image = `data:image/png;base64,${thumbnail}`;
    var statusIcon = null;
    var vesselStatus = null;
    if (R.has(id)(vesselStatuses?.vessels)) {
      vesselStatus = vesselStatuses?.vessels[id];
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
        {vesselStatus && (
          <StatusIcon
            upComing={vesselStatus.upcomingCount}
            overDue={vesselStatus.overdueCount}
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
          <Image
            css={{
              height: image ? "100%" : 48,
              width: image ? "100%" : 48,
              maxHeight: 114,
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={image}
            // fallbackSrc={require('../../assets/sailboat-line.svg')}
          />
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
          {name}
        </Text>
        <Button
          w={184}
          bg={"blue.900"}
          _hover={{ backgroundColor: "blue.800" }}
          onClick={(e) => {
            dispatch(routeEvent.NAV_TO, [routeIds.VESSEL_DETAIL, { id }]);
          }}
        >
          Manage
        </Button>
      </Flex>
    );
  }
);
