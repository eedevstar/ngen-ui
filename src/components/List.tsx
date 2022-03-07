/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { Box, Flex, Text } from "components/standalone";
import { theme } from "styles/theme";

export const List = ({ header, items, ListItem, onSelect = (item) => {} }) => {
  return (
    <Flex
      css={{
        border: `1px solid ${theme.colors.gray[100]}`,
        borderRadius: 4,
        flexDirection: "column",
        height: "min-content",
        overflow: "hidden",
      }}
    >
      <Box
        css={{
          backgroundColor: theme.colors.blue[900],
        }}
      >
        <Text
          css={{
            fontFamily: theme.fonts.heading,
            fontSize: theme.fontSizes.xl,
            color: theme.colors.gray[50],
            marginTop: 24,
            marginBottom: 12,
            marginLeft: 16,
          }}
        >
          {header}
        </Text>
      </Box>
      <Box
        css={{ "& > *": { borderTop: `1px solid ${theme.colors.gray[100]}` } }}
      >
        {items.map((item, index) => (
          <div onClick={() => onSelect(item)} key={index}>
            <ListItem {...item} />
          </div>
        ))}
      </Box>
    </Flex>
  );
};
