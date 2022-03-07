/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { theme } from "styles/theme";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "components/standalone";
import { Input as ChakraInput } from "@chakra-ui/core";

export const Input = ({
  leftElement,
  rightElement,
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
  leftElement?: any;
  rightElement?: any;
  identifier: string;
  label?: string;
  secondaryLabel?: string;
  description?: string;
  placeholder?: string;
  light?: boolean;
  type?: string;
  onChange: any;
  value?: string;
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
          padding="0.5rem 1rem"
          borderRadius="0.25rem"
          fontSize="sm"
          backgroundColor={theme.colors.gray[50]}
          minHeight={"39px"}
        >
          {value}
        </Text>
      ) : (
        <InputGroup size={"md"}>
          {leftElement && <InputLeftElement children={leftElement} />}
          <ChakraInput
            borderColor={
              isInvalid ? theme.colors.red[300] : theme.colors.blue[300]
            }
            backgroundColor={
              isInvalid ? theme.colors.red[50] : theme.colors.gray[50]
            }
            fontSize={theme.fontSizes.sm}
            placeholder={placeholder}
            autoComplete={"off"}
            type={type}
            data-id={identifier}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
          {rightElement && (
            <InputRightElement
              width={"auto"}
              alignItems={"center"}
              minWidth={"2.5rem"}
              children={rightElement}
            />
          )}
        </InputGroup>
      )}

      {description && (
        <FormHelperText fontSize={theme.fontSizes.xs}>
          {description}
        </FormHelperText>
      )}
    </FormControl>
  );
};
