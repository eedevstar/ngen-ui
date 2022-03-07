/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Stack, Text } from "components/standalone";
import { theme } from "styles/theme";
import {
  getVessels,
  getVesselLimit,
  getVesselStatuses,
} from "../../vessels/selectors";

export const GridHeader = ({ entityName, entities, showTotal = true }) => {
  return (
    <Stack direction={"row"} alignItems={"first baseline"}>
      <Text
        css={{
          fontFamily: theme.fonts.heading,
          fontSize: theme.fontSizes.md,
          color: theme.colors.blue[900],
        }}
      >
        {entityName}
      </Text>
      {showTotal && (
        <Text
          css={{
            fontSize: theme.fontSizes.sm,
            color: theme.colors.gray[400],
          }}
        >
          {entities ? entities.length : 0} total
        </Text>
      )}
    </Stack>
  );
};
