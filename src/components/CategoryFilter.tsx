/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { Children, useEffect, useState } from "react";
import { Icon } from "components/standalone";
import { theme } from "styles/theme";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Text,
  Radio,
  Flex,
} from "@chakra-ui/core";
import {
  FaAngleLeft,
  FaAngleRight,
  FaArrowDown,
  FaCaretDown,
} from "react-icons/fa";
import { Disabled } from "_stories/Button.stories";
import { formEvt } from "forms/events";
import { fx } from "store";

export function CategoryFilter({
  categories = 1,
  selected,
  changeCategoryCallback,
}) {
  function onChangeCategory(c) {
    changeCategoryCallback(c);
  }

  return (
    <Menu>
      <MenuButton
        fontSize={"xs"}
        marginLeft={"0.8rem"}
        border={`solid 1px ${theme.colors.gray[300]}`}
        borderRadius="3px"
        padding="3px 5px"
      >
        <Flex alignItems="center">
          <Text>{selected}</Text>
          <FaCaretDown
            size={"14px"}
            height={"18px"}
            css={{ marginLeft: "3px" }}
          />
        </Flex>
      </MenuButton>
      <MenuList minW={0}>
        <MenuItem fontSize="xs" onClick={() => onChangeCategory("All")}>
          <Text fontSize={"xs"}>All</Text>
        </MenuItem>
        {categories.map((c, i) => (
          <MenuItem
            fontSize="xs"
            onClick={() => onChangeCategory(c)}
            key={`category${i}`}
          >
            <Text fontSize={"xs"}>{c}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
