/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import { theme } from "../styles/theme";
import { Button, Image, Input, Link, Stack, Text } from "../components";
import { component, createSub } from "framework-x";
import { routeEvent, routeIds } from "../routes/events";
import { authEvent } from "./events";
import { dispatch } from "store";
import { formEvt } from "../forms/events";
import { getCookieConsent, getRouteId } from "routes/selectors";
import { evt } from "app/events";
import { getIsSubmitting } from "forms/selectors";
const CookieWarning = component(
  "CookieWarning",
  createSub({
    isAgree: getCookieConsent,
    getRouteId,
  }),
  ({ isAgree, routeId }) => {
    if (isAgree) {
      return null;
    }
    return (
      <div
        css={{
          display: "flex",
          backgroundColor: "rgba(6,18,33,0.7)",
          width: "100vw",
          height: 184,
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack width={800} marginRight={140}>
          <Text
            css={{
              fontFamily: theme.fonts.heading,
              fontSize: theme.fontSizes.xl,
              color: theme.colors.white,
              fontWeight: theme.fontWeights.bold,
            }}
          >
            Cookie and Privacy Warnings
          </Text>
          <Text
            css={{
              fontSize: theme.fontSizes.sm,
              color: theme.colors.gray[300],
            }}
          >
            Cookies and IP addresses allow us to deliver and improve our web
            content and to provide you with a personalized experience. Our
            website uses cookies and collects your IP address for these
            purposes. Learn more Navigate may use cookies and my IP address to
            collect individual statistics subject to the Privacy Policy and the
            Terms of Use. Navigate may use third-party services for this
            purpose. I can revoke my consent at any time by visiting the Opt-Out
            page.
          </Text>
        </Stack>
        <Button
          width={144}
          css={{
            backgroundColor: theme.colors.cyan[400],
            ":hover": {
              backgroundColor: theme.colors.cyan[600],
            },
          }}
          onClick={() => dispatch(evt.AGREE_COOKIE_CONSENT)}
        >
          Accept
        </Button>
      </div>
    );
  }
);

const Login = component(
  "Login",
  createSub({
    isSubmitting: getIsSubmitting,
  }),
  ({
    isSubmitting,
    username,
    password,
    setUsername,
    setPassword,
    usernameRef,
    passwordRef,
    dispatch,
  }) => {
    const checkSubmit = () => {
      if (!username) {
        usernameRef.current.focus();
      }
      if (!password) {
        passwordRef.current.focus();
      }
      if (username && password) {
        dispatch(authEvent.LOGIN, { username, password });
      }
    };

    return (
      <div
        css={{
          backgroundColor: theme.colors.blue[700],
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          zIndex: 11,
        }}
      >
        <form>
          <Stack
            width={400}
            spacing={16}
            justifyContent={"center"}
            marginTop={-120}
            zIndex={10}
          >
            <Image
              alignSelf={"center"}
              src={require("../assets/navigate-logo.png")}
              alt="NaviGate: Your online compliance gateway"
              htmlWidth={280}
              objectFit={"contain"}
            />
            <Stack spacing={4}>
              <Input
                light
                ref={usernameRef}
                type={"email"}
                label={"Username"}
                placeholder={"Enter your username"}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    checkSubmit();
                  }
                }}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                light
                ref={passwordRef}
                type={"password"}
                label={"Password"}
                placeholder={"Enter your password"}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    checkSubmit();
                  }
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/*<Link*/}
              {/*  color={theme.colors.cyan[400]}*/}
              {/*  fontSize={theme.fontSizes.sm}*/}
              {/*  alignSelf={'flex-end'}*/}
              {/*>*/}
              {/*  Forgot your password?*/}
              {/*</Link>*/}
            </Stack>
            <Button
              isLoading={isSubmitting}
              css={{
                backgroundColor: theme.colors.cyan[400],
                ":hover": {
                  backgroundColor: theme.colors.cyan[600],
                },
              }}
              onClick={() => dispatch(authEvent.LOGIN, { username, password })}
            >
              Login
            </Button>
          </Stack>
        </form>
        <Image
          src={require("../assets/login-art.svg")}
          css={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 120,
            width: "100vw",
            minWidth: 1024,
            zIndex: 0,
          }}
        />
        <CookieWarning />
      </div>
    );
  }
);

export default function () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  return (
    <Login
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      usernameRef={usernameRef}
      passwordRef={passwordRef}
    />
  );
}
