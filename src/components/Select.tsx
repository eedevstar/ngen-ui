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
import { Select as ChakraSelect } from "@chakra-ui/core";
import * as R from "ramda";

export const Select = ({
  options,
  identifier,
  label,
  type,
  secondaryLabel,
  description,
  placeholder,
  light,
  onChange,
  value,
  readonly,
  isInvalid,
  onBlur,
  ...props
}: {
  options: typeof Array.prototype;
  identifier: string;
  label?: string;
  secondaryLabel?: string;
  description?: string;
  placeholder?: string;
  light?: boolean;
  type?: string;
  value?: string;
  onChange: any;
  readonly?: boolean;
  isInvalid?: boolean;
  onBlur?: any;
}) => {
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
      {!readonly && secondaryLabel && (
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
          padding="2"
          borderRadius="0.25rem"
          fontSize="sm"
          backgroundColor={theme.colors.gray[50]}
          minHeight={"39px"}
        >
          {R.prop("label", R.find(R.propEq("value", value))(options))}
        </Text>
      ) : (
        <ChakraSelect
          borderColor={
            isInvalid ? theme.colors.red[300] : theme.colors.blue[300]
          }
          backgroundColor={
            isInvalid ? theme.colors.red[50] : theme.colors.gray[50]
          }
          fontSize={theme.fontSizes.sm}
          placeholder={placeholder}
          data-id={identifier}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          {options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </ChakraSelect>
      )}

      {description && (
        <FormHelperText fontSize={theme.fontSizes.xs}>
          {description}
        </FormHelperText>
      )}
    </FormControl>
  );
};
