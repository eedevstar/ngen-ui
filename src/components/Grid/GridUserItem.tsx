/** @jsx jsx */
import { jsx } from "@emotion/core";
import { component, createSub } from "framework-x";
import React from "react";
import * as R from "ramda";
import { Flex, Image, Text, Spinner } from "components/standalone";
import { theme } from "styles/theme";
import { getSelectedItem } from "forms/selectors";
import { dispatch } from "store";
import { formEvt } from "forms/events";
import { getProcessingList } from "forms/selectors";
import { getCurrentUser } from "users/selectors";

export default component(
  "GridUserItem",
  createSub({
    selectedUser: getSelectedItem("user"),
    currentUser: getCurrentUser,
    getProcessingList,
  }),
  ({
    selectedUser,
    processingList,
    currentUser,
    image,
    fullname,
    isReadOnly,
    id,
    ...props
  }) => {
    const isProcessing = R.pathOr(false, [id], processingList) == true;
    const canSelect = currentUser.role != "readonly" || currentUser.id == id;
    return (
      <Flex
        css={{
          border: `1px solid ${theme.colors.gray[200]}`,
          background: canSelect ? theme.colors.white : theme.colors.blue[900],
          borderRadius: 4,
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 16,
          paddingBottom: 28,
          position: "relative",
          cursor: canSelect ? "pointer" : "default",
        }}
        boxShadow={selectedUser == id ? "outline" : null}
        onClick={() =>
          canSelect && !isProcessing
            ? selectedUser == id
              ? dispatch(formEvt.DESELECT_ITEM, { type: "user" })
              : dispatch(formEvt.SELECT_ITEM, { type: "user", value: id })
            : null
        }
        {...props}
      >
        <Spinner
          position={"absolute"}
          left={"11px"}
          display={!isProcessing ? "none" : "block"}
          top={"12px"}
          size="xs"
          color={theme.colors.gray[500]}
        />
        <Flex
          css={{
            height: 80,
            backgroundColor: theme.colors.gray[100],
            width: 80,
            borderRadius: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Image
            css={{
              height: image ? "100%" : 48,
              width: image ? "100%" : 48,
              maxHeight: 114,
              borderRadius: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={image}
            fallbackSrc={
              isReadOnly
                ? require("../../assets/user-line.svg")
                : require("../../assets/admin-line.svg")
            }
          />
        </Flex>
        <Text
          css={{
            lineHeight: 1.4,
            verticalAlign: "middle",
            textAlign: "center",
            fontSize: theme.fontSizes.sm,
          }}
        >
          {fullname}
        </Text>
      </Flex>
    );
  }
);
