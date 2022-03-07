/** @jsx jsx */
import { jsx } from "@emotion/core";
import { theme } from "styles/theme";
import { IconButton } from "@chakra-ui/core";
import { overDueStatus } from "forms/helpers";
import React from "react";

export const StatusIcon = ({ status }: { status: number }) => {
  if (status == overDueStatus.OVERDUE) {
    return (
      <IconButton
        size="sm"
        fontSize="2"
        color={theme.colors.red[300]}
        border={`solid 1px ${theme.colors.red[300]}`}
        backgroundColor={`${theme.colors.red[100]} !important`}
        boxShadow="none !important"
        icon="warning"
        alignSelf="center"
        css={{
          position: "absolute",
          right: 10,
          cursor: "default",
        }}
      />
    );
  } else if (status == overDueStatus.BEING) {
    return (
      <IconButton
        size="sm"
        fontSize="2"
        color={theme.colors.orange[300]}
        border={`solid 1px ${theme.colors.orange[300]}`}
        backgroundColor={`${theme.colors.orange[100]} !important`}
        boxShadow="none !important"
        icon="time"
        alignSelf="center"
        css={{
          position: "absolute",
          right: 10,
          cursor: "default",
        }}
      />
    );
  } else {
    return null;
  }
};
