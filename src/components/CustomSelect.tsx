import React from "react";
import { theme } from "styles/theme";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Text,
} from "components/standalone";
import CreatableSelect from "react-select/creatable";

export const CustomSelect = ({
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
  isClearable,
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
  isClearable?: boolean;
  isInvalid?: boolean;
  onBlur?: any;
}) => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: theme.fontSizes.sm,
    }),
    control: (provided, state) => ({
      ...provided,
      fontSize: theme.fontSizes.sm,
      backgroundColor: isInvalid ? theme.colors.red[50] : theme.colors.gray[50],
      borderColor: state.isFocused
        ? theme.colors.blue[500]
        : isInvalid
        ? theme.colors.red[300]
        : theme.colors.blue[300],
      "&:hover": {
        borderColor: state.isFocused
          ? theme.colors.blue[500]
          : theme.colors.gray[300],
      },
      boxShadow: state.isFocused ? `0 0 0 1px ${theme.colors.blue[500]}` : `0`,

      // none of react-select's styles are passed to <Control />
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: theme.fontSizes.sm,
    }),
  };
  return (
    <FormControl flexGrow={1} position={"relative"} {...props} zIndex={5}>
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
          position="absolute"
          fontFamily={theme.fonts.body}
          fontSize={theme.fontSizes.xs}
          fontWeight={theme.fontWeights.regular}
          color={theme.colors.cyan[400]}
          textTransform="uppercase"
          letterSpacing="0.04rem"
          top="4px"
          right="0"
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
        <CreatableSelect
          styles={customStyles}
          placeholder={placeholder}
          isClearable={true}
          options={options}
          defaultValue={{ value: value, label: value }}
          createOptionPosition="first"
          onChange={onChange}
          onBlur={onBlur}
        />
      )}

      {description && (
        <FormHelperText fontSize={theme.fontSizes.xs}>
          {description}
        </FormHelperText>
      )}
    </FormControl>
  );
};
