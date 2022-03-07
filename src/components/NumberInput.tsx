/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Text,
} from "components/standalone";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/core";

export const NumberInput = ({
  leftElement,
  rightElement,
  identifier,
  label,
  type,
  secondaryLabel,
  description,
  placeholder,
  light,
  value,
  onChange,
  readonly,
  min,
  isInvalid,
  max,
  ...props
}: {
  leftElement?: any;
  rightElement?: any;
  identifier: string;
  label?: string;
  secondaryLabel?: string;
  description?: string;
  placeholder?: string;
  light?: boolean;
  type?: string;
  value?: string;
  onChange?: any;
  min?: number;
  max?: number;
  isInvalid?: boolean;
  readonly?: boolean;
}) => {
  let range = {};
  if (min !== undefined) {
    range["min"] = min;
  }
  if (max) {
    range["max"] = max;
  }
  return (
    <FormControl flexGrow={1} position={"relative"} {...props}>
      {label && (
        <FormLabel
          fontFamily={theme.fonts.heading}
          fontSize={theme.fontSizes.sm}
          fontWeight={theme.fontWeights.bold}
          color={light ? theme.colors.white : theme.colors.black}
        >
          {label}
        </FormLabel>
      )}
      {secondaryLabel && (
        <Text
          css={{
            fontFamily: theme.fonts.body,
            fontSize: theme.fontSizes.xs,
            fontWeight: theme.fontWeights.regular,
            color: theme.colors.cyan[400],
            textTransform: "uppercase",
            letterSpacing: "0.04rem",
            position: "absolute",
            top: 4,
            right: 0,
          }}
        >
          {secondaryLabel}
        </Text>
      )}
      {readonly ? (
        <Text
          border="1px"
          borderColor={theme.colors.gray[200]}
          padding="0.5rem 1rem"
          borderRadius="0.25rem"
          fontSize="sm"
          backgroundColor={theme.colors.gray[50]}
          minHeight={"39px"}
        >
          {value}
        </Text>
      ) : (
        <ChakraNumberInput
          step={1}
          defaultValue={value}
          onChange={onChange}
          {...range}
        >
          <NumberInputField
            type="number"
            borderColor={
              isInvalid ? theme.colors.red[300] : theme.colors.blue[300]
            }
            fontSize={theme.fontSizes.sm}
            errorBorderColor={theme.colors.red[300]}
            css={{ boxShadow: "none !important" }}
            backgroundColor={
              isInvalid ? theme.colors.red[50] : theme.colors.gray[50]
            }
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </ChakraNumberInput>
      )}

      {description && (
        <FormHelperText fontSize={theme.fontSizes.xs}>
          {description}
        </FormHelperText>
      )}
    </FormControl>
  );
};
