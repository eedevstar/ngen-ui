/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import { Switch as ChakraSwitch } from "@chakra-ui/core";
import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
} from "components/standalone";

export const Switch = ({
  label,
  description,
  onChange,
  value,
  isChecked,
  readonly,
  ...props
}: {
  label: string;
  description?: string;
  value?: boolean;
  onChange: any;
  readonly?: boolean;
  isChecked?: boolean;
}) => {
  return (
    <FormControl marginBottom="2rem">
      <Flex alignItems="center">
        <FormLabel fontFamily={"heading"} fontSize={"sm"} fontWeight={"bold"}>
          {label}
        </FormLabel>
        <ChakraSwitch
          style={{ marginBottom: 0, paddingBottom: "4px" }}
          isChecked={isChecked}
          isDisabled={readonly}
          color={"cyan"}
          onChange={readonly ? () => {} : onChange}
          value={value}
          {...props}
        />
      </Flex>
      {description && (
        <FormHelperText fontSize={theme.fontSizes.xs}>
          {description}
        </FormHelperText>
      )}
    </FormControl>
  );
};
