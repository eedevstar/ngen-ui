/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import {
  FormControl,
  Image,
  FormLabel,
  Text,
  Box,
  Stack,
} from "components/standalone";
import { theme } from "styles/theme";
import { FormHelperText } from "@chakra-ui/core";

export const ImageInput = ({
  value,
  onChange,
  readonly,
  light,
  identifier = "attach-image",
  label = "Attach Image",
  placeholder = "Browse for a Image...",
  description = "Supported formats: PDF, PNG, JPG, JPEG",
  ...props
}) => {
  const ref = useRef();
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
      <Stack direction="row">
        <Box
          p={1}
          w="30%"
          borderRadius="4px"
          borderWidth="1px"
          borderColor={theme.colors.gray[100]}
        >
          {value ? (
            <Image boxSize="100px" src={`data:image/png;base64,${value}`} />
          ) : (
            <Text
              textAlign="center"
              pt="10"
              pb="10"
              color={theme.colors.gray[300]}
            >
              No Image
            </Text>
          )}
        </Box>
        {!readonly && (
          <Box>
            <Button
              h={"1.75rem"}
              mr={2}
              bg={"cyan.400"}
              _hover={{ backgroundColor: "cyan.600" }}
              readOnly={true}
              onClick={() => ref.current.click()}
            >
              {value ? "Change" : "Browse"}
            </Button>
            {description && (
              <FormHelperText fontSize={theme.fontSizes.xs}>
                {description}
              </FormHelperText>
            )}
          </Box>
        )}
      </Stack>
      <input
        ref={ref}
        type="file"
        css={{ display: "none" }}
        onChange={onChange}
      />
      <input type="hidden" value={value} />
    </FormControl>
  );
};
