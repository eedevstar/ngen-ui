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
} from "@chakra-ui/core";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Disabled } from "_stories/Button.stories";
import { formEvt } from "forms/events";
import { fx } from "store";

const PageButton = ({
  isDisabled,
  isApplicable = true,
  isSelected,
  children,
  onChangePage,
  page,
  ...props
}: {
  isDisabled?: boolean;
  isApplicable?: boolean;
  isSelected?: boolean;
  onChangePage?: any;
  children: any;
  page: number;
}) => {
  return (
    <Button
      isDisabled={isDisabled}
      borderStyle={"solid"}
      borderWidth={"1px"}
      borderColor={
        isApplicable ? theme.colors.cyan["400"] : theme.colors.gray["400"]
      }
      _hover={{
        backgroundColor: isApplicable
          ? theme.colors.cyan["400"]
          : theme.colors.white,
        color: isApplicable ? theme.colors.white : theme.colors.gray["400"],
      }}
      _active={{
        backgroundColor: isApplicable
          ? theme.colors.cyan["400"]
          : theme.colors.gray["400"],
        color: theme.colors.white,
      }}
      bg={
        isSelected
          ? isApplicable
            ? theme.colors.cyan["400"]
            : theme.colors.gray["400"]
          : theme.colors.white
      }
      color={
        isSelected
          ? theme.colors.white
          : isApplicable
          ? theme.colors.cyan["400"]
          : theme.colors.gray["400"]
      }
      size={"xs"}
      margin={"0 0.2rem"}
      onClick={() => (onChangePage ? onChangePage(page) : void 0)}
    >
      {children}
    </Button>
  );
};

export function Pagination({
  total,
  perPage,
  currentPage = 1,
  changePageCallback,
  changePageSizeCallback,
}) {
  const totalPages = Math.ceil(total / perPage);
  const shows = 5;
  let start = 1;
  let end = totalPages;
  if (totalPages > shows) {
    start = currentPage - 2;
    end = currentPage + 2;
    if (start < 1) {
      end = Math.min(totalPages, end - start + 1);
      start = 1;
    } else if (end > totalPages) {
      start = Math.max(1, start - (end - totalPages));
      end = totalPages;
    }
  }

  function onChangePage(c) {
    changePageCallback(c);
  }

  function onChangePageSize(c) {
    changePageSizeCallback(c);
  }

  let buttons = [];
  for (let i = start; i <= end; i++) {
    buttons.push(
      <PageButton
        isSelected={i == currentPage}
        page={i}
        onChangePage={onChangePage}
      >
        {i}
      </PageButton>
    );
  }

  const pageSizes = [10, 20, 50];

  return total > 0 ? (
    <Stack direction={"row"} alignItems={"center"}>
      <Text fontSize={"xs"}>
        (Showing {(currentPage - 1) * perPage + 1} ~{" "}
        {Math.min(total, currentPage * perPage)} of {total} Total)
      </Text>
      <PageButton
        isDisabled={currentPage == 1}
        page={currentPage - 1}
        onChangePage={onChangePage}
      >
        <FaAngleLeft size="12" />
      </PageButton>
      {buttons}
      <PageButton
        isDisabled={currentPage == totalPages}
        page={currentPage + 1}
        onChangePage={onChangePage}
      >
        <FaAngleRight size="12" />
      </PageButton>
      <Menu>
        <MenuButton display="flex">
          <Icon
            name="settings"
            size={"18px"}
            marginLeft={"5px"}
            color={theme.colors.cyan[500]}
          />
        </MenuButton>
        <MenuList minW={0} w={"120px"}>
          <Text fontSize="xs" margin={"0 1rem 0.5rem"}>
            Page size
          </Text>
          {pageSizes.map((c, i) => (
            <MenuItem
              fontSize="xs"
              onClick={() => onChangePageSize(c)}
              key={`pagesize${i}`}
            >
              <Radio
                key={`ps${i}`}
                value={c}
                size={"sm"}
                style={{ fontSize: "12px" }}
                isChecked={perPage == c}
              >
                <Text fontSize={"xs"}>{c} rules</Text>
              </Radio>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Stack>
  ) : (
    <Stack direction={"row"} alignItems={"center"}>
      <Text fontSize="sm">(0 Total)</Text>
      <PageButton isApplicable={false} isDisabled={true} page={1}>
        <FaAngleLeft size="12" />
      </PageButton>
      <PageButton isApplicable={false} isDisabled={true} page={1}>
        1
      </PageButton>
      <PageButton isApplicable={false} isDisabled={true} page={1}>
        <FaAngleRight size="12" />
      </PageButton>
    </Stack>
  );
}
