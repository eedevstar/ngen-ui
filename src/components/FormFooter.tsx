/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import { Box } from "components/standalone";
import { Button } from "./Button";

export const FormFooter = ({
  leftButtonLabel,
  leftButtonOnClick,
  leftButtonDisabled,
  rightButtonLabel,
  rightButtonDisabled,
  rightButtonOnClick,
}: {
  leftButtonLabel?: string;
  leftButtonOnClick?: any;
  leftButtonDisabled?: boolean;

  rightButtonLabel?: string;
  rightButtonOnClick?: any;
  rightButtonDisabled?: boolean;
}) => {
  return (
    <Box
      w={["auto", "auto", "auto", 900]}
      left={[3, 3, 3, "unset"]}
      right={[3, 3, 3, "unset"]}
      css={{
        height: 124,
        position: "absolute",
        bottom: 0,
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0px -22px 12px -16px rgba(0,0,0,0.08)",
        paddingTop: 24,
        backgroundColor: theme.colors.white,
        zIndex: 10,
      }}
    >
      {leftButtonLabel && (
        <Button
          w={140}
          bg={"blue.900"}
          _hover={{ backgroundColor: "blue.800" }}
          disabled={leftButtonDisabled}
          onClick={!leftButtonDisabled && leftButtonOnClick}
        >
          {leftButtonLabel}
        </Button>
      )}
      {rightButtonLabel && (
        <Button
          w={140}
          bg={"cyan.400"}
          _hover={{ backgroundColor: "cyan.600" }}
          isLoading={rightButtonDisabled}
          onClick={!rightButtonDisabled && rightButtonOnClick}
        >
          {rightButtonLabel}
        </Button>
      )}
    </Box>
  );
};
