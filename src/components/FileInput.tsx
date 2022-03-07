/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { FormControl } from "components/standalone";
import {
  Flex,
  FormLabel,
  InputGroup,
  InputRightElement,
  Text,
  Box,
} from "@chakra-ui/core";
import { theme } from "styles/theme";
import { vesselEvent } from "vessels/events";
import { dispatch } from "store";
import moment from "moment";
import { getDateFormat } from "../util";
import * as R from "ramda";

export const FileInput = ({
  value,
  onChange,
  onDelete,
  readonly,
  original = null,
  showDetail = false,
  downloadEvent,
  identifier = "attach-doc",
  label = "Attach Document",
  placeholder = "Browse for a document...",
  description = "Supported formats: PDF, PNG, JPG, JPEG",
  ...props
}) => {
  const ref = useRef();
  console.log("original file", original);
  const dateFormat = getDateFormat();
  return (
    <FormControl flexGrow={1} position={"relative"} {...props}>
      <input
        ref={ref}
        type="file"
        css={{ display: "none" }}
        onChange={onChange}
      />
      {readonly ? (
        <div>
          <FormLabel
            fontFamily={theme.fonts.heading}
            fontSize={theme.fontSizes.sm}
            fontWeight={theme.fontWeights.bold}
            color={theme.colors.black}
          >
            {label}
          </FormLabel>
          <Flex
            border="1px"
            borderColor={theme.colors.gray[200]}
            backgroundColor={theme.colors.gray[50]}
            justifyContent="space-between"
            borderRadius="0.25rem"
            alignItems="center"
          >
            <Text padding="0.5rem 1rem" fontSize="sm">
              {original ? original.fileName : "N/A"}
            </Text>
            {original && (
              <Button
                h={"1.75rem"}
                mr={2}
                bg={"cyan.400"}
                _hover={{ backgroundColor: "cyan.600" }}
                onClick={() =>
                  dispatch(downloadEvent, {
                    id: original.id,
                  })
                }
                leftIcon="download"
              >
                Download
              </Button>
            )}
          </Flex>
          {original && showDetail && (
            <Flex marginTop={"0.1rem"}>
              <Text
                fontSize="sm"
                marginRight={"1rem"}
                display="flex"
                alignItems={"center"}
              >
                <FormLabel
                  fontFamily={theme.fonts.heading}
                  fontSize={theme.fontSizes.sm}
                  fontWeight={theme.fontWeights.bold}
                  color={theme.colors.black}
                  paddingBottom={0}
                >
                  Last uploaded:
                </FormLabel>
                <Text>
                  {moment(
                    original.updated ? original.updated : original.created
                  ).format(dateFormat)}
                  ,
                </Text>
              </Text>
              <Text fontSize="sm" display="flex" alignItems={"center"}>
                <FormLabel
                  fontFamily={theme.fonts.heading}
                  fontSize={theme.fontSizes.sm}
                  fontWeight={theme.fontWeights.bold}
                  color={theme.colors.black}
                  paddingBottom={0}
                >
                  Last modified by:
                </FormLabel>
                <Text>{R.propOr("", "modifierName", original)}</Text>
              </Text>
            </Flex>
          )}
        </div>
      ) : (
        <Input
          identifier={identifier}
          label={label}
          placeholder={value?.name || placeholder}
          description={value === "deleted" ? "Removed on save" : description}
          value={value?.name || original?.fileName || ""}
          rightElement={
            !readonly && (
              <Box>
                <Button
                  h={"1.75rem"}
                  mr={2}
                  bg={"cyan.400"}
                  _hover={{ backgroundColor: "cyan.600" }}
                  readOnly={true}
                  onClick={() => ref.current.click()}
                >
                  {original ? "Change" : "Browse"}
                </Button>

                {original && (
                  <Button
                    h={"1.75rem"}
                    mr={2}
                    bg={"red.400"}
                    _hover={{ backgroundColor: "red.600" }}
                    onClick={() => onDelete(original.id)}
                    leftIcon={value === "deleted" ? "close" : "trash"}
                  >
                    {value === "deleted" ? "Cancel" : "Remove"}
                  </Button>
                )}
              </Box>
            )
          }
        />
      )}
    </FormControl>
  );
};
