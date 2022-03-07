/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Box, PseudoBox } from "components/standalone";
import { BoxProps } from "@chakra-ui/core";

/**
 * The style of this component is inspired by Tailwind UI.
 * @see https://tailwindui.com/components/application-ui/tables/wide
 */

/**
 * Represents tabular data - that is, information presented in a
 * two-dimensional table comprised of rows and columns of cells containing
 * data. It renders a `<table>` HTML element.
 */
export function Table(props: BoxProps) {
  return (
    <Box rounded="md" overflow="hidden">
      <Box
        borderWidth={1}
        borderColor={"gray.100"}
        borderRadius={4}
        as="table"
        width="full"
        {...props}
      />
    </Box>
  );
}

/**
 * Defines a set of rows defining the head of the columns of the table. It
 * renders a `<thead>` HTML element.
 */
export function TableHead(props: BoxProps) {
  return <Box as="thead" {...props} />;
}

/**
 * Defines a row of cells in a table. The row's cells can then be established
 * using a mix of `TableCell` and `TableHeader` elements. It renders a `<tr>`
 * HTML element.
 */
export function TableRow({
  flag,
  ...props
}: {
  props: BoxProps;
  flag: number;
}) {
  const handleFlagBgColor = () => {
    switch (flag) {
      case 0:
        return "white";
      case 1:
        return "orange.100";
      case 2:
        return "red.100";
    }
  };

  const handleFlagFontColor = () => {
    switch (flag) {
      case 0:
        return "black";
      case 1:
        return "orange.400";
      case 2:
        return "red.400";
    }
  };

  const handleFlagBorderColor = () => {
    switch (flag) {
      case 0:
        return "gray.100";
      case 1:
        return "orange.200";
      case 2:
        return "red.200";
    }
  };

  return (
    <PseudoBox
      as="tr"
      borderColor={handleFlagBorderColor()}
      borderBottomWidth={1}
      data-flag={flag}
      {...props}
      bg={handleFlagBgColor()}
      color={handleFlagFontColor()}
    />
  );
}

/**
 * Defines a cell as header of a group of table cells. It renders a `<th>` HTML
 * element.
 */
export function TableHeader(props: BoxProps) {
  return (
    <Box
      as="th"
      px="6"
      py="3"
      backgroundColor="gray.50"
      textAlign={props.textAlign ? props.textAlign : "left"}
      fontSize="sm"
      color="gray.400"
      fontFamily="heading"
      lineHeight="1rem"
      fontWeight="regular"
      borderBottomWidth={1}
      borderColor="gray.100"
      {...props}
    />
  );
}

/**
 * Encapsulates a set of table rows, indicating that they comprise the body of
 * the table. It renders a `<tbody>` HTML element.
 */
export function TableBody(props: BoxProps) {
  return <Box as="tbody" {...props} />;
}

/**
 * Defines a cell of a table that contains data. It renders a `<td>` HTML
 * element.
 */
export function TableCell(props: BoxProps) {
  return (
    <Box
      as="td"
      px="6"
      py="3"
      lineHeight="1.25rem"
      whiteSpace="nowrap"
      {...props}
    />
  );
}
