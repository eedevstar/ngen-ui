import React from "react";
import { theme } from "styles/theme";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Text,
} from "components/standalone";
import Select from "react-select";
import * as R from "ramda";
import { sortStringArray } from "../util";

export const MultiSelect = ({
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
  value?: typeof Array.prototype;
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
    multiValue: (provided, state) => ({
      ...provided,
      fontSize: theme.fontSizes.md,
      fontWeight: 500,
    }),
    menuList: (provided, state) => ({
      ...provided,
      maxHeight: "85px",
    }),
  };
  options = R.sortBy(R.compose(R.toLower, R.prop("label")))(options);

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
          {value &&
            R.join(
              ", ",
              sortStringArray(
                value.map((item) =>
                  R.prop("label", R.find(R.propEq("value", item))(options))
                )
              )
            )}
        </Text>
      ) : (
        <Select
          styles={customStyles}
          placeholder={placeholder}
          isClearable={true}
          options={options}
          onChange={onChange}
          defaultValue={
            value &&
            value.map((item) => R.find(R.propEq("value", item))(options))
          }
          onBlur={onBlur}
          isMulti={true}
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
