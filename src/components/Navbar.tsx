/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import styled from "@emotion/styled";
import { Icon, Link } from "components/standalone";
import { NaviGateTheme, theme } from "styles/theme";
import { ContextSwitcher } from "./ContextSwitcher";
import { component, createSub, derive } from "framework-x";
import {
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
} from "@chakra-ui/core";
import { getRouteId } from "../routes/selectors";
import { Db } from "../store";
import { routeEvent, routeIds } from "../routes/events";
import { FaCog, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import { authEvent } from "auth/events";
import { getCurrentUser } from "users/selectors";
import { isAdmin, isRoot, isCustomerAdmin } from "../util";
import { getCustomerList } from "../customers/selectors";
import { getSubCustomerId } from "forms/selectors";
import * as R from "ramda";

const Wrapper = styled.div(
  ({ theme, active }: { theme: NaviGateTheme; active: boolean }) => ({
    width: "100%",
    backgroundColor: active ? theme.colors.cyan[400] : theme.colors.blue[700],
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 24,
    position: "sticky",
    top: 0,
    zIndex: 10,
  })
);

const NavbarIcon = ({
  iconName,
  onClick,
  active,
}: {
  iconName: string;
  onClick: any;
  active: boolean;
}) => {
  return (
    <Link
      css={{
        height: 36,
        width: 36,
        backgroundColor: active
          ? theme.colors.cyan[400]
          : theme.colors.blue[600],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
      }}
      onClick={onClick}
    >
      <Icon name={iconName} size={"24px"} />
    </Link>
  );
};

const Routes = ({ dispatch, activeContext, user }) => {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        "& > *": { marginLeft: 16 },
      }}
    >
      {user && (
        <Menu>
          <MenuButton
            transition="all 0.2s"
            _hover={{ backgroundColor: theme.colors.cyan[400] }}
            _expanded={{ backgroundColor: theme.colors.cyan[400] }}
            css={{
              height: 36,
              width: 36,
              backgroundColor:
                // activeContext === "settings"
                // ? theme.colors.cyan[400] :
                theme.colors.blue[600],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            <Icon name="settings" size={"24px"} />
          </MenuButton>
          <MenuList minW={0} w={"150px"} css={{ marginRight: "55px" }}>
            {isAdmin(user) && (
              <MenuItem
                color={theme.colors.cyan[500]}
                fontSize="sm"
                onClick={() => dispatch(routeEvent.NAV_TO, [routeIds.SETTINGS])}
              >
                <FaCog size={"15px"} css={{ marginRight: "10px" }} />
                Settings
              </MenuItem>
            )}
            {(isRoot(user) || isCustomerAdmin(user)) && (
              <MenuItem
                color={theme.colors.cyan[500]}
                fontSize="sm"
                onClick={() =>
                  dispatch(routeEvent.NAV_TO, [routeIds.CUSTOMER_LIST])
                }
              >
                <FaUsers size={"15px"} css={{ marginRight: "10px" }} />
                Customers
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
      <Menu>
        <MenuButton
          transition="all 0.2s"
          _hover={{ backgroundColor: theme.colors.cyan[400] }}
          _expanded={{ backgroundColor: theme.colors.cyan[400] }}
          css={{
            height: 36,
            width: 36,
            backgroundColor:
              // activeContext === "user" ?
              // theme.colors.cyan[400] :
              theme.colors.blue[600],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <Icon name="user" size={"24px"} />
        </MenuButton>
        <MenuList minW={0} w={"180px"}>
          {user && (
            <MenuItem
              color={theme.colors.cyan[500]}
              fontSize="sm"
              onClick={() => dispatch(routeEvent.NAV_TO, [routeIds.USER_LIST])}
            >
              <FaUser size={"15px"} css={{ marginRight: "10px" }} />
              Manage Users
            </MenuItem>
          )}
          <MenuItem
            color={theme.colors.cyan[500]}
            fontSize="sm"
            onClick={() => dispatch(authEvent.LOGOUT)}
          >
            <FaSignOutAlt size={"15px"} css={{ marginRight: "10px" }} />
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};
type ActiveContext = "vessel" | "crew";

const getActiveContext: (db: Db) => ActiveContext = derive(
  [getRouteId],
  (routeId) => {
    const parts = routeId.split("/");
    return parts[0];
    // switch (routeId) {
    //   case routeIds.VESSEL_ADD:
    //   case routeIds.VESSEL_LIST:
    //   case routeIds.VESSEL_DETAIL:
    //     return 'vessel';
    //
    //   case routeIds.CREW_ADD:
    //   case routeIds.CREW_LIST:
    //   case routeIds.CREW_DETAIL:
    //     return 'crew';
    //
    //   case routeIds.USER_ADD:
    //   case routeIds.USER_DETAIL:
    //   case routeIds.USER_LIST:
    //     return 'user';
    //
    //   case routeIds.SETTINGS:
    //     return 'settings';
    //
    //   default:
    //     return '?';
    // }
  }
);

export const Navbar = component(
  "Navbar",
  createSub({ getActiveContext, getRouteId, getCustomerList }),
  ({ dispatch, activeContext, currentUser, routeId, customerList }) => {
    const disabled =
      isCustomerAdmin(currentUser) &&
      [
        routeIds.CUSTOMER_LIST,
        routeIds.CUSTOMER_ADD,
        routeIds.CUSTOMER_DELETE,
      ].indexOf(routeId) > -1;
    const subCustomer = R.prop(getSubCustomerId(), customerList);
    return (
      <Wrapper>
        <Image
          css={{ height: 32, ...theme.noUserSelect }}
          src={require("../assets/navigate-logo.png")}
        />
        {(isAdmin(currentUser) || isCustomerAdmin(currentUser)) && (
          <ContextSwitcher activeContext={activeContext} disabled={disabled} />
        )}
        <div
          css={{
            display: "flex",
            alignItems: "center",
            "& > :not(:first-child)": { marginLeft: 16 },
          }}
        >
          {subCustomer && !disabled && (
            <Box
              fontSize="14px"
              position="absolute"
              right="130px"
              whiteSpace="nowrap"
            >
              Managing: {subCustomer.name}
            </Box>
          )}
          <Routes
            dispatch={dispatch}
            activeContext={activeContext}
            user={currentUser}
          />
        </div>
      </Wrapper>
    );
  }
);
